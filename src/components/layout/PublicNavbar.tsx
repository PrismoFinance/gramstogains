
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">Grams to Gains</span>
          </Link>
        </div>

        <nav className="flex flex-1 items-center justify-center space-x-6 text-sm font-medium">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center hover:text-primary transition-colors">
              <Link href="/products">Products</Link>
            </DropdownMenuTrigger>
          </DropdownMenu>
          <Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
          <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
        </nav>

        <div className="flex items-center justify-end space-x-2">
          <Button asChild variant="ghost">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/login">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
