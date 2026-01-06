'use client';

import { useEffect, useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useLocalCartStore } from '@/lib/stores/localCartStore';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useLocalCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const shippingCost = totalPrice > 500 ? 0 : 29.99;
  const finalTotal = totalPrice + shippingCost;

  return (
    <div className="min-h-screen bg-white pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black">Sepetim</h1>
          </div>

          {items.length === 0 ? (
            /* Empty Cart */
            <div className="flex flex-col items-center justify-center py-16">
              <ShoppingBag className="w-24 h-24 text-gray-300 mb-6" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                Sepetiniz Boş
              </h2>
              <p className="text-gray-500 mb-6">
                Alışverişe başlamak için ürünleri keşfedin
              </p>
              <Link
                href="/"
                className="bg-black text-white py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Alışverişe Başla
              </Link>
            </div>
          ) : (
            /* Cart Items */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Side - Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.selectedSize}`}
                      className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
                    >
                      <div className="flex gap-0">
                        {/* Product Image */}
                        <Link
                          href={`/product/${item.id}`}
                          className="w-44 h-56 bg-white overflow-hidden flex-shrink-0"
                        >
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <ShoppingBag className="w-16 h-16 text-gray-300" />
                            </div>
                          )}
                        </Link>

                        {/* Product Details */}
                        <div className="flex-1 flex flex-col justify-between p-6">
                          <div>
                            <Link
                              href={`/product/${item.id}`}
                              className="font-normal text-black mb-3 text-xl leading-tight hover:underline"
                            >
                              {item.name}
                            </Link>
                            {item.selectedSize && (
                              <p className="text-base text-gray-400 mb-2">
                                {item.selectedSize.match(/^\d+$/) ? 'Numara' : 'Beden'}: {item.selectedSize}
                              </p>
                            )}
                            <p className="text-base text-gray-400 mb-4">
                              Adet: {item.quantity}
                            </p>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3 mt-4">
                              <div className="flex items-center border border-gray-300 rounded">
                                <button
                                  onClick={() => {
                                    if (item.quantity > 1) {
                                      updateQuantity(item.id, item.selectedSize, item.quantity - 1);
                                    }
                                  }}
                                  className="p-2 hover:bg-gray-100"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-4 py-2 font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                                  className="p-2 hover:bg-gray-100"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>

                              <button
                                onClick={() => {
                                  removeItem(item.id, item.selectedSize);
                                  toast.success('Ürün sepetten kaldırıldı');
                                }}
                                className="p-2 text-red-500 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>

                          {/* Price */}
                          <p className="font-bold text-black text-2xl mt-4">
                            ₺{(item.price * item.quantity).toLocaleString('tr-TR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 border border-gray-200 rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Sipariş Özeti</h2>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Ara Toplam</span>
                      <span>₺{totalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Kargo</span>
                      <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                        {shippingCost === 0 ? 'Ücretsiz' : `₺${shippingCost.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`}
                      </span>
                    </div>
                    {shippingCost > 0 && (
                      <p className="text-sm text-gray-500">
                        ₺{(500 - totalPrice).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} değerinde daha alışveriş yapın, kargo bedava!
                      </p>
                    )}
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Toplam</span>
                      <span>₺{finalTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Ödemeye Geç
                  </Link>

                  <Link
                    href="/"
                    className="w-full mt-3 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    Alışverişe Devam Et
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}
