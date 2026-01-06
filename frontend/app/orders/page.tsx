'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOrdersStore } from '@/lib/stores/ordersStore';
import { useAuthStore } from '@/lib/stores/authStore';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function OrdersPage() {
  const router = useRouter();
  const { orders } = useOrdersStore();
  const { isAuthenticated, user } = useAuthStore();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Siparişlerinizi görmek için giriş yapmalısınız');
      router.push('/login?redirect=/orders');
    }
  }, [isAuthenticated, router]);

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800' },
      processing: { label: 'Hazırlanıyor', color: 'bg-blue-100 text-blue-800' },
      shipped: { label: 'Kargoya Verildi', color: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Teslim Edildi', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'İptal Edildi', color: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Siparişlerim</h1>
          <p className="text-gray-600">
            Merhaba {user?.firstName || user?.email}, tüm siparişlerinizi buradan takip edebilirsiniz.
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <svg
                className="w-24 h-24 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h3 className="text-xl font-semibold mb-2">Henüz siparişiniz yok</h3>
              <p className="text-gray-600 mb-6">
                İlk siparişinizi vererek alışverişe başlayın!
              </p>
              <button
                onClick={() => router.push('/products')}
                className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
              >
                Alışverişe Başla
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Sipariş Numarası</p>
                      <p className="font-mono font-semibold">{order.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Tarih</p>
                      <p className="font-medium">
                        {format(new Date(order.date), 'dd MMMM yyyy, HH:mm', { locale: tr })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Toplam Tutar</p>
                      <p className="font-bold">₺{order.totalAmount.toLocaleString('tr-TR')}</p>
                    </div>
                  </div>
                  <div>{getStatusBadge(order.status)}</div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg
                                className="w-8 h-8 text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{item.name}</h4>
                          <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-600">
                            {item.size && (
                              <span>{item.size.match(/^\d+$/) ? 'Numara' : 'Beden'}: {item.size}</span>
                            )}
                            {item.color && <span>Renk: {item.color}</span>}
                            <span>Adet: {item.quantity}</span>
                          </div>
                          <p className="mt-1 font-medium">
                            ₺{(item.price * item.quantity).toLocaleString('tr-TR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold mb-2">Teslimat Adresi</h4>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.fullName}
                      <br />
                      {order.shippingAddress.phone}
                      <br />
                      {order.shippingAddress.address}
                      <br />
                      {order.shippingAddress.neighborhood && `${order.shippingAddress.neighborhood}, `}
                      {order.shippingAddress.district}, {order.shippingAddress.city}
                    </p>
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Ara Toplam:</span>
                      <span className="font-medium">
                        ₺{(order.totalAmount - order.shippingCost).toLocaleString('tr-TR')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Kargo:</span>
                      <span className="font-medium">
                        {order.shippingCost === 0 ? (
                          <span className="text-green-600">Ücretsiz</span>
                        ) : (
                          `₺${order.shippingCost.toLocaleString('tr-TR')}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Toplam:</span>
                      <span>₺{order.totalAmount.toLocaleString('tr-TR')}</span>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      Ödeme Yöntemi: <span className="font-medium">{order.paymentMethod}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
