'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/lib/api/categories';
import { brandsApi } from '@/lib/api/brands';
import { ProductSearchParams, Gender } from '@/types/api';
import { X } from 'lucide-react';

interface ProductFiltersProps {
  filters: ProductSearchParams;
  onFilterChange: (filters: ProductSearchParams) => void;
  onClose?: () => void;
}

export default function ProductFilters({
  filters,
  onFilterChange,
  onClose,
}: ProductFiltersProps) {
  const [localFilters, setLocalFilters] = useState<ProductSearchParams>(filters);

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

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof ProductSearchParams, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
    onClose?.();
  };

  const clearFilters = () => {
    const clearedFilters: ProductSearchParams = {};
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
    onClose?.();
  };

  return (
    <div className="bg-white p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">FİLTRELE</h3>
        {onClose && (
          <button onClick={onClose} className="lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="font-semibold mb-3">Kategori</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={localFilters.categoryId === category.id}
                onChange={() => handleFilterChange('categoryId', category.id)}
                className="mr-2"
              />
              <span className="text-sm">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <h4 className="font-semibold mb-3">Marka</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <label key={brand.id} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="brand"
                checked={localFilters.brandId === brand.id}
                onChange={() => handleFilterChange('brandId', brand.id)}
                className="mr-2"
              />
              <span className="text-sm">{brand.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gender Filter */}
      <div>
        <h4 className="font-semibold mb-3">Cinsiyet</h4>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="gender"
              checked={localFilters.gender === undefined}
              onChange={() => handleFilterChange('gender', undefined)}
              className="mr-2"
            />
            <span className="text-sm">Tümü</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="gender"
              checked={localFilters.gender === Gender.Female}
              onChange={() => handleFilterChange('gender', Gender.Female)}
              className="mr-2"
            />
            <span className="text-sm">Kadın</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="gender"
              checked={localFilters.gender === Gender.Male}
              onChange={() => handleFilterChange('gender', Gender.Male)}
              className="mr-2"
            />
            <span className="text-sm">Erkek</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="gender"
              checked={localFilters.gender === Gender.Kids}
              onChange={() => handleFilterChange('gender', Gender.Kids)}
              className="mr-2"
            />
            <span className="text-sm">Çocuk</span>
          </label>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-semibold mb-3">Fiyat Aralığı</h4>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-600">Min Fiyat</label>
            <input
              type="number"
              value={localFilters.minPrice || ''}
              onChange={(e) =>
                handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)
              }
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">Max Fiyat</label>
            <input
              type="number"
              value={localFilters.maxPrice || ''}
              onChange={(e) =>
                handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)
              }
              placeholder="10000"
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-4 border-t">
        <button
          onClick={applyFilters}
          className="w-full bg-black text-white py-3 font-medium hover:bg-gray-800 transition-colors"
        >
          Uygula
        </button>
        <button
          onClick={clearFilters}
          className="w-full border border-black text-black py-3 font-medium hover:bg-gray-100 transition-colors"
        >
          Temizle
        </button>
      </div>
    </div>
  );
}
