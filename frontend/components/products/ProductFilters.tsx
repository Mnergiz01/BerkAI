'use client';

import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/lib/api/categories';
import { brandsApi } from '@/lib/api/brands';
import type { ProductFilters as Filters } from '@/types/api';

interface ProductFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const { data: brandsResponse } = useQuery({
    queryKey: ['brands'],
    queryFn: () => brandsApi.getAll(),
  });

  const categories = categoriesResponse?.data || [];
  const brands = brandsResponse?.data || [];

  const handleCategoryChange = (categoryId: number) => {
    onFiltersChange({
      ...filters,
      categoryId: categoryId === 0 ? undefined : categoryId,
      pageNumber: 1,
    });
  };

  const handleBrandChange = (brandId: number) => {
    onFiltersChange({
      ...filters,
      brandId: brandId === 0 ? undefined : brandId,
      pageNumber: 1,
    });
  };

  const handlePriceChange = (minPrice?: number, maxPrice?: number) => {
    onFiltersChange({
      ...filters,
      minPrice,
      maxPrice,
      pageNumber: 1,
    });
  };

  const handleSortChange = (sortBy: string) => {
    const [field, direction] = sortBy.split('_');
    onFiltersChange({
      ...filters,
      sortBy: field,
      isDescending: direction === 'desc',
      pageNumber: 1,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      pageNumber: 1,
      pageSize: filters.pageSize || 12,
    });
  };

  const hasActiveFilters =
    filters.categoryId || filters.brandId || filters.minPrice || filters.maxPrice;

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Sort By */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Sort By
        </label>
        <select
          value={
            filters.sortBy
              ? `${filters.sortBy}_${filters.isDescending ? 'desc' : 'asc'}`
              : ''
          }
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Default</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A to Z</option>
          <option value="name_desc">Name: Z to A</option>
          <option value="createdAt_desc">Newest First</option>
        </select>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Category
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              checked={!filters.categoryId}
              onChange={() => handleCategoryChange(0)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">All Categories</span>
          </label>
          {categories.map((category) => (
            <label key={category.id} className="flex items-center">
              <input
                type="radio"
                name="category"
                checked={filters.categoryId === category.id}
                onChange={() => handleCategoryChange(category.id)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Brand
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="brand"
              checked={!filters.brandId}
              onChange={() => handleBrandChange(0)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">All Brands</span>
          </label>
          {brands.map((brand) => (
            <label key={brand.id} className="flex items-center">
              <input
                type="radio"
                name="brand"
                checked={filters.brandId === brand.id}
                onChange={() => handleBrandChange(brand.id)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{brand.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Price Range
        </label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) =>
                handlePriceChange(
                  e.target.value ? Number(e.target.value) : undefined,
                  filters.maxPrice
                )
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) =>
                handlePriceChange(
                  filters.minPrice,
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Quick price filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handlePriceChange(undefined, 50)}
              className="rounded-lg border border-gray-300 px-3 py-1 text-xs hover:bg-gray-50"
            >
              Under $50
            </button>
            <button
              onClick={() => handlePriceChange(50, 100)}
              className="rounded-lg border border-gray-300 px-3 py-1 text-xs hover:bg-gray-50"
            >
              $50 - $100
            </button>
            <button
              onClick={() => handlePriceChange(100, 200)}
              className="rounded-lg border border-gray-300 px-3 py-1 text-xs hover:bg-gray-50"
            >
              $100 - $200
            </button>
            <button
              onClick={() => handlePriceChange(200, undefined)}
              className="rounded-lg border border-gray-300 px-3 py-1 text-xs hover:bg-gray-50"
            >
              Over $200
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductFilters;
