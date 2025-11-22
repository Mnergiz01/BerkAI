'use client';

import { useState, useEffect } from 'react';
import CreditCard3D from './CreditCard3D';

interface PaymentFormProps {
  onSubmit: (data: PaymentData) => void;
}

export interface PaymentData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

export default function PaymentForm({ onSubmit }: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentData>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState<Partial<PaymentData>>({});
  const [isFlipped, setIsFlipped] = useState(false);
  const [focusedField, setFocusedField] = useState<string>('');

  // Flip card when CVV is focused
  useEffect(() => {
    if (focusedField === 'cvv') {
      setIsFlipped(true);
    } else {
      setIsFlipped(false);
    }
  }, [focusedField]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number (only numbers)
    if (name === 'cardNumber') {
      // Only allow numbers
      const numbersOnly = value.replace(/\D/g, '');
      formattedValue = numbersOnly
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19); // 16 digits + 3 spaces
    }

    // Format expiry date (only numbers)
    if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d{0,2})/, '$1/$2')
        .slice(0, 5);
    }

    // Format CVV (only numbers)
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    // Format card name (only letters and spaces, Turkish characters included)
    if (name === 'cardName') {
      formattedValue = value.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g, '').toUpperCase();
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));

    // Clear error when user types
    if (errors[name as keyof PaymentData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PaymentData> = {};

    // Validate card number (16 digits)
    const cardNumberClean = formData.cardNumber.replace(/\s/g, '');
    if (!cardNumberClean) {
      newErrors.cardNumber = 'Kart numarası gerekli';
    } else if (cardNumberClean.length !== 16) {
      newErrors.cardNumber = 'Kart numarası 16 haneli olmalı';
    }

    // Validate card name
    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Kart üzerindeki isim gerekli';
    }

    // Validate expiry date
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Son kullanma tarihi gerekli';
    } else {
      const [month, year] = formData.expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      if (
        !month ||
        !year ||
        parseInt(month) < 1 ||
        parseInt(month) > 12 ||
        parseInt(year) < currentYear ||
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)
      ) {
        newErrors.expiryDate = 'Geçersiz tarih';
      }
    }

    // Validate CVV
    if (!formData.cvv) {
      newErrors.cvv = 'CVV gerekli';
    } else if (formData.cvv.length !== 3) {
      newErrors.cvv = 'CVV 3 haneli olmalı';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div>
      {/* 3D Card Preview */}
      <CreditCard3D
        cardNumber={formData.cardNumber}
        cardName={formData.cardName}
        expiryDate={formData.expiryDate}
        cvv={formData.cvv}
        isFlipped={isFlipped}
      />

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Number */}
        <div>
          <label
            htmlFor="cardNumber"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Kart Numarası
          </label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            onFocus={() => setFocusedField('cardNumber')}
            onBlur={() => setFocusedField('')}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-mono text-lg tracking-wider ${
              errors.cardNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="1234 5678 9012 3456"
          />
          {errors.cardNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
          )}
        </div>

        {/* Card Holder Name */}
        <div>
          <label
            htmlFor="cardName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Kart Üzerindeki İsim
          </label>
          <input
            type="text"
            id="cardName"
            name="cardName"
            value={formData.cardName}
            onChange={handleChange}
            onFocus={() => setFocusedField('cardName')}
            onBlur={() => setFocusedField('')}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black uppercase ${
              errors.cardName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="AD SOYAD"
          />
          {errors.cardName && (
            <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>
          )}
        </div>

        {/* Expiry Date and CVV */}
        <div className="grid grid-cols-2 gap-4">
          {/* Expiry Date */}
          <div>
            <label
              htmlFor="expiryDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Son Kullanma Tarihi
            </label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              onFocus={() => setFocusedField('expiryDate')}
              onBlur={() => setFocusedField('')}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-mono text-lg ${
                errors.expiryDate ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="MM/YY"
            />
            {errors.expiryDate && (
              <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
            )}
          </div>

          {/* CVV */}
          <div>
            <label
              htmlFor="cvv"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              CVV
            </label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              onFocus={() => setFocusedField('cvv')}
              onBlur={() => setFocusedField('')}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-mono text-lg ${
                errors.cvv ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="123"
            />
            {errors.cvv && (
              <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-black text-white py-3.5 rounded-lg hover:bg-gray-800 transition-colors font-medium text-lg"
        >
          Siparişi Tamamla
        </button>

        {/* Security Note */}
        <p className="text-xs text-gray-500 text-center">
          🔒 Bu bir demo ödeme ekranıdır. Gerçek ödeme altyapısı entegre edilmemiştir.
        </p>
      </form>
    </div>
  );
}
