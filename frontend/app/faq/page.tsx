'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'Sipariş',
    question: 'Nasıl sipariş verebilirim?',
    answer: 'Ürünü sepete ekleyip ödeme sayfasına geçerek kolayca sipariş verebilirsiniz. Kredi kartı, banka kartı veya havale ile ödeme yapabilirsiniz.',
  },
  {
    category: 'Sipariş',
    question: 'Siparişimi iptal edebilir miyim?',
    answer: 'Sipariş kargoya verilmeden önce iptal edebilirsiniz. Hesabınızdan "Siparişlerim" bölümüne giderek iptal işlemini gerçekleştirebilirsiniz.',
  },
  {
    category: 'Sipariş',
    question: 'Siparişimi nasıl takip edebilirim?',
    answer: 'Siparişiniz kargoya verildikten sonra e-posta ile gönderilen takip numarası ile kargo firmasının web sitesinden takip edebilirsiniz.',
  },
  {
    category: 'Kargo',
    question: 'Kargo ücreti ne kadardır?',
    answer: 'Standart kargo ücreti 29,90₺ dir. 300₺ ve üzeri alışverişlerde kargo ücretsizdir. Hızlı kargo seçeneği için 49,90₺ ücret alınır.',
  },
  {
    category: 'Kargo',
    question: 'Ne kadar sürede teslim alırım?',
    answer: 'Standart kargo ile 2-4 iş günü, hızlı kargo ile 1-2 iş günü içinde siparişiniz adresinize teslim edilir.',
  },
  {
    category: 'Kargo',
    question: 'Yurtdışına kargo yapıyor musunuz?',
    answer: 'Şu anda sadece Türkiye içine kargo yapılmaktadır. Yurtdışı kargo planlarımız hakkında güncellemeler için bizi takip edebilirsiniz.',
  },
  {
    category: 'İade & Değişim',
    question: 'İade süresi ne kadardır?',
    answer: 'Ürün teslim tarihinden itibaren 14 gün içinde iade edebilirsiniz. Ürün kullanılmamış ve orijinal ambalajında olmalıdır.',
  },
  {
    category: 'İade & Değişim',
    question: 'İade kargo ücreti bana mı ait?',
    answer: 'Ürün kusurlu veya yanlış gönderilmiş ise iade kargo ücreti tarafımızca karşılanır. Diğer durumlarda müşteriye aittir.',
  },
  {
    category: 'İade & Değişim',
    question: 'Beden değişimi yapabilir miyim?',
    answer: 'Evet, iade sürecini takip ederek beden değişimi yapabilirsiniz. Yeni beden stokta mevcutsa öncelikli olarak size gönderilir.',
  },
  {
    category: 'Ödeme',
    question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
    answer: 'Kredi kartı, banka kartı ve havale/EFT ile ödeme yapabilirsiniz. Tüm kredi kartlarına taksit imkanı sunulmaktadır.',
  },
  {
    category: 'Ödeme',
    question: 'Taksit yapabilir miyim?',
    answer: 'Evet, tüm kredi kartlarına taksit imkanı sunulmaktadır. Taksit seçenekleri ödeme sayfasında görüntülenir.',
  },
  {
    category: 'Ödeme',
    question: 'Ödeme güvenli mi?',
    answer: 'Evet, tüm ödemeler SSL sertifikası ile güvence altındadır. Kredi kartı bilgileriniz hiçbir şekilde saklanmaz.',
  },
  {
    category: 'Hesap',
    question: 'Üye olmak zorunda mıyım?',
    answer: 'Hayır, misafir olarak da alışveriş yapabilirsiniz. Ancak üye olarak sipariş geçmişinizi takip edebilir ve daha hızlı alışveriş yapabilirsiniz.',
  },
  {
    category: 'Hesap',
    question: 'Şifremi unuttum, ne yapmalıyım?',
    answer: 'Giriş sayfasında "Şifremi Unuttum" linkine tıklayarak e-posta adresinize şifre sıfırlama bağlantısı gönderebilirsiniz.',
  },
  {
    category: 'Ürünler',
    question: 'Ürün bedenleri nasıl?',
    answer: 'Ürün sayfalarında detaylı beden tablosu bulunmaktadır. Vücut ölçülerinize göre uygun bedeni seçebilirsiniz.',
  },
  {
    category: 'Ürünler',
    question: 'Ürünler yıkanabilir mi?',
    answer: 'Evet, her ürünün etiketi üzerinde yıkama talimatları bulunmaktadır. Bu talimatlara uyarak ürünlerinizi yıkayabilirsiniz.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');

  const categories = ['Tümü', ...Array.from(new Set(faqs.map(faq => faq.category)))];
  const filteredFAQs = selectedCategory === 'Tümü' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light tracking-[0.2em] text-gray-900 mb-4">
            SIKÇA SORULAN SORULAR
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Merak ettiğiniz soruların cevaplarını burada bulabilirsiniz
          </p>
        </div>

        {/* Category Filter */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                      {faq.category}
                    </span>
                    <h3 className="text-lg font-medium text-gray-900">
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ml-4 ${
                      openIndex === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                
                {openIndex === index && (
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">Bu kategoride henüz soru bulunmamaktadır.</p>
            </div>
          )}

          {/* Contact CTA */}
          <div className="mt-16 text-center bg-gray-50 p-8">
            <h2 className="text-2xl font-light mb-4">Sorunuzu bulamadınız mı?</h2>
            <p className="text-gray-600 mb-6">
              Size yardımcı olmaktan mutluluk duyarız. Bizimle iletişime geçin.
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
