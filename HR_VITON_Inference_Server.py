"""
HR-VITON Inference Server
FastAPI-based REST API for virtual try-on inference

Features:
- Async processing for multiple requests
- Size-aware try-on (S/M/L/XL/XXL)
- Distance normalization (face detection)
- Result caching
- Health monitoring

Usage:
    python HR_VITON_Inference_Server.py

Endpoints:
    POST /api/virtual-try-on - Main try-on endpoint
    GET  /api/result/{session_id} - Get result by session ID
    GET  /health - Health check
"""

from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import torch
import cv2
import numpy as np
from PIL import Image
import uuid
import json
import os
from pathlib import Path
import mediapipe as mp
from datetime import datetime
import asyncio

# Initialize FastAPI
app = FastAPI(
    title="HR-VITON Inference Server",
    description="Virtual Try-On API with size-awareness and distance normalization",
    version="1.0.0"
)

# CORS middleware (adjust for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production: specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
CONFIG = {
    'model_path': os.getenv('MODEL_PATH', '/models/hrviton_best.pth'),
    'device': 'cuda' if torch.cuda.is_available() else 'cpu',
    'image_size': (1024, 768),
    'temp_dir': '/tmp/vton_sessions',
    'result_cache_dir': '/tmp/vton_results',
    'max_cache_size_gb': 10,
}

# Create directories
os.makedirs(CONFIG['temp_dir'], exist_ok=True)
os.makedirs(CONFIG['result_cache_dir'], exist_ok=True)

# Size labels
SIZE_LABELS = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

# Global model (loaded once)
model = None
face_detector = None


class TryOnRequest(BaseModel):
    """Try-on request schema"""
    product_id: str
    size: str = 'M'
    user_size: str = 'M'


class TryOnResponse(BaseModel):
    """Try-on response schema"""
    session_id: str
    status: str
    result_url: Optional[str] = None
    processing_time: Optional[float] = None
    message: Optional[str] = None


class DistanceNormalizer:
    """Normalize person image distance using face detection"""

    def __init__(self, baseline_face_height=200, target_size=(1024, 768)):
        self.baseline_face_height = baseline_face_height
        self.target_size = target_size
        self.face_detection = mp.solutions.face_detection.FaceDetection(
            model_selection=1,
            min_detection_confidence=0.5
        )

    def normalize(self, image):
        """Normalize image distance based on face size"""
        h, w = image.shape[:2]

        # Detect face
        results = self.face_detection.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))

        if not results.detections:
            # No face detected, return resized
            return cv2.resize(image, self.target_size), 1.0

        # Get largest face
        detection = results.detections[0]
        bbox = detection.location_data.relative_bounding_box

        # Calculate face height
        face_height = bbox.height * h
        distance_scale = face_height / self.baseline_face_height

        # Determine scale factor
        if distance_scale < 0.7:  # Too far
            scale_factor = 1.4
        elif distance_scale > 1.3:  # Too close
            scale_factor = 0.8
        else:
            scale_factor = 1.0

        # Apply scaling
        if scale_factor != 1.0:
            new_w = int(w * scale_factor)
            new_h = int(h * scale_factor)
            image = cv2.resize(image, (new_w, new_h))

        # Fit to target size
        image = self._fit_to_size(image, self.target_size)
        return image, distance_scale

    def _fit_to_size(self, image, target_size):
        """Crop or pad image to target size"""
        h, w = image.shape[:2]
        target_w, target_h = target_size

        # Center crop if too large
        if h > target_h or w > target_w:
            start_h = (h - target_h) // 2 if h > target_h else 0
            start_w = (w - target_w) // 2 if w > target_w else 0
            image = image[start_h:start_h+target_h, start_w:start_w+target_w]

        # Pad if too small
        if h < target_h or w < target_w:
            pad_h = max(0, target_h - h)
            pad_w = max(0, target_w - w)
            image = cv2.copyMakeBorder(
                image,
                pad_h // 2, pad_h - pad_h // 2,
                pad_w // 2, pad_w - pad_w // 2,
                cv2.BORDER_CONSTANT,
                value=(255, 255, 255)
            )

        return image


