'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageLoader from '@/components/ui/PageLoader';

const productImages = [
  '/madeinroot/ege-on-soru-isareti.webp',
  '/madeinroot/ege-arka-soru-isareti.webp',
  '/madeinroot/kol-detay.webp',
  '/madeinroot/logo-detay.webp',
];

export default function ProductDetailPage() {
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20">
        {/* Product Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Product Image with Slider */}
                <div className="relative">
                  <div
                    className="relative aspect-[3/4] bg-gray-100 overflow-hidden group"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    {/* Main Image */}
                    <Image
                      src={productImages[currentImageIndex]}
                      alt="Ürün görseli"
                      fill
                      className="object-cover transition-opacity duration-300"
                      priority
                    />

                    {/* Hover Image - Only show on first image */}
                    {currentImageIndex === 0 && (
                      <Image
                        src={productImages[1]}
                        alt="Ürün arka görseli"
                        fill
                        className={`object-cover transition-opacity duration-300 ${
                          isHovering ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    )}

                    {/* Navigation Arrows */}
                    <button
                      onClick={handlePrevious}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black rounded-full p-3 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                      aria-label="Önceki görsel"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black rounded-full p-3 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                      aria-label="Sonraki görsel"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                      {currentImageIndex + 1} / {productImages.length}
                    </div>
                  </div>

                  {/* Thumbnail Navigation */}
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {productImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative aspect-square bg-gray-100 overflow-hidden border-2 transition-all ${
                          currentImageIndex === index
                            ? 'border-black'
                            : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col">
                  <h2 className="text-4xl font-bold mb-4 text-black">Made in Root Sweatshirt</h2>
                  <p className="text-2xl font-semibold mb-6 text-black">₺1,299</p>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-black">Ürün Açıklaması</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Made in Root koleksiyonundan özel tasarım sweatshirt. Premium kalite pamuklu kumaş,
                        rahat kesim ve şık detaylarıyla günlük kullanım için ideal.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-black">Özellikler</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>• %100 Premium Pamuk</li>
                        <li>• Oversize Kesim</li>
                        <li>• Özel Koleksiyon Logosu</li>
                        <li>• Yüksek Kalite Baskı</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-black">Beden</h3>
                      <div className="grid grid-cols-4 gap-3">
                        {['S', 'M', 'L', 'XL'].map((size) => (
                          <button
                            key={size}
                            className="border-2 border-gray-300 hover:border-black py-3 text-center font-medium transition-colors"
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button className="w-full bg-black text-white py-4 text-lg font-semibold hover:bg-gray-800 transition-colors mt-8">
                      Sepete Ekle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
