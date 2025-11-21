'use client';

import { useState } from 'react';
import { X, Heart } from 'lucide-react';
import { useFavoritesStore } from '@/lib/stores/favoritesStore';
import Image from 'next/image';
import Link from 'next/link';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

export default function FavoritesDrawer({ isOpen, onClose, onLoginClick }: FavoritesDrawerProps) {
  const favorites = useFavoritesStore((state) => state.favorites);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[850px] bg-white z-50 shadow-2xl transform transition-transform duration-500 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } ${!isOpen ? 'pointer-events-none' : ''}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold">Favorilerim</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Message for non-logged in users */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900 mb-3">
                <strong>Artık favorilerinizi kaybetmeyin!</strong>
                <br />
                Seçiminizi kaydetmek için Oturum Açın veya Hesap Oluşturun
              </p>
              <button
                onClick={() => {
                  onClose();
                  onLoginClick();
                }}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Giriş Yap
              </button>
            </div>

            {/* Favorites List */}
            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Henüz favori ürününüz yok</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {favorites.map((product) => (
                  <div
                    key={product.id}
                    className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <Link href={`/products/${product.slug}`} className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-semibold hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="mt-2">
                        {product.discountPrice ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-red-600">
                              {product.discountPrice.toFixed(2)} TL
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              {product.price.toFixed(2)} TL
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold">
                            {product.price.toFixed(2)} TL
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFavorite(product.id)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors h-fit"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