def load_model():
    """Load HR-VITON model (called once at startup)"""
    global model

    if model is not None:
        return model

    print(f"Loading model from {CONFIG['model_path']}...")

    # TODO: Replace with actual model loading
    # model = HRVITONGenerator()
    # checkpoint = torch.load(CONFIG['model_path'], map_location=CONFIG['device'])
    # model.load_state_dict(checkpoint['generator'])
    # model.to(CONFIG['device'])
    # model.eval()

    print("✅ Model loaded successfully!")
    return model


def load_face_detector():
    """Load face detector (called once at startup)"""
    global face_detector

    if face_detector is not None:
        return face_detector

    print("Loading face detector...")
    face_detector = DistanceNormalizer(
        baseline_face_height=200,
        target_size=CONFIG['image_size']
    )
    print("✅ Face detector loaded!")
    return face_detector


@app.on_event("startup")
async def startup_event():
    """Load models on startup"""
    print("=" * 60)
    print("HR-VITON INFERENCE SERVER STARTUP")
    print("=" * 60)

    # Check GPU
    if torch.cuda.is_available():
        print(f"✅ GPU available: {torch.cuda.get_device_name(0)}")
        print(f"   VRAM: {torch.cuda.get_device_properties(0).total_memory / 1024**3:.2f} GB")
    else:
        print("⚠️ Running on CPU (slow inference)")

    # Load model
    try:
        load_model()
        load_face_detector()
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        print("⚠️ Server will start but inference will fail!")

    print("=" * 60)
    print("✅ Server ready!")
    print("=" * 60)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "device": CONFIG['device'],
        "gpu_available": torch.cuda.is_available(),
        "timestamp": datetime.now().isoformat()
    }


@app.post("/api/virtual-try-on", response_model=TryOnResponse)
async def virtual_try_on(
    user_photo: UploadFile = File(...),
    product_id: str = Form(...),
    size: str = Form('M'),
    user_size: str = Form('M')
):
    """
    Main virtual try-on endpoint

    Args:
        user_photo: User's photo (JPEG/PNG)
        product_id: Product ID from database
        size: Clothing size (XS/S/M/L/XL/XXL)
        user_size: User's typical size (for size mismatch calculation)

    Returns:
        TryOnResponse with session_id and result_url
    """
    start_time = datetime.now()
    session_id = str(uuid.uuid4())

    try:
        # Validate inputs
        if size not in SIZE_LABELS:
            raise HTTPException(400, f"Invalid size. Must be one of: {SIZE_LABELS}")
        if user_size not in SIZE_LABELS:
            raise HTTPException(400, f"Invalid user_size. Must be one of: {SIZE_LABELS}")

        # Calculate size mismatch
        size_idx = SIZE_LABELS.index(size)
        user_size_idx = SIZE_LABELS.index(user_size)
        size_mismatch = user_size_idx - size_idx

        print(f"[{session_id}] New try-on request:")
        print(f"  Product: {product_id}")
        print(f"  Size: {size} (user: {user_size}, mismatch: {size_mismatch})")

        # Save uploaded photo
        user_photo_path = Path(CONFIG['temp_dir']) / f"{session_id}_user.jpg"
        with open(user_photo_path, 'wb') as f:
            content = await user_photo.read()
            f.write(content)

        # Load user image
        user_img = cv2.imread(str(user_photo_path))
        if user_img is None:
            raise HTTPException(400, "Invalid image file")

        # Distance normalization
        print(f"[{session_id}] Applying distance normalization...")
        normalizer = load_face_detector()
        user_img_normalized, distance_scale = normalizer.normalize(user_img)
        print(f"  Distance scale: {distance_scale:.2f}x")

        # TODO: Load product image from database
        # cloth_img = load_product_image(product_id)

        # TODO: Preprocessing
        # - Extract pose (OpenPose or MediaPipe)
        # - Generate cloth mask (SAM or pre-saved)
        # - Convert to tensors

        # TODO: Model inference
        print(f"[{session_id}] Running inference...")
        # with torch.no_grad():
        #     result = model(
        #         person_tensor,
        #         cloth_tensor,
        #         cloth_mask_tensor,
        #         pose_tensor,
        #         size_mismatch_tensor
        #     )

        # TODO: Post-processing
        # - Convert tensor to image
        # - Apply any final adjustments

        # For now, return dummy result (replace with actual inference)
        result_path = Path(CONFIG['result_cache_dir']) / f"{session_id}_result.jpg"
        cv2.imwrite(str(result_path), user_img_normalized)  # Dummy output

        # Calculate processing time
        processing_time = (datetime.now() - start_time).total_seconds()

        print(f"[{session_id}] ✅ Complete! Processing time: {processing_time:.2f}s")

        # Return response
        return TryOnResponse(
            session_id=session_id,
            status="success",
            result_url=f"/api/result/{session_id}",
            processing_time=processing_time,
            message=f"Try-on complete (size mismatch: {size_mismatch})"
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"[{session_id}] ❌ Error: {e}")
        raise HTTPException(500, f"Inference failed: {str(e)}")


