'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PageLoader from '@/components/ui/PageLoader';
import FavoriteButton from '@/components/favorites/FavoriteButton';

interface Product {
  id: string;
  name: string;
  price: number;
  imagePaths: string[];
  productId?: string; // Backend Product ID
}

export default function SpecialCollectionPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentImageIndexes, setCurrentImageIndexes] = useState<Record<string, number>>({});
  const [slideDirection, setSlideDirection] = useState<Record<string, 'left' | 'right' | null>>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5195/api/SpecialCollection');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    fetchProducts();
  }, []);

  const handlePrevImage = (e: React.MouseEvent, productId: string, totalImages: number) => {
    e.preventDefault();
    e.stopPropagation();
    setSlideDirection((prev) => ({ ...prev, [productId]: 'right' }));
    setCurrentImageIndexes((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + totalImages) % totalImages,
    }));
    setTimeout(() => {
      setSlideDirection((prev) => ({ ...prev, [productId]: null }));
    }, 200);
  };

  const handleNextImage = (e: React.MouseEvent, productId: string, totalImages: number) => {
    e.preventDefault();
    e.stopPropagation();
    setSlideDirection((prev) => ({ ...prev, [productId]: 'left' }));
    setCurrentImageIndexes((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % totalImages,
    }));
    setTimeout(() => {
      setSlideDirection((prev) => ({ ...prev, [productId]: null }));
    }, 200);
  };


  if (loading) {
    return <PageLoader />;
  }

  return (
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
                const direction = slideDirection[product.id];

                return (
                  <Link
                    key={product.id}
                    href={`/men/special-collection/${product.id}`}
                    className="group block"
                    onMouseEnter={() => {
                      // Update index to 1 when hovering (if on index 0)
                      if (currentIndex === 0 && product.imagePaths.length > 1) {
                        setCurrentImageIndexes((prev) => ({
                          ...prev,
                          [product.id]: 1,
                        }));
                      }
                    }}
                    onMouseLeave={() => {
                      // Reset to 0 when mouse leaves
                      setCurrentImageIndexes((prev) => ({
                        ...prev,
                        [product.id]: 0,
                      }));
                    }}
                  >
                    <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-3">
                      {/* All images stacked with conditional animation */}
                      {product.imagePaths.map((imagePath, idx) => {
                        const isActive = idx === currentIndex;

                        // Determine animation classes based on slide direction
                        let animationClass = '';
                        if (direction === 'left' && isActive) {
                          animationClass = 'animate-slideInFromRight';
                        } else if (direction === 'right' && isActive) {
                          animationClass = 'animate-slideInFromLeft';
                        } else if (direction === 'left' && !isActive) {
                          animationClass = 'animate-slideOutToLeft';
                        } else if (direction === 'right' && !isActive) {
                          animationClass = 'animate-slideOutToRight';
                        }

                        return (
                          <img
                            key={idx}
                            src={imagePath}
                            alt={`${product.name} - ${idx + 1}`}
                            className={`absolute inset-0 w-full h-full object-cover ${
                              direction
                                ? `${animationClass} ${isActive ? 'z-20' : 'z-10'}`
                                : isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                          />
                        );
                      })}

                      {/* Favorite Button */}
                      <div className="absolute top-3 right-3 z-10">
                        <FavoriteButton
                          product={{
                            id: product.productId || product.id, // ProductId varsa onu kullan, yoksa SpecialCollection ID
                            name: product.name,
                            price: product.price,
                            imageUrl: product.imagePaths[0] || '/placeholder.png',
                            slug: product.id,
                          }}
                          className="shadow-md"
                        />
                      </div>

                      {/* Navigation Arrows */}
                      {product.imagePaths.length > 1 && (
                        <>
                          <button
                            onClick={(e) => handlePrevImage(e, product.id, product.imagePaths.length)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 transition-all opacity-0 group-hover:opacity-100"
                            aria-label="Önceki görsel"
                          >
                            <ChevronLeft className="w-6 h-6 text-white drop-shadow-lg" />
                          </button>
                          <button
                            onClick={(e) => handleNextImage(e, product.id, product.imagePaths.length)}
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
  );
}
