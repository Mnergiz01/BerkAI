'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/lib/api/categories';
import { brandsApi } from '@/lib/api/brands';
import type { ProductFilters as Filters } from '@/types/api';

interface ProductFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  const [expandedGender, setExpandedGender] = useState<'women' | 'men' | 'accessories' | null>(null);

  // Auto-expand based on gender filter
  useEffect(() => {
    if (filters.gender === '2') {
      setExpandedGender('women');
    } else if (filters.gender === '1') {
      setExpandedGender('men');
    } else if (filters.gender === '3') {
      setExpandedGender('accessories');
    }
  }, [filters.gender]);

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

  // Group categories by gender
  const womenCategories = categories.filter(cat =>
    cat.gender === 'Female'
  );

  const menCategories = categories.filter(cat =>
    cat.gender === 'Male'
  );

  const accessoriesCategories = categories.filter(cat =>
    cat.gender === 'PreferNotToSay' && 
    !cat.name.toLowerCase().includes('giyim') &&
    (cat.name.toLowerCase().includes('aksesuar') ||
     cat.name.toLowerCase().includes('çanta') ||
     cat.name.toLowerCase().includes('ayakkabı') ||
     cat.name.toLowerCase().includes('şapka') ||
     cat.name.toLowerCase().includes('kemer') ||
     cat.name.toLowerCase().includes('takı') ||
     cat.name.toLowerCase().includes('saat') ||
     cat.name.toLowerCase().includes('gözlük') ||
     cat.name.toLowerCase().includes('atkı') ||
     cat.name.toLowerCase().includes('eldiven'))
  );

  const toggleGender = (gender: 'women' | 'men' | 'accessories') => {
    const wasExpanded = expandedGender === gender;
    setExpandedGender(wasExpanded ? null : gender);

    // Set gender filter when expanding
    if (!wasExpanded) {
      const genderValue = gender === 'women' ? '2' : gender === 'men' ? '1' : '3'; // Female=2, Male=1, PreferNotToSay=3
      onFiltersChange({
        ...filters,
        gender: genderValue,
        categoryId: undefined, // Clear category when switching gender
        pageNumber: 1,
      });
    } else {
      // Clear gender filter when collapsing
      onFiltersChange({
        ...filters,
        gender: undefined,
        categoryId: undefined,
        pageNumber: 1,
      });
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    // Toggle category: if same category clicked, deselect it
    const newCategoryId = filters.categoryId === categoryId ? undefined : categoryId;
    onFiltersChange({
      ...filters,
      categoryId: newCategoryId,
      pageNumber: 1,
    });
  };

  const handleBrandChange = (brandId: string) => {
    const currentBrandIds = filters.brandIds || [];
    let newBrandIds: string[];

    // Toggle brand selection
    if (currentBrandIds.includes(brandId)) {
      // Remove brand if already selected
      newBrandIds = currentBrandIds.filter(id => id !== brandId);
    } else {
      // Add brand if not selected
      newBrandIds = [...currentBrandIds, brandId];
    }

    onFiltersChange({
      ...filters,
      brandIds: newBrandIds.length > 0 ? newBrandIds : undefined,
      pageNumber: 1,
    });
  };


  return (
    <div className="bg-white flex h-full">
      {/* Left Navigation */}
      <div className="w-52 border-r border-gray-200">
        {/* Women Main Section */}
        <button
          onClick={() => toggleGender('women')}
          className={`w-full text-left px-6 py-5 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
            expandedGender === 'women' ? 'bg-gray-50' : ''
          }`}
        >
          <span className={`text-base tracking-wide ${
            expandedGender === 'women' ? 'font-medium text-black' : 'font-light text-gray-700'
          }`}>
            KADIN
          </span>
        </button>

        {/* Men Main Section */}
        <button
          onClick={() => toggleGender('men')}
          className={`w-full text-left px-6 py-5 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
            expandedGender === 'men' ? 'bg-gray-50' : ''
          }`}
        >
          <span className={`text-base tracking-wide ${
            expandedGender === 'men' ? 'font-medium text-black' : 'font-light text-gray-700'
          }`}>
            ERKEK
          </span>
        </button>

        {/* Accessories Main Section */}
        <button
          onClick={() => toggleGender('accessories')}
          className={`w-full text-left px-6 py-5 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
            expandedGender === 'accessories' ? 'bg-gray-50' : ''
          }`}
        >
          <span className={`text-base tracking-wide ${
            expandedGender === 'accessories' ? 'font-medium text-black' : 'font-light text-gray-700'
          }`}>
            AKSESUAR
          </span>
        </button>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Women Sub-sections */}
        {expandedGender === 'women' && (
          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Kategoriler</h3>
              <div className="grid grid-cols-2 gap-3">
                {womenCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`text-left px-4 py-3 text-sm transition-all duration-200 ${
                      filters.categoryId === category.id
                        ? 'bg-black text-white font-medium'
                        : 'text-gray-700 hover:bg-gray-100 font-light'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Markalar</h3>
              <div className="grid grid-cols-2 gap-3">
                {brands.map((brand) => {
                  const isSelected = filters.brandIds?.includes(brand.id) || false;
                  return (
                    <button
                      key={brand.id}
                      onClick={() => handleBrandChange(brand.id)}
                      className={`text-left px-4 py-3 text-sm transition-all duration-200 ${
                        isSelected
                          ? 'bg-black text-white font-medium'
                          : 'text-gray-700 hover:bg-gray-100 font-light'
                      }`}
                    >
                      {brand.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Men Sub-sections */}
        {expandedGender === 'men' && (
          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Kategoriler</h3>
              <div className="grid grid-cols-2 gap-3">
                {menCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`text-left px-4 py-3 text-sm transition-all duration-200 ${
                      filters.categoryId === category.id
                        ? 'bg-black text-white font-medium'
                        : 'text-gray-700 hover:bg-gray-100 font-light'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Markalar</h3>
              <div className="grid grid-cols-2 gap-3">
                {brands.map((brand) => {
                  const isSelected = filters.brandIds?.includes(brand.id) || false;
                  return (
                    <button
                      key={brand.id}
                      onClick={() => handleBrandChange(brand.id)}
                      className={`text-left px-4 py-3 text-sm transition-all duration-200 ${
                        isSelected
                          ? 'bg-black text-white font-medium'
                          : 'text-gray-700 hover:bg-gray-100 font-light'
                      }`}
                    >
                      {brand.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Accessories Sub-sections */}
        {expandedGender === 'accessories' && (
          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Kategoriler</h3>
              <div className="grid grid-cols-2 gap-3">
                {accessoriesCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`text-left px-4 py-3 text-sm transition-all duration-200 ${
                      filters.categoryId === category.id
                        ? 'bg-black text-white font-medium'
                        : 'text-gray-700 hover:bg-gray-100 font-light'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Markalar</h3>
              <div className="grid grid-cols-2 gap-3">
                {brands.map((brand) => {
                  const isSelected = filters.brandIds?.includes(brand.id) || false;
                  return (
                    <button
                      key={brand.id}
                      onClick={() => handleBrandChange(brand.id)}
                      className={`text-left px-4 py-3 text-sm transition-all duration-200 ${
                        isSelected
                          ? 'bg-black text-white font-medium'
                          : 'text-gray-700 hover:bg-gray-100 font-light'
                      }`}
                    >
                      {brand.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/*             isSelected
                          ? 'bg-black text-white font-medium'
                          : 'text-gray-700 hover:bg-gray-100 font-light'
                      }`}
                    >
                      {brand.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Empty state when nothing is selected */}
        {!expandedGender && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-sm font-light">Bir kategori seçin</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductFilters;
