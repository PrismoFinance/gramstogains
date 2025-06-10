
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AppHeader } from '@/components/layout/AppHeader';
import { Skeleton } from '@/components/ui/skeleton';


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    // Basic loading skeleton for the whole app layout
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <Skeleton className="h-12 w-12 rounded-full bg-primary/20 mb-4" />
        <Skeleton className="h-4 w-[250px] bg-primary/20 mb-2" />
        <Skeleton className="h-4 w-[200px] bg-primary/20" />
      </div>
    );
  }
  
  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon">
        <AppSidebar user={user} />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <AppHeader user={user} onLogout={logout} />
          <main className="flex-grow p-4 md:p-6 lg:p-8 bg-background">
            {children}
          </main>
           <footer className="p-4 text-center text-sm text-muted-foreground border-t border-border">
            Grams &amp; Gains &copy; {new Date().getFullYear()}
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
