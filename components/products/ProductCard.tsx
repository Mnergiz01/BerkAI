import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/api';
import { formatPrice, getDiscountPercentage } from '@/lib/utils/format';
import { Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images.find((img) => img.isMainImage) || product.images[0];
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const finalPrice = hasDiscount ? product.discountPrice : product.price;

  return (
    <Link
      href={`/shop/products/${product.slug}`}
      className="group block"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-3">
        {mainImage ? (
          <Image
            src={mainImage.imageUrl}
            alt={mainImage.altText || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Resim Yok
          </div>
        )}

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1">
            %{getDiscountPercentage(product.price, product.discountPrice!)} İNDİRİM
          </div>
        )}

        {/* Wishlist Button */}
        <button
          className="absolute top-2 right-2 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100"
          onClick={(e) => {
            e.preventDefault();
            // TODO: Add to wishlist
          }}
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* Quick Add to Cart Button */}
        <button
          className="absolute bottom-0 left-0 right-0 bg-black text-white py-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-800"
          onClick={(e) => {
            e.preventDefault();
            // TODO: Quick add to cart
          }}
        >
          SEPETE EKLE
        </button>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:underline">
          {product.name}
        </h3>

        {product.shortDescription && (
          <p className="text-xs text-gray-500 line-clamp-1">
            {product.shortDescription}
          </p>
        )}

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900">
            {formatPrice(finalPrice)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Available Colors */}
        {product.variants.length > 0 && (
          <div className="flex items-center gap-1">
            {Array.from(new Set(product.variants.map((v) => v.colorHex)))
              .filter(Boolean)
              .slice(0, 5)
              .map((colorHex, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: colorHex }}
                  title={product.variants.find((v) => v.colorHex === colorHex)?.color}
                />
              ))}
            {Array.from(new Set(product.variants.map((v) => v.colorHex))).length > 5 && (
              <span className="text-xs text-gray-500">
                +{Array.from(new Set(product.variants.map((v) => v.colorHex))).length - 5}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
