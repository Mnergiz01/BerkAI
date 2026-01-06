import Link from 'next/link';
import { Package, Truck, MapPin, Clock } from 'lucide-react';

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light tracking-[0.2em] text-gray-900 mb-4">
            KARGO & TESLİMAT
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Siparişlerinizin kargo ve teslimat süreçleri hakkında bilgiler
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {/* Shipping Options */}
          <div className="mb-16">
            <h2 className="text-2xl font-light mb-8 pb-4 border-b">Kargo Seçenekleri</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Standard Shipping */}
              <div className="bg-gray-50 p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Standart Kargo</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      2-4 iş günü içinde teslimat
                    </p>
                    <p className="text-xl font-semibold">₺29,90</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  300₺ ve üzeri alışverişlerde ücretsiz kargo
                </p>
              </div>

              {/* Express Shipping */}
              <div className="bg-gray-50 p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Hızlı Kargo</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      1-2 iş günü içinde teslimat
                    </p>
                    <p className="text-xl font-semibold">₺49,90</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Acil siparişler için önerilir
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="mb-16">
            <h2 className="text-2xl font-light mb-8 pb-4 border-b">Teslimat Bilgileri</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium mb-2">Teslimat Süreleri</h3>
                  <p className="text-gray-600">
                    Siparişiniz onaylandıktan sonra kargoya verilir. Standart kargo ile 2-4 iş günü, 
                    hızlı kargo ile 1-2 iş günü içinde adresinize teslim edilir.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium mb-2">Teslimat Adresi</h3>
                  <p className="text-gray-600">
                    Türkiye'nin tüm illerine teslimat yapılmaktadır. Adres bilgilerinizin eksiksiz ve 
                    doğru olduğundan emin olun.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Package className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium mb-2">Kargo Takibi</h3>
                  <p className="text-gray-600">
                    Siparişiniz kargoya verildikten sonra takip numarası e-posta adresinize gönderilir. 
                    Bu numara ile kargo firmasının web sitesinden siparişinizi takip edebilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-gray-50 p-8">
            <h2 className="text-2xl font-light mb-6">Önemli Notlar</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-black font-bold">•</span>
                <span>Cumartesi ve Pazar günleri verilen siparişler pazartesi günü kargoya teslim edilir.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black font-bold">•</span>
                <span>Resmi tatil günlerinde teslimat yapılmamaktadır.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black font-bold">•</span>
                <span>Kargo ücreti, siparişinizin toplam tutarına göre hesaplanır ve ödeme sayfasında gösterilir.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black font-bold">•</span>
                <span>Birden fazla ürün içeren siparişler tek bir pakette gönderilir.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black font-bold">•</span>
                <span>Hava koşulları veya beklenmeyen durumlar teslimat süresini etkileyebilir.</span>
              </li>
            </ul>
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Kargo ile ilgili sorularınız için bize ulaşabilirsiniz.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
            >
              İletişime Geç
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-16">
          <Link
            href="/"
            className="inline-block px-8 py-3 border border-black text-black hover:bg-black hover:text-white transition-all"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </main>
  );
}
