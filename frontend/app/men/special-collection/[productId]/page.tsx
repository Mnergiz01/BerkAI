'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageLoader from '@/components/ui/PageLoader';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;

  useEffect(() => {
    // Redirect to main product page
    router.replace(`/product/${productId}`);
  }, [productId, router]);

  return <PageLoader />;
}
