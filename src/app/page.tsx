
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

function PublicNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">Grams to Gains</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center hover:text-primary transition-colors">
              Products <ChevronDown className="h-4 w-4 ml-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Vapes</DropdownMenuItem>
              <DropdownMenuItem>Flower</DropdownMenuItem>
              <DropdownMenuItem>Edibles</DropdownMenuItem>
              <DropdownMenuItem>Concentrates</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="#" className="hover:text-primary transition-colors">Pricing</Link>
          <Link href="#" className="hover:text-primary transition-colors">Contact Us</Link>
          <Link href="#" className="hover:text-primary transition-colors">About Us</Link>
        </nav>

        <div className="flex items-center justify-end space-x-2">
          <Button asChild variant="ghost">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-center text-white bg-gray-800">
          <Image
            src="/images/landing.jpeg"
            alt="Cannabis cultivation background"
            layout="fill"
            objectFit="cover"
            className="absolute z-0 opacity-40"
          />
          <div className="relative z-10 p-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 drop-shadow-lg">
              Precision Software for the Modern Cannabis Manufacturer
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto drop-shadow-md">
              Streamline your seed-to-sale workflow, manage inventory with unparalleled accuracy, and unlock data-driven insights to cultivate your business growth.
            </p>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/dashboard">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20">
                <Link href="#">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section could go here */}

      </main>
      <footer className="p-4 text-center text-sm text-muted-foreground border-t border-border">
          Grams to Gains &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
