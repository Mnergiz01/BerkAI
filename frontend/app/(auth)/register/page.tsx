'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
          const domain = email.split('@')[1];
          // Check for valid TLD
          return /\.[a-zA-Z]{2,}$/.test(domain) && !/[^a-zA-Z0-9.-]/.test(domain);
        },
        { message: 'Geçersiz e-posta domaini' }
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
    password: z
      .string()
      .min(6, 'Şifre en az 6 karakter olmalıdır')
      .max(100, 'Şifre en fazla 100 karakter olabilir'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Şifreler eşleşmiyor',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const response = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        username: data.email.split('@')[0], // Generate username from email
        phoneNumber: data.phoneNumber,
        password: data.password,
      });

      if (response.isSuccess) {
        setRegisteredEmail(data.email);
        toast.success('Kayıt başarılı! Lütfen e-postanızı kontrol edin.');
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
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
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Ad"
                  type="text"
                  {...register('firstName')}
                  error={errors.firstName?.message}
                  placeholder="Adınız"
                />

                <Input
                  label="Soyad"
                  type="text"
                  {...register('lastName')}
                  error={errors.lastName?.message}
                  placeholder="Soyadınız"
                />
              </div>

              <Input
                label="E-posta"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                placeholder="ornek@email.com"
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
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-black focus:ring-2 focus:ring-black border-gray-300 rounded cursor-pointer mt-0.5"
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
          </form>
        </div>
      </div>
    </div>
  );
}
