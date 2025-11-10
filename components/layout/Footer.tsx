import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">FASHION</h3>
            <p className="text-sm mb-4">
              Modern ve şık giyim koleksiyonlarıyla stilinizi yansıtın.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors"
                aria-label="Youtube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-4">ALIŞVERİŞ</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop/products?gender=2" className="hover:text-white transition-colors">
                  Kadın
                </Link>
              </li>
              <li>
                <Link href="/shop/products?gender=1" className="hover:text-white transition-colors">
                  Erkek
                </Link>
              </li>
              <li>
                <Link href="/shop/products?gender=3" className="hover:text-white transition-colors">
                  Çocuk
                </Link>
              </li>
              <li>
                <Link href="/shop/products" className="hover:text-white transition-colors">
                  Tüm Ürünler
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">MÜŞTERİ HİZMETLERİ</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help/contact" className="hover:text-white transition-colors">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/help/shipping" className="hover:text-white transition-colors">
                  Kargo ve Teslimat
                </Link>
              </li>
              <li>
                <Link href="/help/returns" className="hover:text-white transition-colors">
                  İade ve Değişim
                </Link>
              </li>
              <li>
                <Link href="/help/faq" className="hover:text-white transition-colors">
                  Sıkça Sorulan Sorular
                </Link>
              </li>
              <li>
                <Link href="/help/size-guide" className="hover:text-white transition-colors">
                  Beden Rehberi
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4">BÜLTENİMİZE ABONE OLUN</h4>
            <p className="text-sm mb-4">
              Yeni ürünler ve kampanyalardan haberdar olun.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-white text-black font-medium hover:bg-gray-200 transition-colors"
              >
                Abone Ol
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; 2024 Fashion Store. Tüm hakları saklıdır.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/legal/privacy" className="hover:text-white transition-colors">
              Gizlilik Politikası
            </Link>
            <Link href="/legal/terms" className="hover:text-white transition-colors">
              Kullanım Koşulları
            </Link>
            <Link href="/legal/cookies" className="hover:text-white transition-colors">
              Çerez Politikası
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
