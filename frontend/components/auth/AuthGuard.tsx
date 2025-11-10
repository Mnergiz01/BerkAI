'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const checkTokenExpiry = useAuthStore((state) => state.checkTokenExpiry);

  useEffect(() => {
    // Check token expiry on mount
    checkTokenExpiry();

    // Check token expiry every 5 minutes
    const interval = setInterval(() => {
      checkTokenExpiry();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [checkTokenExpiry]);

  return <>{children}</>;
}
