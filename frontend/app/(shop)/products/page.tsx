'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { productsApi } from '@/lib/api/products';
import { ProductSearchParams } from '@/types/api';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import Loading from '@/components/ui/Loading';
import { Filter, X } from 'lucide-react';

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  // Parse filters from URL
  const [filters, setFilters] = useState<ProductSearchParams>(() => {
    const params: ProductSearchParams = {};

    if (searchParams.get('q')) params.q = searchParams.get('q')!;
    if (searchParams.get('categoryId')) params.categoryId = searchParams.get('categoryId')!;
    if (searchParams.get('brandId')) params.brandId = searchParams.get('brandId')!;
    if (searchParams.get('minPrice')) params.minPrice = Number(searchParams.get('minPrice'));
    if (searchParams.get('maxPrice')) params.maxPrice = Number(searchParams.get('maxPrice'));
    if (searchParams.get('gender')) params.gender = searchParams.get('gender')!;
    if (searchParams.get('sortBy')) params.sortBy = searchParams.get('sortBy')!;

    return params;
  });

  // Convert search params to filters
  const apiFilters: any = {
    ...filters,
    categoryId: filters.categoryId ? Number(filters.categoryId) : undefined,
    brandId: filters.brandId ? Number(filters.brandId) : undefined,
  };

  // Fetch products
  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.search(apiFilters),
  });

  const products = productsResponse?.data || [];

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    });
    router.push(`/shop/products?${params.toString()}`, { scroll: false });
  }, [filters, router]);

  const handleFilterChange = (newFilters: any) => {
    // Convert numeric filters back to strings for URL params
    const searchParams: ProductSearchParams = {
      ...newFilters,
      categoryId: newFilters.categoryId ? String(newFilters.categoryId) : undefined,
      brandId: newFilters.brandId ? String(newFilters.brandId) : undefined,
    };
    setFilters(searchParams);
  };

  const handleSortChange = (sortBy: string) => {
    setFilters({ ...filters, sortBy: sortBy as any });
  };

  const activeFilterCount = Object.keys(filters).filter(
    (key) => key !== 'sortBy' && filters[key as keyof ProductSearchParams] !== undefined
  ).length;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <ProductFilters filters={apiFilters} onFiltersChange={handleFilterChange} />
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="bg-white p-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50"
                  >
                    <Filter className="w-4 h-4" />
                    Filtrele
                    {activeFilterCount > 0 && (
                      <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{products.length}</span> ürün bulundu
                  </p>
                </div>

                {/* Sort */}
                <select
                  value={filters.sortBy || ''}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 focus:outline-none focus:border-black text-sm"
                >
                  <option value="">Varsayılan Sıralama</option>
                  <option value="newest">En Yeni</option>
                  <option value="price_asc">Fiyat: Düşükten Yükseğe</option>
                  <option value="price_desc">Fiyat: Yüksekten Düşüğe</option>
                  <option value="name">İsim: A-Z</option>
                </select>
              </div>

              {/* Active Filters */}
              {activeFilterCount > 0 && (
                <div className="bg-white p-4 mb-6 flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">Aktif Filtreler:</span>
                  {Object.entries(filters).map(([key, value]) => {
                    if (key === 'sortBy' || value === undefined) return null;
                    return (
                      <button
                        key={key}
                        onClick={() => handleFilterChange({ ...filters, [key]: undefined })}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm"
                      >
                        {key}: {String(value)}
                        <X className="w-3 h-3" />
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setFilters({})}
                    className="text-sm text-red-600 hover:underline ml-2"
                  >
                    Tümünü Temizle
                  </button>
                </div>
              )}

              {/* Products Grid */}
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loading size="lg" />
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 text-center">
                  <h3 className="text-xl font-bold mb-2">Ürün bulunamadı</h3>
                  <p className="text-gray-600 mb-4">
                    Arama kriterlerinize uygun ürün bulunamadı
                  </p>
                  <button
                    onClick={() => setFilters({})}
                    className="px-6 py-2 bg-black text-white font-medium hover:bg-gray-800"
                  >
                    Filtreleri Temizle
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white overflow-y-auto">
            <div className="p-4">
              <button
                onClick={() => setShowFilters(false)}
                className="mb-4 text-gray-600 hover:text-black"
              >
                ✕ Kapat
              </button>
              <ProductFilters
                filters={apiFilters}
                onFiltersChange={handleFilterChange}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