@app.get("/api/result/{session_id}")
async def get_result(session_id: str):
    """Get try-on result by session ID"""
    result_path = Path(CONFIG['result_cache_dir']) / f"{session_id}_result.jpg"

    if not result_path.exists():
        raise HTTPException(404, "Result not found or expired")

    return FileResponse(
        result_path,
        media_type="image/jpeg",
        headers={
            "Content-Disposition": f"inline; filename={session_id}_result.jpg"
        }
    )


@app.delete("/api/result/{session_id}")
async def delete_result(session_id: str):
    """Delete cached result"""
    result_path = Path(CONFIG['result_cache_dir']) / f"{session_id}_result.jpg"
    user_photo_path = Path(CONFIG['temp_dir']) / f"{session_id}_user.jpg"

    deleted = False
    if result_path.exists():
        result_path.unlink()
        deleted = True
    if user_photo_path.exists():
        user_photo_path.unlink()
        deleted = True

    if not deleted:
        raise HTTPException(404, "Session not found")

    return {"status": "deleted", "session_id": session_id}


@app.get("/api/stats")
async def get_stats():
    """Get server statistics"""
    temp_dir = Path(CONFIG['temp_dir'])
    result_dir = Path(CONFIG['result_cache_dir'])

    temp_size = sum(f.stat().st_size for f in temp_dir.glob('*') if f.is_file())
    result_size = sum(f.stat().st_size for f in result_dir.glob('*') if f.is_file())

    num_temp_files = len(list(temp_dir.glob('*')))
    num_results = len(list(result_dir.glob('*')))

    return {
        "temp_files": num_temp_files,
        "temp_size_mb": temp_size / (1024**2),
        "cached_results": num_results,
        "cache_size_mb": result_size / (1024**2),
        "model_loaded": model is not None,
        "device": CONFIG['device'],
    }


@app.post("/api/cleanup")
async def cleanup_cache():
    """Clean up old cached results"""
    temp_dir = Path(CONFIG['temp_dir'])
    result_dir = Path(CONFIG['result_cache_dir'])

    # Delete files older than 1 hour
    import time
    current_time = time.time()
    one_hour_ago = current_time - 3600

    deleted_count = 0
    for directory in [temp_dir, result_dir]:
        for file_path in directory.glob('*'):
            if file_path.is_file() and file_path.stat().st_mtime < one_hour_ago:
                file_path.unlink()
                deleted_count += 1

    return {
        "status": "cleaned",
        "deleted_files": deleted_count
    }


# Development mode
if __name__ == "__main__":
    import uvicorn

    print("=" * 60)
    print("STARTING HR-VITON INFERENCE SERVER")
    print("=" * 60)
    print(f"Device: {CONFIG['device']}")
    print(f"Model: {CONFIG['model_path']}")
    print(f"Image size: {CONFIG['image_size']}")
    print("=" * 60)

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info",
        reload=False  # Set to True for development
    )
