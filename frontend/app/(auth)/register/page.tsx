'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { register as registerUser } from '@/lib/api/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { Logo } from '@/components/ui/Logo';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '@/lib/stores/authStore';

const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'Ad en az 2 karakter olmalıdır')
      .max(50, 'Ad en fazla 50 karakter olabilir')
      .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'Ad sadece harf içerebilir'),
    lastName: z
      .string()
      .min(2, 'Soyad en az 2 karakter olmalıdır')
      .max(50, 'Soyad en fazla 50 karakter olabilir')
      .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'Soyad sadece harf içerebilir'),
    email: z
      .string()
      .email('Geçerli bir e-posta adresi girin')
      .regex(
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Geçerli bir e-posta adresi girin'
      )
      .refine(
        (email) => {
          const domain = email.split('@')[1]?.toLowerCase();
          if (!domain) return false;

          // Check for valid TLD
          if (!/\.[a-zA-Z]{2,}$/.test(domain) || /[^a-zA-Z0-9.-]/.test(domain)) {
            return false;
          }

          // Yaygın yazım hatalarını yakala
          const commonTypos = [
            'gmial.com', 'gmai.com', 'gmil.com', 'gamil.com',
            'hotmal.com', 'hotmial.com', 'hotmil.com', 'hootmail.com',
            'yahooo.com', 'yaho.com', 'yhoo.com',
            'outlok.com', 'outloo.com', 'outlookk.com'
          ];

          return !commonTypos.includes(domain);
        },
        { message: 'E-posta adresinde yazım hatası var gibi görünüyor. Lütfen kontrol edin.' }
      ),
    phoneNumber: z
      .string()
      .min(1, 'Telefon numarası gereklidir')
      .refine(
        (phone) => {
          // Phone comes as "+905551234567" from PhoneInput
          if (!phone || phone.length === 0) return false;

          // Should start with + and have digits after
          if (!phone.startsWith('+')) return false;

          // Remove the + and check if rest are digits
          const digitsOnly = phone.substring(1);
          if (!/^[0-9]+$/.test(digitsOnly)) return false;

          // Total length should be between 10-15 characters (including country code)
          // This covers most international phone numbers
          return phone.length >= 10 && phone.length <= 15;
        },
        { message: 'Geçerli bir telefon numarası girin' }
      ),
    gender: z.enum(['Male', 'Female', 'PreferNotToSay'], {
      message: 'Lütfen cinsiyet seçin',
    }),
    password: z
      .string()
      .min(6, 'Şifre en az 6 karakter olmalıdır')
      .max(100, 'Şifre en fazla 100 karakter olabilir')
      .optional()
      .or(z.literal('')),
    confirmPassword: z.string().optional().or(z.literal('')),
    isGoogleSignup: z.boolean().optional(),
  })
  .refine((data) => {
    // Eğer Google ile kayıt değilse, şifre gerekli
    if (!data.isGoogleSignup && !data.password) {
      return false;
    }
    // Eğer şifre varsa, confirm password eşleşmeli
    if (data.password && data.password !== data.confirmPassword) {
      return false;
    }
    return true;
  }, {
    message: 'Şifreler eşleşmiyor veya şifre gerekli',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [isGoogleSignup, setIsGoogleSignup] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      isGoogleSignup: false,
    },
  });

  // URL'den Google bilgilerini oku
  useEffect(() => {
    const googleEmail = searchParams.get('googleEmail');
    const googleFirstName = searchParams.get('googleFirstName');
    const googleLastName = searchParams.get('googleLastName');

    if (googleEmail) {
      setValue('email', googleEmail);
      setValue('firstName', googleFirstName || '');
      setValue('lastName', googleLastName || '');
      setValue('isGoogleSignup', true);
      setIsGoogleSignup(true);
      toast.success('Google bilgileri alındı! Lütfen diğer bilgileri doldurun.');
    }
  }, [searchParams, setValue]);

  const handleGoogleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);

        // Google'dan kullanıcı bilgilerini al
        const userInfoResponse = await fetch(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`
        );
        const userInfo = await userInfoResponse.json();

        console.log('Google user info:', userInfo);

        // Form alanlarını doldur
        setValue('email', userInfo.email || '');
        setValue('firstName', userInfo.given_name || '');
        setValue('lastName', userInfo.family_name || '');
        setValue('isGoogleSignup', true);
        setIsGoogleSignup(true);

        toast.success('Google bilgileri alındı! Lütfen diğer bilgileri doldurun.');
      } catch (error) {
        console.error('Google signup error:', error);
        toast.error('Google ile bilgiler alınamadı. Lütfen tekrar deneyin.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
      toast.error('Google ile bağlantı kurulamadı.');
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    console.log('Form data:', data);
    try {
      const requestData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        gender: data.gender,
        password: data.password || 'GOOGLE_AUTH', // Google ile kayıt için dummy password
        isGoogleSignup: isGoogleSignup, // Google ile kayıt flag'i
      };
      console.log('Request data:', requestData);
      const response = await registerUser(requestData);

      if (response.isSuccess) {
        setRegisteredEmail(data.email);
        if (isGoogleSignup) {
          // Google ile kayıtta otomatik giriş yap
          toast.success('Kayıt başarılı! Giriş yapılıyor...');

          try {
            // Backend'e login isteği at
            const loginResponse = await fetch('http://localhost:5195/api/auth/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: data.email,
                password: 'GOOGLE_AUTH'
              }),
            });

            const loginData = await loginResponse.json();

            if (loginResponse.ok) {
              const authData = loginData.data || loginData;
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
              toast.success('Giriş başarılı!');
              router.push('/');
            } else {
              toast.error('Kayıt başarılı ancak giriş yapılamadı. Lütfen manuel giriş yapın.');
              router.push('/login');
            }
          } catch (loginError) {
            console.error('Auto login error:', loginError);
            toast.error('Kayıt başarılı ancak giriş yapılamadı. Lütfen manuel giriş yapın.');
            router.push('/login');
          }
        } else {
          toast.success('Kayıt başarılı! Lütfen e-postanızı kontrol edin.');
          router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
        }
      } else {
        toast.error(response.message || 'Kayıt başarısız');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Bir hata oluştu';
      toast.error(errorMessage);
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err: string) => toast.error(err));
      }
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
              Hesap Oluşturun
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Zaten hesabınız var mı?{' '}
              <Link
                href="/login"
                className="font-semibold text-black hover:underline"
              >
                Giriş yapın
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Google Sign Up Button */}
            {!isGoogleSignup && (
              <>
                <button
                  type="button"
                  onClick={() => handleGoogleSignup()}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                    <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                    <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                    <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Google ile Kayıt Ol</span>
                </button>

                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <span className="text-sm text-gray-500">Veya</span>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>
              </>
            )}

            {isGoogleSignup && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  ✓ Google bilgileriniz alındı. Lütfen telefon numaranızı ve cinsiyetinizi girin.
                </p>
              </div>
            )}

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Ad"
                  type="text"
                  {...register('firstName')}
                  error={errors.firstName?.message}
                  placeholder="Adınız"
                  disabled={isGoogleSignup}
                />

                <Input
                  label="Soyad"
                  type="text"
                  {...register('lastName')}
                  error={errors.lastName?.message}
                  placeholder="Soyadınız"
                  disabled={isGoogleSignup}
                />
              </div>

              <Input
                label="E-posta"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                placeholder="ornek@email.com"
                disabled={isGoogleSignup}
              />

              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    label="Telefon"
                    {...field}
                    error={errors.phoneNumber?.message}
                    placeholder="5551234567"
                  />
                )}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cinsiyet
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <label className={`relative flex items-center justify-center px-4 py-3 border rounded-lg cursor-pointer transition-all ${
                    errors.gender?.message ? 'border-red-500' : 'border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      value="Male"
                      {...register('gender')}
                      className="sr-only peer"
                    />
                    <span className="text-sm font-medium text-gray-700 peer-checked:text-black">
                      Erkek
                    </span>
                    <div className="absolute inset-0 border-2 border-black rounded-lg opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                  </label>

                  <label className={`relative flex items-center justify-center px-4 py-3 border rounded-lg cursor-pointer transition-all ${
                    errors.gender?.message ? 'border-red-500' : 'border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      value="Female"
                      {...register('gender')}
                      className="sr-only peer"
                    />
                    <span className="text-sm font-medium text-gray-700 peer-checked:text-black">
                      Kadın
                    </span>
                    <div className="absolute inset-0 border-2 border-black rounded-lg opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                  </label>

                  <label className={`relative flex items-center justify-center px-4 py-3 border rounded-lg cursor-pointer transition-all ${
                    errors.gender?.message ? 'border-red-500' : 'border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      value="PreferNotToSay"
                      {...register('gender')}
                      className="sr-only peer"
                    />
                    <span className="text-xs font-medium text-gray-700 peer-checked:text-black text-center leading-tight">
                      Belirtmek<br/>İstemiyorum
                    </span>
                    <div className="absolute inset-0 border-2 border-black rounded-lg opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                  </label>
                </div>
                {errors.gender?.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                )}
              </div>

              {!isGoogleSignup && (
                <>
                  <Input
                    label="Şifre"
                    type="password"
                    {...register('password')}
                    error={errors.password?.message}
                    placeholder="••••••••"
                  />

                  <Input
                    label="Şifre Tekrar"
                    type="password"
                    {...register('confirmPassword')}
                    error={errors.confirmPassword?.message}
                    placeholder="••••••••"
                  />
                </>
              )}
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded cursor-pointer mt-0.5"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 cursor-pointer select-none">
                <Link href="/legal/terms" className="hover:underline font-medium text-black">
                  Kullanım koşullarını
                </Link>{' '}
                ve{' '}
                <Link href="/legal/privacy" className="hover:underline font-medium text-black">
                  gizlilik politikasını
                </Link>{' '}
                kabul ediyorum
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Üye Ol
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Zaten hesabınız var mı?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-black hover:text-gray-700 transition-colors"
                >
                  Giriş yapın
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
