import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* About Section */}
          <div className="md:col-span-2">
            <h3 className="mb-6 text-2xl font-bold">BerkAI</h3>
            <p className="text-gray-400 leading-relaxed max-w-md">
              En yeni moda trendleri ve zamansız klasikler için tek adresiniz.
              Stilinizi yansıtan ürünlerle tanışın.
            </p>
            <div className="mt-8 flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <span className="text-lg">f</span>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <span className="text-lg">𝕏</span>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <span className="text-lg">in</span>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <span className="text-lg">📷</span>
              </a>
            </div>
          </div>

          {/* Shop Section */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider">Alışveriş</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white transition-colors">
                  Tüm Ürünler
                </Link>
              </li>
              <li>
                <Link href="/products?gender=1" className="text-gray-400 hover:text-white transition-colors">
                  Erkek
                </Link>
              </li>
              <li>
                <Link href="/products?gender=2" className="text-gray-400 hover:text-white transition-colors">
                  Kadın
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories" className="text-gray-400 hover:text-white transition-colors">
                  Aksesuarlar
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider">Yardım</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-white transition-colors">
                  Kargo
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-white transition-colors">
                  İade & Değişim
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                  SSS
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} BerkAI. Tüm hakları saklıdır.
            </p>
            <div className="flex gap-8 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Gizlilik
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Şartlar
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Çerezler
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
