'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/lib/api/categories';
import Loading from '@/components/ui/Loading';
import Image from 'next/image';
import Link from 'next/link';

const genderMap: Record<string, { value: string; title: string }> = {
  'kadin': { value: 'Female', title: 'KADIN' },
  'erkek': { value: 'Male', title: 'ERKEK' },
  'aksesuar': { value: 'PreferNotToSay', title: 'AKSESUAR' },
};

// 2 rows layout - varying horizontal widths
const getSizeClass = (index: number) => {
  const patterns = [
    'col-span-2', // Wide
    'col-span-1', // Normal
    'col-span-1', // Normal
    'col-span-1', // Normal
    'col-span-2', // Wide
    'col-span-1', // Normal
  ];
  return patterns[index % patterns.length];
};

export default function CategoryPage() {
  const params = useParams();
  const genderSlug = params.gender as string;

  const genderInfo = genderMap[genderSlug];

  // Fetch all categories
  const { data: categoriesResponse, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const categories = categoriesResponse?.data || [];

  // Filter by gender
  const filteredCategories = categories.filter(
    (cat) => cat.gender === genderInfo?.value
  );

  if (!genderInfo) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light mb-4">Kategori Bulunamadı</h1>
          <Link
            href="/"
            className="px-6 py-3 bg-black text-white hover:bg-gray-800 text-sm tracking-wide"
          >
            ANA SAYFAYA DÖN
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Top Section - Gender Title */}
      <div className="py-16 md:py-24 px-4 bg-gradient-to-b from-gray-50 via-gray-50/50 to-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        
        <div className="max-w-4xl mx-auto">
          {/* Small Label */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-gray-400"></div>
            <span className="text-xs tracking-[0.3em] text-gray-500 uppercase">Koleksiyon</span>
            <div className="h-px w-12 bg-gray-400"></div>
          </div>

          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl font-light tracking-[0.35em] text-center text-gray-900 mb-4">
            {genderInfo.title}
          </h1>
          
          {/* Subtitle */}
          <p className="text-center text-gray-600 text-base md:text-lg tracking-[0.15em] mb-6 font-light">
            {genderInfo.value === 'Female' ? 'Kadın Koleksiyonları' : genderInfo.value === 'Male' ? 'Erkek Koleksiyonları' : 'Aksesuar Koleksiyonları'}
          </p>

          {/* Description */}
          <p className="text-center text-gray-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {genderInfo.value === 'Female' 
              ? 'Tarzınızı yansıtan, zarafeti ve çağdaşlığı bir araya getiren özel tasarımlar. Her anınıza eşlik edecek parçalar.' 
              : genderInfo.value === 'Male' 
              ? 'Modern erkek için tasarlanmış, şıklık ve konforun mükemmel uyumu. Kendinizi özel hissedeceğiniz koleksiyonlar.'
              : 'Stilinizi tamamlayan, her detayda fark yaratan aksesuarlar. Gardırobunuzun vazgeçilmez parçaları.'}
          </p>

          {/* Decorative Bottom Element */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
          </div>
        </div>
      </div>

      {/* Categories Grid - Full Width, 2 Rows, No Gap, Varying Widths */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loading size="lg" />
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="grid grid-cols-4 grid-rows-2 gap-0 w-full" style={{ height: '85vh' }}>
          {filteredCategories.map((category, index) => (
            <Link
              key={category.id}
              href={`/products?categoryId=${category.id}&gender=${genderMap[genderSlug].value === 'Female' ? '2' : '1'}`}
              className={`group relative overflow-hidden ${getSizeClass(index)}`}
            >
                {/* Category Image */}
                <div className="relative w-full h-full">
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-4xl text-gray-300">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500" />

                  {/* Category Name Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-6">
                      <h3 className="text-white text-3xl md:text-5xl lg:text-6xl font-light tracking-[0.25em] uppercase drop-shadow-2xl">
                        {category.name}
                      </h3>
                      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="text-white text-base md:text-xl tracking-[0.2em] uppercase border-b-2 border-white pb-2">
                          Keşfet
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-12 text-center">
            <h3 className="text-xl font-light mb-2">Kategori Bulunamadı</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Bu cinsiyet için henüz kategori bulunmamaktadır.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2 bg-black text-white font-light hover:bg-gray-800 text-sm tracking-wide"
            >
              ANA SAYFAYA DÖN
            </Link>
          </div>
        )}

      {/* Bottom Section - Call to Action */}
      <div className="py-16 md:py-20 px-4 bg-gradient-to-t from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-light tracking-[0.2em] text-gray-900 mb-6">
            YENİ SEZONDAKİ FİRSATLARI KAÇIRMAYIN
          </h2>
          <p className="text-gray-600 text-sm md:text-base tracking-wide mb-8 max-w-2xl mx-auto leading-relaxed">
            En yeni koleksiyonlarımızı keşfedin ve tarzınıza uygun ürünleri bulun.
            Üstelik ilk alışverişinizde %20 indirim fırsatını yakalayın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/products"
              className="px-8 py-4 bg-black text-white font-light hover:bg-gray-800 transition-colors duration-300 text-sm tracking-[0.15em] uppercase"
            >
              Tüm Ürünleri Görüntüle
            </Link>
            <Link
              href="/products?sortBy=price&isDescending=false"
              className="px-8 py-4 bg-white text-black border-2 border-black font-light hover:bg-black hover:text-white transition-all duration-300 text-sm tracking-[0.15em] uppercase"
            >
              Fırsatları Keşfet
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
