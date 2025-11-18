'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { X, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageLoader from '@/components/ui/PageLoader';

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  imagePaths: string[];
  stockS: number;
  stockM: number;
  stockL: number;
  stockXL: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState(0);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5195/api/SpecialCollection/${productId}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleCloseCart = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsCartOpen(false);
      setIsClosing(false);
    }, 500);
  };

  const handlePrevImage = () => {
    setFullscreenImageIndex((prev) =>
      prev === 0 ? product!.imagePaths.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setFullscreenImageIndex((prev) =>
      prev === product!.imagePaths.length - 1 ? 0 : prev + 1
    );
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
    setShowMagnifier(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    const elem = e.currentTarget;
    const { top, left, width, height } = elem.getBoundingClientRect();

    // Cursor position relative to image
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Calculate position percentage for background
    const xPercent = (x / width) * 100;
    const yPercent = (y / height) * 100;

    setCursorPos({ x: e.clientX, y: e.clientY });
    setMagnifierPos({ x: xPercent, y: yPercent });
  };

  const handleMouseEnter = () => {
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  // Keyboard navigation for fullscreen
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseFullscreen();
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, product]);

  if (loading || !product) {
    return <PageLoader />;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white -mt-16">
        {/* Product Section */}
        <section className="py-0">
          <div className="w-full">
            <div className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Product Images - Left Side */}
                <div className="relative">
                  {product.imagePaths.map((image, index) => (
                    <div
                      key={index}
                      className="relative w-full h-screen bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setFullscreenImageIndex(index);
                        setIsFullscreen(true);
                      }}
                    >
                      <img
                        src={image}
                        alt={`Ürün görseli ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Product Info - Sticky Right Side */}
                <div className="flex flex-col px-16 py-8 sticky top-0 h-screen justify-center">
                  <h1 className="text-2xl font-light mb-2 text-black tracking-wide">{product.name}</h1>
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-8 font-light">{product.description}</p>
                  )}

                  <div className="space-y-10 mt-4">
                    <div>
                      <h3 className="text-xs font-medium mb-4 text-black uppercase tracking-wider">Beden Seçiniz</h3>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { size: 'S', stock: product.stockS },
                          { size: 'M', stock: product.stockM },
                          { size: 'L', stock: product.stockL },
                          { size: 'XL', stock: product.stockXL },
                        ].map(({ size, stock }) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            disabled={stock === 0}
                            className={`border py-2.5 text-center text-sm font-normal transition-colors ${
                              stock === 0
                                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                : selectedSize === size
                                ? 'border-black bg-black text-white'
                                : 'border-gray-300 hover:border-black text-black'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (!selectedSize) {
                          alert('Lütfen bir beden seçin');
                          return;
                        }
                        setIsOpening(true);
                        setIsCartOpen(true);
                        setTimeout(() => setIsOpening(false), 50);
                      }}
                      className="w-full bg-black text-white py-3.5 text-sm font-medium hover:bg-gray-800 transition-colors uppercase tracking-wider"
                    >
                      Sepete Ekle - ₺{product.price.toLocaleString('tr-TR')}
                    </button>

                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-xs font-medium mb-4 text-black uppercase tracking-wider">Özellikler</h3>
                      <ul className="space-y-2.5 text-sm text-gray-700 font-light leading-relaxed">
                        <li>• %100 Premium Pamuk</li>
                        <li>• Oversize Kesim</li>
                        <li>• Özel Koleksiyon Logosu</li>
                        <li>• Yüksek Kalite Baskı</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Shopping Cart Drawer */}
      {isCartOpen && (
        <>
          {/* Overlay with Blur */}
          <div
            className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] transition-all duration-500 ease-out ${
              isClosing ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={handleCloseCart}
          />

          {/* Drawer */}
          <div className={`fixed top-0 right-0 h-full w-full md:w-1/2 bg-white z-[70] shadow-2xl transform transition-all duration-500 ease-out flex flex-col ${
            isClosing ? 'translate-x-full opacity-0' : isOpening ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
          }`}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-black">Sepetim</h2>
              <button
                onClick={handleCloseCart}
                className="text-gray-500 hover:text-black transition-colors"
                aria-label="Sepeti kapat"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Product Item Card */}
                <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                  <div className="flex gap-0">
                    <div className="w-44 h-56 bg-white overflow-hidden flex-shrink-0">
                      <img
                        src={product.imagePaths[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between p-6">
                      <div>
                        <h3 className="font-normal text-black mb-3 text-xl leading-tight">{product.name}</h3>
                        <p className="text-base text-gray-400 mb-2">Beden: {selectedSize}</p>
                        <p className="text-base text-gray-400">Adet: 1</p>
                      </div>
                      <p className="font-bold text-black text-2xl mt-4">
                        ₺{product.price.toLocaleString('tr-TR')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-6 space-y-3">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium text-black text-base">Toplam</span>
                <span className="font-bold text-black text-xl">
                  ₺{product.price.toLocaleString('tr-TR')}
                </span>
              </div>
              <button className="w-full bg-black text-white py-3.5 text-sm font-medium hover:bg-gray-800 transition-colors rounded">
                Ödemeye Geç
              </button>
              <button
                onClick={handleCloseCart}
                className="w-full text-black py-2 text-xs font-normal hover:underline transition-all"
              >
                veya Alışverişe Devam Et
              </button>
            </div>
          </div>
        </>
      )}

      {/* Fullscreen Photo Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center overflow-hidden">
          {/* Close Button */}
          <button
            onClick={handleCloseFullscreen}
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-[110]"
            aria-label="Kapat"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevImage}
            className="absolute left-6 text-white hover:text-gray-300 transition-colors z-[110]"
            aria-label="Önceki fotoğraf"
          >
            <ChevronLeft className="w-12 h-12" />
          </button>

          <button
            onClick={handleNextImage}
            className="absolute right-6 text-white hover:text-gray-300 transition-colors z-[110]"
            aria-label="Sonraki fotoğraf"
          >
            <ChevronRight className="w-12 h-12" />
          </button>

          {/* Image Container with Magnifier */}
          <div className="relative max-w-full max-h-full flex items-center justify-center">
            <img
              src={product.imagePaths[fullscreenImageIndex]}
              alt={`Ürün görseli ${fullscreenImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              draggable={false}
            />

            {/* Magnifier Window - Fixed Position */}
            {showMagnifier && (
              <div
                className="absolute pointer-events-none border-4 border-white shadow-2xl bg-white top-6 right-6"
                style={{
                  width: '350px',
                  height: '350px',
                  backgroundImage: `url(${product.imagePaths[fullscreenImageIndex]})`,
                  backgroundPosition: `${magnifierPos.x}% ${magnifierPos.y}%`,
                  backgroundSize: '600%',
                  backgroundRepeat: 'no-repeat',
                  zIndex: 150,
                }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
