'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { useFavoritesStore, FavoriteProduct } from '@/lib/stores/favoritesStore';
import { toast } from 'react-hot-toast';

interface FavoriteButtonProps {
  product: FavoriteProduct;
  className?: string;
}

export default function FavoriteButton({
  product,
  className = '',
}: FavoriteButtonProps) {
  const { user, token } = useAuthStore();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const [isLoading, setIsLoading] = useState(false);

  const isInFavorites = isFavorite(product.id);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Kullanıcı giriş yapmamışsa localStorage'a kaydet
    if (!user || !token) {
      if (isInFavorites) {
        removeFavorite(product.id);
        toast.success('Favorilerden kaldırıldı');
      } else {
        addFavorite(product);
        toast.success('Favorilere eklendi');
      }
      return;
    }

    // Kullanıcı giriş yapmışsa backend'e kaydet
    setIsLoading(true);
    try {
      if (isInFavorites) {
        // Favorilerden kaldır
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/favorites/${product.id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          removeFavorite(product.id);
          toast.success('Favorilerden kaldırıldı');
        } else {
          const data = await response.json();
          toast.error(data.message || 'Bir hata oluştu');
        }
      } else {
        // Favorilere ekle
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: product.id }),
        });

        if (response.ok) {
          addFavorite(product);
          toast.success('Favorilere eklendi');
        } else {
          const data = await response.json();
          toast.error(data.message || 'Bir hata oluştu');
        }
      }
    } catch (error) {
      console.error('Favorite error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`p-2 rounded-full transition-all ${
        isInFavorites
          ? 'bg-red-50 text-red-500 hover:bg-red-100'
          : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      aria-label={isInFavorites ? 'Favorilerden kaldır' : 'Favorilere ekle'}
    >
      <Heart
        className={`w-5 h-5 transition-all ${
          isInFavorites ? 'fill-current' : ''
        }`}
      />
    </button>
  );
}
