
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';
import { AppHeader } from '@/components/layout/AppHeader';
import { useAuth } from '@/contexts/AuthContext';


export const metadata: Metadata = {
  title: 'Grams to Gains',
  description: 'Streamlined Sales and Product Management for Cannabis Businesses',
};

function PublicNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container h-14 flex items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Grams to Gains</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center hover:text-accent transition-colors">
                Products <ChevronDown className="h-4 w-4 ml-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Vapes</DropdownMenuItem>
                <DropdownMenuItem>Flower</DropdownMenuItem>
                <DropdownMenuItem>Edibles</DropdownMenuItem>
                <DropdownMenuItem>Concentrates</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="#" className="hover:text-accent transition-colors">Pricing</Link>
            <Link href="#" className="hover:text-accent transition-colors">Contact Us</Link>
            <Link href="#" className="hover:text-accent transition-colors">About Us</Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button asChild variant="ghost">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/login">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicNavbar />
      {children}
      <footer className="p-4 text-center text-sm text-muted-foreground border-t border-border">
          CannaSale &copy; {new Date().getFullYear()}
      </footer>
    </>
  )
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen flex flex-col">
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster />
      </body>
    </html>
  );
}
