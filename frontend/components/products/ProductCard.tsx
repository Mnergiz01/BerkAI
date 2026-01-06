'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import type { Product } from '@/types/api';
import { useAuthStore } from '@/lib/stores/authStore';
import { useFavoritesStore } from '@/lib/stores/favoritesStore';
import toast from 'react-hot-toast';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onFavoriteAdded?: () => void;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SHOE_SIZES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

export function ProductCard({ product, onFavoriteAdded }: ProductCardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Fallback image based on product category and name - MOVED TO TOP
  const getFallbackImage = () => {
    const name = product.name.toLowerCase();
    if (name.includes('elbise')) return 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800';
    if (name.includes('bluz')) return 'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=800';
    if (name.includes('pantolon') || name.includes('jean')) return 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800';
    if (name.includes('etek')) return 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800';
    if (name.includes('ceket')) return 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800';
    if (name.includes('ayakkabı')) return 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800';
    if (name.includes('t-shirt') || name.includes('tshirt')) return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800';
    if (name.includes('gömlek')) return 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800';
    if (name.includes('kazak')) return 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800';
    if (name.includes('çanta')) return 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800';
    if (name.includes('saat')) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800';
    if (name.includes('gözlük')) return 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800';
    return 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800'; // Default fashion image
  };

  const displayImage = product.imageUrl || getFallbackImage();

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isFavorite(product.id)) {
      removeFavorite(product.id);
      toast.success('Favorilerden çıkarıldı');
    } else {
      addFavorite({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: displayImage, // Use displayImage instead of product.imageUrl
        slug: product.slug || product.id,
      });
      toast.success('Favorilere eklendi!');
      // Notify parent to open drawer
      if (onFavoriteAdded) {
        onFavoriteAdded();
      }
    }
  };

  const handleSizeClick = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    setSelectedSize(size);
    // Navigate to product page with size parameter
    router.push(`/product/${product.id}?size=${size}`);
  };

  const isOutOfStock = product.stockQuantity === 0;
  const isFavorited = isFavorite(product.id);

  // Determine if product is shoe, clothing, or accessory based on category and name
  const categoryLower = product.categoryName?.toLowerCase() || '';
  const nameLower = product.name?.toLowerCase() || '';
  const isShoe = categoryLower.includes('ayakkabı') ||
                 categoryLower.includes('bot') ||
                 categoryLower.includes('spor ayakkabı') ||
                 nameLower.includes('ayakkabı') ||
                 nameLower.includes('bot');
  const isAccessory = categoryLower.includes('aksesuar') ||
                      categoryLower.includes('çanta') ||
                      categoryLower.includes('kemer') ||
                      categoryLower.includes('şapka') ||
                      categoryLower.includes('takı') ||
                      categoryLower.includes('saat') ||
                      categoryLower.includes('gözlük') ||
                      categoryLower.includes('atkı') ||
                      categoryLower.includes('eldiven') ||
                      nameLower.includes('çanta') ||
                      nameLower.includes('saat') ||
                      nameLower.includes('gözlük') ||
                      nameLower.includes('şapka') ||
                      nameLower.includes('kemer') ||
                      nameLower.includes('atkı') ||
                      nameLower.includes('eldiven');

  // Don't show sizes for accessories
  const shouldShowSizes = !isAccessory && !isOutOfStock;
  const sizeLabel = isShoe ? 'NUMARA SEÇ' : 'BEDEN SEÇ';

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative">
        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-1.5 shadow-sm hover:shadow-md"
          aria-label={isFavorited ? 'Favorilerden çıkar' : 'Favorilere ekle'}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isFavorited ? 'fill-black text-black' : 'text-gray-700'
            }`}
          />
        </button>

        {/* Product Image */}
        <div className="relative aspect-3/4 overflow-hidden bg-gray-100 mb-3">
          {displayImage ? (
            <Image
              src={displayImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <svg
                className="h-16 w-16 text-gray-300"
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

          {/* Size Selection Bar - Slide up from bottom on hover */}
          {shouldShowSizes && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out py-3 px-2">
              <p className="text-white text-[10px] mb-2 text-center tracking-wider uppercase opacity-80">{sizeLabel}</p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {(isShoe ? SHOE_SIZES : SIZES).map((size) => (
                  <button
                    key={size}
                    onClick={(e) => handleSizeClick(e, size)}
                    className={`px-3 py-1.5 text-xs font-medium tracking-wider transition-all duration-200 ${
                      selectedSize === size
                        ? 'bg-white text-black'
                        : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
              <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                Tükendi
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          {/* Product Name */}
          <h3 className="text-sm font-normal text-black line-clamp-2 leading-tight">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-black">
              {product.price.toLocaleString('tr-TR')}₺
            </span>
          </div>

          {/* Category or Brand (optional) */}
          {product.categoryName && (
            <p className="text-xs text-gray-500">
              {product.categoryName}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
