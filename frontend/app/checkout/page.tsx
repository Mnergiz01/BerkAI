'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalCartStore } from '@/lib/stores/localCartStore';
import { useOrdersStore } from '@/lib/stores/ordersStore';
import AddressForm, { AddressData } from '@/components/checkout/AddressForm';
import PaymentForm, { PaymentData } from '@/components/checkout/PaymentForm';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useLocalCartStore();
  const { addOrder } = useOrdersStore();
  const [currentStep, setCurrentStep] = useState(2); // Start from step 2 (Address)
  const [addressData, setAddressData] = useState<AddressData | null>(null);

  const handleAddressSubmit = (data: AddressData) => {
    setAddressData(data);
    setCurrentStep(3);
  };

  const handlePaymentSubmit = (_data: PaymentData) => {
    if (!addressData) return;

    const shippingCost = totalPrice > 500 ? 0 : 29.99;

    // Create order
    addOrder({
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: item.image,
      })),
      totalAmount: totalPrice + shippingCost,
      shippingCost,
      shippingAddress: {
        fullName: addressData.fullName,
        phone: addressData.phone,
        address: addressData.address,
        city: addressData.city,
        district: addressData.district,
        neighborhood: addressData.neighborhood,
      },
      paymentMethod: 'Kredi Kartı',
    });

    // Clear cart and show success message
    toast.success('Siparişiniz başarıyla oluşturuldu!');
    clearCart();

    // Redirect to orders page after 2 seconds
    setTimeout(() => {
      router.push('/orders');
    }, 2000);
  };

  const shippingCost = totalPrice > 500 ? 0 : 29.99;
  const finalTotal = totalPrice + shippingCost;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            {/* Step 1: Adres */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  currentStep >= 2
                    ? 'bg-black text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                1
              </div>
              <span className="text-xs mt-2 font-medium">Adres</span>
            </div>

            {/* Line */}
            <div
              className={`w-24 h-0.5 mx-4 transition-colors ${
                currentStep >= 3 ? 'bg-black' : 'bg-gray-300'
              }`}
            />

            {/* Step 2: Ödeme */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  currentStep >= 3
                    ? 'bg-black text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                2
              </div>
              <span className="text-xs mt-2 font-medium">Ödeme</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Teslimat Adresi</h2>
                  <AddressForm onSubmit={handleAddressSubmit} />
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Ödeme Bilgileri</h2>
                  <PaymentForm onSubmit={handlePaymentSubmit} />
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold mb-4">Sipariş Özeti</h3>

              <div className="space-y-3 mb-4 pb-4 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ara Toplam</span>
                  <span className="font-medium">₺{totalPrice.toLocaleString('tr-TR')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kargo</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Ücretsiz</span>
                    ) : (
                      `₺${shippingCost.toLocaleString('tr-TR')}`
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold mb-4">
                <span>Toplam</span>
                <span>₺{finalTotal.toLocaleString('tr-TR')}</span>
              </div>

              {totalPrice < 500 && (
                <p className="text-xs text-gray-500">
                  500 TL ve üzeri alışverişlerde kargo ücretsiz
                </p>
              )}

              {/* Address Info */}
              {addressData && currentStep === 3 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-2">Teslimat Adresi</h4>
                  <p className="text-sm text-gray-600">
                    {addressData.fullName}<br />
                    {addressData.phone}<br />
                    {addressData.address}<br />
                    {addressData.neighborhood && `${addressData.neighborhood}, `}
                    {addressData.district}, {addressData.city}
                  </p>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-sm text-blue-600 hover:underline mt-2"
                  >
                    Adresi Değiştir
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
