'use client';

import { useEffect, useState } from 'react';
import { Heart, X, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { useFavoritesStore } from '@/lib/stores/favoritesStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function FavoritesPage() {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuthStore();
  const { favorites, removeFavorite, clearFavorites } = useFavoritesStore();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Giriş yapmış kullanıcı için backend'den favorileri çek
  useEffect(() => {
    if (mounted && isAuthenticated && token) {
      fetchBackendFavorites();
    }
  }, [mounted, isAuthenticated, token]);

  const fetchBackendFavorites = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Backend'den gelen favorileri localStorage'a senkronize et
        if (data.data && Array.isArray(data.data)) {
          clearFavorites();
          data.data.forEach((fav: any) => {
            if (fav.product) {
              // LocalStorage formatına çevir
              const product = {
                id: fav.product.id,
                name: fav.product.name,
                price: fav.product.price,
                discountPrice: fav.product.discountPrice,
                imageUrl: fav.product.images?.[0]?.imageUrl || '/placeholder.png',
                slug: fav.product.slug,
              };
              // Zustand store'a ekle (bu otomatik olarak localStorage'a kaydedilecek)
              useFavoritesStore.getState().addFavorite(product);
            }
          });
        }
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (productId: string) => {
    // Giriş yapmış kullanıcı için backend'den kaldır
    if (isAuthenticated && token) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/favorites/${productId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          removeFavorite(productId);
          toast.success('Favorilerden kaldırıldı');
        } else {
          toast.error('Bir hata oluştu');
        }
      } catch (error) {
        console.error('Error removing favorite:', error);
        toast.error('Bir hata oluştu');
      }
    } else {
      // Giriş yapmamış kullanıcı için localStorage'dan kaldır
      removeFavorite(productId);
      toast.success('Favorilerden kaldırıldı');
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black">Favorilerim</h1>
          </div>

          {/* Giriş yapmamış kullanıcı için mesaj */}
        {!isAuthenticated && favorites.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900 mb-3">
              <strong>Artık favorilerinizi kaybetmeyin!</strong>
              <br />
              Seçiminizi kaydetmek için Oturum Açın veya Hesap Oluşturun
            </p>
            <div className="flex gap-3">
              <Link
                href="/login"
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                href="/register"
                className="bg-white text-blue-600 border border-blue-600 py-2 px-6 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Hesap Oluştur
              </Link>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : favorites.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Henüz favori ürününüz yok
            </h2>
            <p className="text-gray-500 mb-6">
              Beğendiğiniz ürünleri favorilere ekleyerek kolayca erişebilirsiniz
            </p>
            <Link
              href="/"
              className="inline-block bg-black text-white py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          /* Favorites Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <div key={product.id} className="group">
                <Link href={`/men/special-collection/${product.slug}`} className="block">
                  <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-3">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveFavorite(product.id);
                      }}
                      className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  <div className="space-y-1 pl-2">
                    <h3 className="text-sm font-medium text-black line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm font-semibold text-black">
                      {product.discountPrice ? (
                        <>
                          <span className="text-red-600">
                            ₺{product.discountPrice.toLocaleString('tr-TR')}
                          </span>
                          <span className="ml-2 text-gray-500 line-through text-xs">
                            ₺{product.price.toLocaleString('tr-TR')}
                          </span>
                        </>
                      ) : (
                        <span>₺{product.price.toLocaleString('tr-TR')}</span>
                      )}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
      <Footer />
    </>
  );
}
