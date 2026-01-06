import Link from 'next/link';
import { RotateCcw, Package, Clock, CheckCircle } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light tracking-[0.2em] text-gray-900 mb-4">
            İADE & DEĞİŞİM
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ürün iade ve değişim süreçleri hakkında bilgiler
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {/* Return Process */}
          <div className="mb-16">
            <h2 className="text-2xl font-light mb-8 pb-4 border-b">İade Süreci</h2>
            
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl font-bold">1</span>
                </div>
                <h3 className="font-medium mb-2">İade Talebi</h3>
                <p className="text-sm text-gray-600">
                  Hesabınızdan veya iletişim yoluyla iade talebinde bulunun
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl font-bold">2</span>
                </div>
                <h3 className="font-medium mb-2">Onay</h3>
                <p className="text-sm text-gray-600">
                  İade talebiniz incelenir ve onaylanır
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl font-bold">3</span>
                </div>
                <h3 className="font-medium mb-2">Kargolama</h3>
                <p className="text-sm text-gray-600">
                  Ürünü orijinal ambalajıyla kargoya verin
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl font-bold">4</span>
                </div>
                <h3 className="font-medium mb-2">İade</h3>
                <p className="text-sm text-gray-600">
                  Paranız 5-10 iş günü içinde iade edilir
                </p>
              </div>
            </div>
          </div>

          {/* Return Conditions */}
          <div className="mb-16">
            <h2 className="text-2xl font-light mb-8 pb-4 border-b">İade Koşulları</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium mb-2">İade Süresi</h3>
                  <p className="text-gray-600">
                    Ürün teslim tarihinden itibaren 14 gün içinde iade edilebilir. 
                    Bu süre içinde kullanılmamış ve orijinal ambalajında olan ürünler kabul edilir.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Package className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium mb-2">Ürün Durumu</h3>
                  <p className="text-gray-600">
                    İade edilecek ürün kullanılmamış, yıkanmamış ve etiketleri sökülmemiş olmalıdır. 
                    Orijinal ambalajı ve aksesuarları ile birlikte gönderilmelidir.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <RotateCcw className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium mb-2">İade Ücreti</h3>
                  <p className="text-gray-600">
                    Ürün kusurlu veya yanlış gönderilmiş ise iade kargo ücreti tarafımızca karşılanır. 
                    Diğer durumlarda iade kargo ücreti müşteriye aittir.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium mb-2">Para İadesi</h3>
                  <p className="text-gray-600">
                    İade edilen ürün depoya ulaştıktan ve kontrol edildikten sonra 5-10 iş günü içinde 
                    ödeme yaptığınız hesaba iade işlemi gerçekleştirilir.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Exchange Policy */}
          <div className="mb-16">
            <h2 className="text-2xl font-light mb-8 pb-4 border-b">Değişim Politikası</h2>
            
            <div className="bg-gray-50 p-8">
              <p className="text-gray-600 mb-6">
                Beden veya renk değişimi için aşağıdaki adımları takip edebilirsiniz:
              </p>
              
              <ol className="space-y-4 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="font-bold text-black flex-shrink-0">1.</span>
                  <span>İletişim formu veya müşteri hizmetlerimiz üzerinden değişim talebinde bulunun</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-black flex-shrink-0">2.</span>
                  <span>Değiştirmek istediğiniz ürün bilgilerini ve yeni tercihlerinizi belirtin</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-black flex-shrink-0">3.</span>
                  <span>Mevcut ürünü iade sürecine göre geri gönderin</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-black flex-shrink-0">4.</span>
                  <span>Yeni ürününüz stokta mevcutsa öncelikli olarak size gönderilir</span>
                </li>
              </ol>

              <div className="mt-6 p-4 bg-white border-l-4 border-black">
                <p className="text-sm text-gray-600">
                  <strong className="text-black">Not:</strong> Değişim işlemleri stok durumuna göre yapılır. 
                  İstediğiniz ürün stokta yoksa para iadesi yapılır.
                </p>
              </div>
            </div>
          </div>

          {/* Non-Returnable Items */}
          <div className="mb-16">
            <h2 className="text-2xl font-light mb-8 pb-4 border-b">İade Edilemeyen Ürünler</h2>
            
            <div className="bg-red-50 border border-red-200 p-6">
              <p className="text-gray-700 mb-4 font-medium">
                Hijyen ve sağlık nedenleriyle aşağıdaki ürünler iade edilemez:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-red-600">•</span>
                  <span>İç çamaşırı ve mayo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">•</span>
                  <span>Kullanılmış veya yıkanmış ürünler</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">•</span>
                  <span>Etiketi çıkarılmış ürünler</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">•</span>
                  <span>İndirimli ve outlet ürünler (belirtilmişse)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">•</span>
                  <span>Özel yapım veya kişiselleştirilmiş ürünler</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              İade veya değişim işlemleri hakkında sorularınız için bize ulaşabilirsiniz.
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
