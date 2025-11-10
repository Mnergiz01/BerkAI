'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { verifyEmail } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    const activationCode = code.join('');

    if (activationCode.length !== 6) {
      toast.error('Lütfen 6 haneli kodu giriniz');
      return;
    }

    if (!email) {
      toast.error('E-posta adresi bulunamadı');
      return;
    }

    setIsLoading(true);
    try {
      const response = await verifyEmail({
        email,
        activationCode,
      });

      console.log('Verify email response:', response); // Debug log

      // Check if response has data property (backend wrapper)
      const authData = (response as any).data || response;

      // Backend returns AuthResponse with token and user
      if (authData.token && authData.user) {
        setAuth(authData.user, authData.token);
        toast.success('E-posta adresiniz doğrulandı!');
        router.push('/');
      } else if (authData.token) {
        // If we have token but no user, create a basic user object
        const userData = {
          id: 0,
          email: email,
          username: email.split('@')[0],
          firstName: authData.firstName || '',
          lastName: authData.lastName || '',
          role: 'Customer' as const,
          createdAt: new Date().toISOString(),
        };
        setAuth(userData, authData.token);
        toast.success('E-posta adresiniz doğrulandı!');
        router.push('/');
      } else {
        toast.error(authData.message || 'Doğrulama başarısız');
        setCode(['', '', '', '', '', '']);
        document.getElementById('code-0')?.focus();
      }
    } catch (error: any) {
      console.error('Verify email error:', error); // Debug log
      const errorMessage = error.response?.data?.message || error.message || 'Bir hata oluştu';
      toast.error(errorMessage);
      // Reset code inputs on error
      setCode(['', '', '', '', '', '']);
      document.getElementById('code-0')?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newCode = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setCode(newCode);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    document.getElementById(`code-${lastIndex}`)?.focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          <div>
            <Link href="/" className="flex justify-center mb-6">
              <Logo />
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 text-center">
              E-posta Doğrulama
            </h2>
            <p className="mt-3 text-center text-sm text-gray-600">
              {email ? (
                <>
                  <span className="font-semibold text-gray-900">{email}</span> adresine gönderilen 6
                  haneli kodu giriniz
                </>
              ) : (
                'Lütfen e-posta adresinizi kontrol ediniz'
              )}
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="flex justify-center gap-3" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold text-black border-2 border-gray-300 rounded-lg focus:border-black focus:ring-2 focus:ring-black/20 focus:outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                />
              ))}
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              onClick={handleVerify}
            >
              Doğrula
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Kod gelmedi mi?{' '}
                <button
                  type="button"
                  className="font-semibold text-black hover:text-gray-700 transition-colors"
                  onClick={() => toast.success('Yeni kod gönderildi')}
                >
                  Tekrar gönder
                </button>
              </p>
              <p className="text-xs text-gray-500">
                Kod 15 dakika içinde geçersiz olacaktır
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
