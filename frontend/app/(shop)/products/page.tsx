'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { productsApi } from '@/lib/api/products';
import { categoriesApi } from '@/lib/api/categories';
import { brandsApi } from '@/lib/api/brands';
import { ProductSearchParams } from '@/types/api';
import ProductCard from '@/components/products/ProductCard';
import Loading from '@/components/ui/Loading';

export default function ProductsPage() {
  const searchParams = useSearchParams();

  // Parse filters from URL
  const [filters, setFilters] = useState<ProductSearchParams>(() => {
    const params: ProductSearchParams = {};

    if (searchParams.get('q')) params.q = searchParams.get('q')!;
    if (searchParams.get('categoryId')) params.categoryId = searchParams.get('categoryId')!;
    if (searchParams.get('brandId')) params.brandId = searchParams.get('brandId')!;
    if (searchParams.get('brandIds')) {
      const brandIds = searchParams.get('brandIds')!.split(',').filter(Boolean);
      if (brandIds.length > 0) {
        params.brandIds = brandIds;
      }
    }
    if (searchParams.get('minPrice')) params.minPrice = Number(searchParams.get('minPrice'));
    if (searchParams.get('maxPrice')) params.maxPrice = Number(searchParams.get('maxPrice'));
    if (searchParams.get('gender')) params.gender = searchParams.get('gender')!;
    if (searchParams.get('sortBy')) params.sortBy = searchParams.get('sortBy')!;

    return params;
  });

  // Convert search params to filters
  const apiFilters: any = {
    ...filters,
    categoryId: filters.categoryId || undefined,
    brandId: filters.brandId || undefined,
  };

  // Fetch products
  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.search(apiFilters),
  });

  // Fetch categories and brands for filters
  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const { data: brandsResponse } = useQuery({
    queryKey: ['brands'],
    queryFn: () => brandsApi.getAll(),
  });

  const products = productsResponse?.data || [];
  const categories = categoriesResponse?.data || [];
  const brands = brandsResponse?.data || [];

  // Sync filters with URL params
  useEffect(() => {
    const params: ProductSearchParams = {};

    if (searchParams.get('q')) params.q = searchParams.get('q')!;
    if (searchParams.get('categoryId')) params.categoryId = searchParams.get('categoryId')!;
    if (searchParams.get('brandId')) params.brandId = searchParams.get('brandId')!;
    if (searchParams.get('brandIds')) {
      const brandIds = searchParams.get('brandIds')!.split(',').filter(Boolean);
      if (brandIds.length > 0) {
        params.brandIds = brandIds;
      }
    }
    if (searchParams.get('minPrice')) params.minPrice = Number(searchParams.get('minPrice'));
    if (searchParams.get('maxPrice')) params.maxPrice = Number(searchParams.get('maxPrice'));
    if (searchParams.get('gender')) params.gender = searchParams.get('gender')!;
    if (searchParams.get('sortBy')) params.sortBy = searchParams.get('sortBy')!;

    setFilters(params);
  }, [searchParams]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters({
      ...filters,
      [key]: value || undefined,
    });
  };

  const handleSortChange = (sortBy: string) => {
    if (!sortBy) {
      const { sortBy: _, isDescending: __, ...rest } = filters;
      setFilters(rest);
      return;
    }

    const [field, direction] = sortBy.split('_');
    setFilters({
      ...filters,
      sortBy: field as any,
      isDescending: direction === 'desc',
    });
  };

  const activeFilterCount = Object.keys(filters).filter(
    (key) => key !== 'sortBy' && key !== 'isDescending' && filters[key as keyof ProductSearchParams] !== undefined
  ).length;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Filters Section */}
        <div className="bg-white p-6 mb-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Filtreler</h2>
            <p className="text-sm text-gray-600">
              <span className="font-medium">{products.length}</span> ürün bulundu
            </p>
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Category Filter */}
            <div>
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-2 block">
                Kategori
              </label>
              <select
                value={filters.categoryId || ''}
                onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black text-sm"
              >
                <option value="">Tüm Kategoriler</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-2 block">
                Marka
              </label>
              <select
                value={filters.brandId || ''}
                onChange={(e) => handleFilterChange('brandId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black text-sm"
              >
                <option value="">Tüm Markalar</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Price Filter */}
            <div>
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-2 block">
                Min Fiyat
              </label>
              <input
                type="number"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="0 ₺"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black text-sm"
              />
            </div>

            {/* Max Price Filter */}
            <div>
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-2 block">
                Max Fiyat
              </label>
              <input
                type="number"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="9999 ₺"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black text-sm"
              />
            </div>
          </div>

          {/* Sort and Clear Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Sırala:</label>
              <select
                value={filters.sortBy && filters.isDescending !== undefined ? `${filters.sortBy}_${filters.isDescending ? 'desc' : 'asc'}` : ''}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black text-sm"
              >
                <option value="">Varsayılan Sıralama</option>
                <option value="createdAt_desc">En Yeni</option>
                <option value="price_asc">Fiyat: Düşükten Yükseğe</option>
                <option value="price_desc">Fiyat: Yüksekten Düşüğe</option>
                <option value="name_asc">İsim: A-Z</option>
                <option value="name_desc">İsim: Z-A</option>
              </select>
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={() => setFilters({})}
                className="text-sm text-gray-600 hover:text-black underline font-medium"
              >
                Tüm Filtreleri Temizle ({activeFilterCount})
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loading size="lg" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-2">Ürün bulunamadı</h3>
            <p className="text-gray-600 mb-4">
              Arama kriterlerinize uygun ürün bulunamadı
            </p>
            <button
              onClick={() => setFilters({})}
              className="px-6 py-2 bg-black text-white font-medium hover:bg-gray-800 rounded"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
