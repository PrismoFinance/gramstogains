
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-center text-white bg-gray-800">
          <Image
            src="/hero-background.png"
            alt="Cannabis cultivation background"
            layout="fill"
            objectFit="cover"
            className="absolute z-0 opacity-40"
            data-ai-hint="cannabis cultivation background"
          />
          <div className="relative z-10 p-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 drop-shadow-lg">
              From Grams to Gains: Precision Software for the Modern Cannabis Manufacturer
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto drop-shadow-md">
              Streamline your seed-to-sale workflow, manage inventory with unparalleled accuracy, and unlock data-driven insights to cultivate your business growth.
            </p>
            <div className="space-x-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
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
    </div>
  );
}
