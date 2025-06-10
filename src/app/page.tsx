'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <Skeleton className="h-12 w-12 rounded-full bg-primary/20 mb-4" />
      <Skeleton className="h-4 w-[250px] bg-primary/20 mb-2" />
      <Skeleton className="h-4 w-[200px] bg-primary/20" />
    </div>
  );
}
