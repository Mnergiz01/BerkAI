'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageLoader from '@/components/ui/PageLoader';

export default function MenPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate page load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative h-[60vh] bg-black flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-6xl font-bold mb-4">ERKEK</h1>
            <p className="text-xl text-gray-300">Modern erkek koleksiyonu</p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6 text-black">Yakında</h2>
              <p className="text-lg text-gray-600 mb-8">
                Erkek koleksiyonumuz çok yakında sizlerle. Şık ve modern tasarımlar için takipte kalın.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
