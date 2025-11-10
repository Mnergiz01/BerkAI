'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { Product } from '@/types/api';
import { formatPrice } from '@/lib/utils/format';
import { addToCart } from '@/lib/api/cart';
import { useCartStore } from '@/lib/stores/cartStore';
import { useAuthStore } from '@/lib/stores/authStore';
import { Button } from '@/components/ui/Button';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated } = useAuthStore();
  const { setCart } = useCartStore();

  const addToCartMutation = useMutation({
    mutationFn: () => addToCart({ productId: product.id, quantity }),
    onSuccess: (cart) => {
      setCart(cart);
      toast.success('Added to cart!');
      setQuantity(1);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add to cart');
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    addToCartMutation.mutate();
  };

  const isOutOfStock = product.stockQuantity === 0;

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-lg">
      <Link href={`/products/${product.id}`}>
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <svg
                className="h-24 w-24 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="rounded bg-red-600 px-3 py-1 text-sm font-semibold text-white">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Brand & Category */}
          <div className="mb-2 flex items-center justify-between text-xs text-gray-700">
            {product.brandName && <span>{product.brandName}</span>}
            {product.categoryName && <span>{product.categoryName}</span>}
          </div>

          {/* Product Name */}
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900">
            {product.name}
          </h3>

          {/* Product Description */}
          <p className="mb-3 line-clamp-2 text-sm text-gray-800">
            {product.description}
          </p>

          {/* Price & Stock */}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-600">
              {formatPrice(product.price)}
            </span>
            {!isOutOfStock && (
              <span className="text-sm text-gray-700">
                {product.stockQuantity} in stock
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      {!isOutOfStock && (
        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max={product.stockQuantity}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 rounded border border-gray-300 px-2 py-1 text-center"
              onClick={(e) => e.preventDefault()}
            />
            <Button
              onClick={handleAddToCart}
              className="flex-1"
              isLoading={addToCartMutation.isPending}
              disabled={!isAuthenticated}
            >
              {isAuthenticated ? 'Add to Cart' : 'Login to Buy'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
export default ProductCard;
