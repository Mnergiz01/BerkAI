'use client';

import { useState, useEffect } from 'react';

interface CreditCard3DProps {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  isFlipped: boolean;
}

export default function CreditCard3D({
  cardNumber,
  cardName,
  expiryDate,
  cvv,
  isFlipped,
}: CreditCard3DProps) {
  const formatCardNumber = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || '';
    return formatted.padEnd(19, '•');
  };

  const formatExpiryDate = (date: string) => {
    if (!date) return 'MM/YY';
    return date;
  };

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div
        className="relative h-56 transition-transform duration-600 preserve-3d"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front of card */}
        <div
          className="absolute w-full h-full backface-hidden rounded-2xl shadow-2xl p-8 bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Card chip */}
          <div className="w-12 h-10 rounded bg-gradient-to-br from-yellow-200 to-yellow-400 mb-8 shadow-lg" />

          {/* Card number */}
          <div className="mb-6">
            <p className="text-2xl tracking-widest font-mono">
              {formatCardNumber(cardNumber)}
            </p>
          </div>

          {/* Card holder and expiry */}
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-gray-400 mb-1">Kart Sahibi</p>
              <p className="text-lg font-semibold tracking-wide uppercase">
                {cardName || 'AD SOYAD'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1">Son Kullanma Tarihi</p>
              <p className="text-lg font-semibold tracking-wider">
                {formatExpiryDate(expiryDate)}
              </p>
            </div>
          </div>

          {/* Card brand */}
          <div className="absolute top-8 right-8">
            <div className="flex space-x-2">
              <div className="w-10 h-10 rounded-full bg-red-500 opacity-80" />
              <div className="w-10 h-10 rounded-full bg-orange-400 opacity-80 -ml-4" />
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute w-full h-full backface-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-gray-800 via-gray-900 to-black"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Black stripe */}
          <div className="w-full h-12 bg-black mt-8" />

          {/* CVV section */}
          <div className="px-8 mt-8">
            <div className="bg-white h-10 rounded flex items-center justify-end px-4">
              <div className="bg-gradient-to-r from-gray-300 to-gray-100 h-8 w-20 flex items-center justify-center rounded text-black font-mono font-semibold text-lg italic">
                {cvv || '•••'}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-right">CVV</p>
          </div>

          {/* Card brand (back) */}
          <div className="absolute bottom-8 right-8">
            <div className="flex space-x-2">
              <div className="w-10 h-10 rounded-full bg-red-500 opacity-80" />
              <div className="w-10 h-10 rounded-full bg-orange-400 opacity-80 -ml-4" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .backface-hidden {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
}
