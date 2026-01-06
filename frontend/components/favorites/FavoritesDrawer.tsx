'use client';

import { X, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useFavoritesStore } from '@/lib/stores/favoritesStore';
import { useEffect } from 'react';
import { getProductImage } from '@/lib/utils/format';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FavoritesDrawer({ isOpen, onClose }: FavoritesDrawerProps) {
  const router = useRouter();
  const { favorites, removeFavorite } = useFavoritesStore();

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const handleGoToFavorites = () => {
    onClose();
    router.push('/favorites');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Favorilere Eklendi</h2>
              <p className="text-sm text-gray-500">{favorites.length} ürün</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Favori ürününüz yok</p>
            </div>
          ) : (
            <div className="space-y-4">
              {favorites.slice(0, 5).map((item) => {
                const displayImage = getProductImage(item.imageUrl, item.name);
                return (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={displayImage}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium line-clamp-2">{item.name}</h3>
                    <p className="text-sm font-semibold mt-1">
                      {item.price.toLocaleString('tr-TR')}₺
                    </p>
                  </div>
                  <button
                    onClick={() => removeFavorite(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                );
              })}
              {favorites.length > 5 && (
                <p className="text-sm text-gray-500 text-center py-2">
                  +{favorites.length - 5} ürün daha
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 space-y-4">
          <button
            onClick={handleGoToFavorites}
            className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors font-medium"
          >
            Tüm Favorileri Gör
          </button>
          <button
            onClick={onClose}
            className="w-full border border-black text-black py-3 hover:bg-black hover:text-white transition-colors font-medium"
          >
            Alışverişe Devam Et
          </button>
        </div>
      </div>
    </>
  );
}
