'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { useGoogleLogin } from '@react-oauth/google';

interface LoginDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginDrawer({ isOpen, onClose }: LoginDrawerProps) {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5195/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Backend returns: { data: { token, email, firstName, lastName, isEmailConfirmed } }
        const authData = data.data || data;
        const userData = {
          id: 0,
          email: authData.email,
          username: authData.email.split('@')[0],
          firstName: authData.firstName || '',
          lastName: authData.lastName || '',
          role: 'Customer' as const,
          createdAt: new Date().toISOString(),
        };

        setAuth(userData, authData.token);
        onClose();
        router.refresh();
      } else {
        setError(data.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        setError('');
        console.log('Google token alındı:', tokenResponse);

        // Google access token'ı backend'e gönder
        const response = await fetch('http://localhost:5195/api/auth/google-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ accessToken: tokenResponse.access_token }),
        });

        const data = await response.json();

        console.log('Backend response status:', response.status);
        console.log('Response ok?', response.ok);
        console.log('Backend response data:', data);

        // Kullanıcı kayıtlı değilse kayıt sayfasına yönlendir
        if (response.status === 401 || !response.ok) {
          console.log('User not found, redirecting to register');

          // Google'dan kullanıcı bilgilerini al
          const userInfoResponse = await fetch(
            `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`
          );
          const userInfo = await userInfoResponse.json();

          // Kullanıcıyı kayıt sayfasına yönlendir ve Google bilgilerini URL'de taşı
          onClose();
          router.push(`/register?googleEmail=${encodeURIComponent(userInfo.email)}&googleFirstName=${encodeURIComponent(userInfo.given_name || '')}&googleLastName=${encodeURIComponent(userInfo.family_name || '')}`);
          return;
        }

        // Başarılı giriş
        if (response.ok) {
          console.log('Login successful');
          // Backend returns: { data: { token, email, firstName, lastName, isEmailConfirmed } }
          const authData = data.data || data;
          const userData = {
            id: 0,
            email: authData.email,
            username: authData.email.split('@')[0],
            firstName: authData.firstName || '',
            lastName: authData.lastName || '',
            role: 'Customer' as const,
            createdAt: new Date().toISOString(),
          };

          setAuth(userData, authData.token);
          onClose();
          router.refresh();
        }
      } catch (err) {
        console.error('Google login error:', err);
        setError(`Bir hata oluştu: ${err instanceof Error ? err.message : 'Lütfen tekrar deneyin.'}`);
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
      setError('Google ile giriş yapılamadı.');
    },
  });

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-[850px] bg-white shadow-2xl z-[70] transform transition-all duration-500 ease-out overflow-y-auto ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
          <h2 className="text-xl font-light text-black tracking-wide">Giriş Yap</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black transition-colors"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          {/* "I already have an account" section */}
          <div className="mb-12">
            <h3 className="text-base font-normal text-black mb-6">Zaten hesabım var</h3>

            {/* Google Sign In */}
            <button
              onClick={() => handleGoogleLogin()}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors mb-6"
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
              </svg>
              <span className="text-sm font-normal text-black">Google ile Giriş Yap</span>
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-sm text-gray-500">Veya</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="text-right mb-4">
                <span className="text-xs text-gray-500">Zorunlu alanlar*</span>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-normal text-black mb-2">
                  E-posta*
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-normal text-black mb-2">
                  Şifre*
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <button
                  type="button"
                  className="text-xs text-black underline mt-2 hover:no-underline"
                >
                  Şifrenizi mi unuttunuz?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 px-6 rounded-full hover:bg-white hover:text-black hover:border hover:border-black transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-light text-sm tracking-wide"
              >
                {loading ? 'GİRİŞ YAPILIYOR...' : 'GİRİŞ YAP'}
              </button>
            </form>
          </div>

          {/* "I don't have an account" section */}
          <div className="border-t border-gray-200 pt-10">
            <h3 className="text-base font-normal text-black mb-4">Hesabım yok</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Kişisel hesap oluşturarak ek avantajlar ve zengin bir deneyim yaşayın
            </p>
            <button
              onClick={() => {
                onClose();
                router.push('/register');
              }}
              className="w-full border-2 border-black text-black py-4 px-6 rounded-full hover:border-[3px] transition-all duration-700 font-light text-sm tracking-wide"
            >
              HESAP OLUŞTUR
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
