'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { login } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/ui/Logo';

const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);

    console.log('🔐 Login attempt with:', { email: data.email });

    try {
      const response = await login(data);

      console.log('✅ Login response:', response);

      // Handle different response formats
      const authData = (response as any).data || response;

      if (authData.token) {
        // Backend returns: { token, email, firstName, lastName, isEmailConfirmed }
        const userData = {
          id: 0,
          email: authData.email || data.email,
          username: (authData.email || data.email).split('@')[0],
          firstName: authData.firstName || '',
          lastName: authData.lastName || '',
          role: 'Customer' as const,
          createdAt: new Date().toISOString(),
        };

        setAuth(userData, authData.token, rememberMe);
        toast.success('Başarıyla giriş yapıldı!');
        router.push(redirectUrl);
      } else {
        console.log('❌ No token in response');
        toast.error(authData.message || 'E-posta veya şifre hatalı');
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);

      // Handle specific error cases
      const status = error.response?.status;
      const errorData = error.response?.data;

      let errorMessage = '';

      if (status === 401 || status === 400) {
        // Unauthorized or Bad Request - wrong credentials
        errorMessage = 'E-posta veya şifre hatalı';
      } else if (status === 404) {
        // User not found
        errorMessage = 'Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı';
      } else if (status === 403) {
        // Forbidden - account might be locked or not verified
        errorMessage = errorData?.message || 'Hesabınız doğrulanmamış veya engellenmiş';
      } else {
        // Generic error
        errorMessage = errorData?.message || error.message || 'Giriş yapılırken bir hata oluştu';
      }

      console.log('🚨 Showing error:', errorMessage);
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-center',
      });
    } finally {
      setIsLoading(false);
    }
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
              Hesabınıza Giriş Yapın
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Henüz hesabınız yok mu?{' '}
              <Link
                href="/register"
                className="font-semibold text-black hover:underline"
              >
                Üye olun
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              <Input
                label="E-posta"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                placeholder="ornek@email.com"
              />

              <Input
                label="Şifre"
                type="password"
                {...register('password')}
                error={errors.password?.message}
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-black focus:ring-2 focus:ring-black border-gray-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700 cursor-pointer select-none"
                >
                  Beni hatırla
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/auth/forgot-password"
                  className="font-medium text-black hover:underline"
                >
                  Şifremi unuttum
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Giriş Yap
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
