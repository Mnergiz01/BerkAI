'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageLoader from '@/components/ui/PageLoader';

const products = [
  {
    id: 'made-in-root-sweatshirt',
    name: 'Made in Root Sweatshirt',
    price: 1299,
    images: [
      '/madeinroot/ege-on-soru-isareti.webp',
      '/madeinroot/ege-arka-soru-isareti.webp',
      '/madeinroot/kol-detay.webp',
      '/madeinroot/logo-detay.webp',
    ],
  },
];

export default function SpecialCollectionPage() {
  const [loading, setLoading] = useState(true);
  const [currentImageIndexes, setCurrentImageIndexes] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handlePrevImage = (e: React.MouseEvent, productId: string, totalImages: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndexes((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + totalImages) % totalImages,
    }));
  };

  const handleNextImage = (e: React.MouseEvent, productId: string, totalImages: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndexes((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % totalImages,
    }));
  };

  const toggleFavorite = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20">
        {/* Products Grid */}
        <section className="py-12">
          <div className="w-full pr-4">
            <div className="mb-8 text-left pl-4">
              <h1 className="text-3xl font-bold text-black mb-2">Made in Root Koleksiyonu</h1>
              <p className="text-gray-600">Özel tasarım parçalar</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pl-0">
              {products.map((product) => {
                const currentIndex = currentImageIndexes[product.id] || 0;
                const isFavorite = favorites.has(product.id);

                return (
                  <Link
                    key={product.id}
                    href={`/men/special-collection/${product.id}`}
                    className="group block"
                  >
                    <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-3">
                      {/* Current Image */}
                      <Image
                        src={product.images[currentIndex]}
                        alt={product.name}
                        fill
                        className="object-cover transition-opacity duration-300"
                      />

                      {/* Hover Image - Show second image on hover when on first image */}
                      {currentIndex === 0 && product.images.length > 1 && (
                        <Image
                          src={product.images[1]}
                          alt={`${product.name} - Arka`}
                          fill
                          className="object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                        />
                      )}

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => toggleFavorite(e, product.id)}
                        className="absolute top-3 right-3 z-10 transition-all"
                        aria-label="Favorilere ekle"
                      >
                        <Heart
                          className={`w-6 h-6 transition-colors drop-shadow-md ${
                            isFavorite ? 'fill-red-500 text-red-500' : 'text-black fill-white/20'
                          }`}
                          strokeWidth={1.5}
                        />
                      </button>

                      {/* Navigation Arrows */}
                      {product.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => handlePrevImage(e, product.id, product.images.length)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 transition-all opacity-0 group-hover:opacity-100"
                            aria-label="Önceki görsel"
                          >
                            <ChevronLeft className="w-6 h-6 text-white drop-shadow-lg" />
                          </button>
                          <button
                            onClick={(e) => handleNextImage(e, product.id, product.images.length)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 transition-all opacity-0 group-hover:opacity-100"
                            aria-label="Sonraki görsel"
                          >
                            <ChevronRight className="w-6 h-6 text-white drop-shadow-lg" />
                          </button>
                        </>
                      )}
                    </div>

                    <div className="space-y-1 pl-2">
                      <h3 className="text-sm font-medium text-black">
                        {product.name}
                      </h3>
                      <p className="text-sm font-semibold text-black">
                        ₺{product.price.toLocaleString('tr-TR')}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
