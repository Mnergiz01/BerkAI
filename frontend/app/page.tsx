'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { productsApi } from '@/lib/api/products';
import ProductCard from '@/components/products/ProductCard';
import Loading from '@/components/ui/Loading';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { BeforeAfterSlider } from '@/components/ui/BeforeAfterSlider';
import { ChevronRight, Pause, Play, Sparkles } from 'lucide-react';

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentImageIndexMen, setCurrentImageIndexMen] = useState(0);
  const [currentImageIndexWomen, setCurrentImageIndexWomen] = useState(0);
  const hoverTimeoutMenRef = useRef<NodeJS.Timeout | null>(null);
  const hoverTimeoutWomenRef = useRef<NodeJS.Timeout | null>(null);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMouseEnterMen = () => {
    setCurrentImageIndexMen(1);

    if (hoverTimeoutMenRef.current) {
      clearTimeout(hoverTimeoutMenRef.current);
    }

    hoverTimeoutMenRef.current = setTimeout(() => {
      setCurrentImageIndexMen(2);

      hoverTimeoutMenRef.current = setTimeout(() => {
        setCurrentImageIndexMen(0);
      }, 800);
    }, 800);
  };

  const handleMouseLeaveMen = () => {
    if (hoverTimeoutMenRef.current) {
      clearTimeout(hoverTimeoutMenRef.current);
    }
    setCurrentImageIndexMen(0);
  };

  const handleMouseEnterWomen = () => {
    setCurrentImageIndexWomen(1);

    if (hoverTimeoutWomenRef.current) {
      clearTimeout(hoverTimeoutWomenRef.current);
    }

    hoverTimeoutWomenRef.current = setTimeout(() => {
      setCurrentImageIndexWomen(2);

      hoverTimeoutWomenRef.current = setTimeout(() => {
        setCurrentImageIndexWomen(0);
      }, 800);
    }, 800);
  };

  const handleMouseLeaveWomen = () => {
    if (hoverTimeoutWomenRef.current) {
      clearTimeout(hoverTimeoutWomenRef.current);
    }
    setCurrentImageIndexWomen(0);
  };
  // Fetch featured products
  const { data: productsResponse, isLoading: productsLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productsApi.getAll(),
  });

  const featuredProducts = productsResponse?.data?.filter((p: any) => p.isFeatured) || [];

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative h-[95vh] bg-gray-900 overflow-hidden -mt-16">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/video.mov" type="video/mp4" />
          </video>
          <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-end pb-10 items-center text-white text-center">
            <p className="text-sm md:text-base mb-3 uppercase tracking-[0.3em] font-light">
              Yeni
            </p>
            <h1 className="text-4xl md:text-4xl mb-10 tracking-tight font-light">
              'Made in Root' Koleksiyonu
            </h1>
            <div className="flex gap-8">
              <Link
                href="/shop/products?gender=2"
                className="text-white text-sm font-light uppercase tracking-[0.2em] underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                KADIN
              </Link>
              <Link
                href="/men/special-collection"
                className="text-white text-sm font-light uppercase tracking-[0.2em] underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                ERKEK
              </Link>
            </div>
          </div>
          {/* Video Control Button */}
          <button
            onClick={toggleVideo}
            className="absolute bottom-6 right-6 z-30 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-3 transition-all"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
        </section>

        {/* Categories Section */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link
                href="/shop/products?gender=2"
                className="relative w-full bg-gray-100 group overflow-hidden"
                onMouseEnter={handleMouseEnterWomen}
                onMouseLeave={handleMouseLeaveWomen}
              >
                <div className="relative w-full h-[93vh]">
                  <Image
                    src="/izel2.jpg"
                    alt="Kadın"
                    fill
                    className="object-cover group-hover:scale-105 transition-all duration-500"
                  />
                  <Image
                    src="/iz3.jpg"
                    alt="Kadın"
                    fill
                    className={`object-cover group-hover:scale-105 transition-all duration-700 ${
                      currentImageIndexWomen === 1 ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <Image
                    src="/iz10.jpg"
                    alt="Kadın"
                    fill
                    className={`object-cover group-hover:scale-105 transition-all duration-700 ${
                      currentImageIndexWomen === 2 ? 'opacity-100' : 'opacity-0'
                    }`}
                  />

                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute inset-0 flex items-start justify-center pt-8">
                    <div className="relative">
                      <h2 className="text-white text-4xl font-bold">KADIN</h2>
                      <div className="absolute bottom-0 left-0 h-[2px] bg-white w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                    </div>
                  </div>
                </div>
              </Link>

              <Link
                href="/men"
                className="relative w-full bg-gray-100 group overflow-hidden"
                onMouseEnter={handleMouseEnterMen}
                onMouseLeave={handleMouseLeaveMen}
              >
                <div className="relative w-full h-[93vh]">
                  <Image
                    src="/ber8.jpeg"
                    alt="Erkek"
                    fill
                    className="object-cover group-hover:scale-105 transition-all duration-500"
                  />
                  <Image
                    src="/berkay2.jpeg"
                    alt="Erkek"
                    fill
                    className={`object-cover group-hover:scale-105 transition-all duration-700 ${
                      currentImageIndexMen === 1 ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <Image
                    src="/ber10.jpeg"
                    alt="Erkek"
                    fill
                    className={`object-cover group-hover:scale-105 transition-all duration-700 ${
                      currentImageIndexMen === 2 ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute inset-0 flex items-start justify-center pt-8">
                    <div className="relative">
                      <h2 className="text-white text-4xl font-bold">ERKEK</h2>
                      <div className="absolute bottom-0 left-0 h-[2px] bg-white w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* AI Try-On Showcase Section */}
        <section className="py-20 bg-black text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
                  
                  Yapay Zeka ile Kıyafet Deneyin
                  <Sparkles className="w-10 h-10 text-blue-400" />
                </h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  İleri teknoloji yapay zeka ile kıyafetleri sanal olarak üzerinizde görün.
                </p>
              </div>

              <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                <BeforeAfterSlider
                  beforeImage="/mavii.png"
                  afterImage="/beyazz.png"
                  beforeAlt="Orijinal Fotoğraf"
                  afterAlt="AI ile Değiştirilmiş"
                />
              </div>

              
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-black">ÖNE ÇIKAN ÜRÜNLER</h2>
              <Link
                href="/shop/products"
                className="text-sm font-medium text-black hover:underline flex items-center gap-1"
              >
                Tümünü Gör
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {productsLoading ? (
              <div className="flex justify-center py-12">
                <Loading size="lg" />
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-700">Henüz öne çıkan ürün bulunmuyor</p>
              </div>
            )}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  ✓
                </div>
                <h3 className="font-bold mb-2 text-black">ÜCRETSİZ KARGO</h3>
                <p className="text-sm text-black">
                  500 TL ve üzeri alışverişlerde ücretsiz kargo
                </p>
              </div>
              <div>
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  ↺
                </div>
                <h3 className="font-bold mb-2 text-black">KOLAY İADE</h3>
                <p className="text-sm text-black">
                  14 gün içinde ücretsiz iade ve değişim
                </p>
              </div>
              <div>
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  ★
                </div>
                <h3 className="font-bold mb-2 text-black">KALİTELİ ÜRÜNLER</h3>
                <p className="text-sm text-black">
                  Özenle seçilmiş kaliteli ve şık ürünler
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
