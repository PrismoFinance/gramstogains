
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Database, BarChart3, SlidersHorizontal } from 'lucide-react';

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
              <DropdownMenuItem>Flower</DropdownMenuItem>
              <DropdownMenuItem>Pre-Rolls</DropdownMenuItem>
              <DropdownMenuItem>Edibles</DropdownMenuItem>
              <DropdownMenuItem>Vapes</DropdownMenuItem>
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
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <PublicNavbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-center">
          <Image
            src="/images/landing.jpeg"
            alt="Cannabis cultivation background"
            layout="fill"
            objectFit="cover"
            className="absolute z-0"
            data-ai-hint="cannabis cultivation"
          />
          <div className="absolute inset-0 bg-black/30 z-0" />
          <div className="relative z-10 p-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 drop-shadow-lg text-white">
              Precision Software for the Modern Cannabis Manufacturer
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto drop-shadow-md text-gray-200">
              Streamline your seed-to-sale workflow, manage inventory with unparalleled accuracy, and unlock data-driven insights to cultivate your business growth.
            </p>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/dashboard">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30">
                <Link href="#">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 space-y-20">

            {/* Feature 1: Inventory Management */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2">
                <Image
                  src="/images/inventory.jpeg"
                  alt="Inventory Management Graphic"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                  data-ai-hint="cannabis inventory"
                />
              </div>
              <div className="w-full md:w-1/2">
                <div className="bg-primary/10 inline-block p-3 rounded-lg mb-4">
                    <Database className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Master Your Inventory</h2>
                <p className="text-muted-foreground mb-4 text-lg">
                  Track every gram from seed to sale. Our system provides real-time visibility into your product batches, METRC-tagged inventory, and stock levels, eliminating guesswork and preventing stockouts.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Batch-level tracking and management.</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Automated stock level updates.</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Centralized product templates.</li>
                </ul>
              </div>
            </div>

            {/* Feature 2: Sales Analytics */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              <div className="w-full md:w-1/2">
                <Image
                  src="/images/insights.jpeg"
                  alt="Sales Analytics Graphic"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                  data-ai-hint="sales analytics"
                />
              </div>
              <div className="w-full md:w-1/2">
                <div className="bg-primary/10 inline-block p-3 rounded-lg mb-4">
                    <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Unlock Actionable Insights</h2>
                <p className="text-muted-foreground mb-4 text-lg">
                  Go beyond basic reporting. Our AI-powered analytics engine answers your toughest questions in plain English. Identify top-performing products, uncover regional trends, and discover opportunities for growth.
                </p>
                 <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Natural language querying.</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Performance dashboards and visualizations.</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Exportable reports for deeper analysis.</li>
                </ul>
              </div>
            </div>

            {/* Feature 3: Streamlined Operations */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2">
                <Image
                  src="/images/streamline.jpeg"
                  alt="Streamlined Operations Graphic"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                  data-ai-hint="streamlined operations"
                />
              </div>
              <div className="w-full md:w-1/2">
                <div className="bg-primary/10 inline-block p-3 rounded-lg mb-4">
                    <SlidersHorizontal className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Streamline Your Workflow</h2>
                <p className="text-muted-foreground mb-4 text-lg">
                  From creating new wholesale orders to managing dispensary clients, our intuitive interface is designed to save you time. Reduce manual data entry and focus on what you do best: growing your business.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Fast wholesale order creation.</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Centralized client and prospect management.</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Role-based access for your entire team.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics Section */}
        <section className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-4">Data-Driven Decisions</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-12 text-lg">
                    Our platform turns your raw data into a competitive advantage, providing clear metrics to guide your strategy.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {/* Metric 1 */}
                    <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-lg">
                        <div className="w-24 h-24 rounded-full border-8 border-primary bg-primary/10 flex items-center justify-center mb-4">
                            <span className="text-2xl font-bold text-primary">30%</span>
                        </div>
                        <h3 className="font-semibold text-xl mb-2">Reduce Waste</h3>
                        <p className="text-muted-foreground text-sm">Optimize production and inventory to reduce waste by up to 30%.</p>
                    </div>
                    {/* Metric 2 */}
                    <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-lg">
                        <div className="w-24 h-24 rounded-full border-8 border-accent bg-accent/10 flex items-center justify-center mb-4">
                            <span className="text-2xl font-bold text-accent">50%</span>
                        </div>
                        <h3 className="font-semibold text-xl mb-2">Faster Reporting</h3>
                        <p className="text-muted-foreground text-sm">Cut down on time spent on manual reporting by over 50% with our automated tools.</p>
                    </div>
                    {/* Metric 3 */}
                    <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-lg">
                        <div className="w-24 h-24 rounded-full border-8 border-secondary bg-secondary/10 flex items-center justify-center mb-4">
                            <span className="text-2xl font-bold text-secondary">20%</span>
                        </div>
                        <h3 className="font-semibold text-xl mb-2">Increase Sales</h3>
                        <p className="text-muted-foreground text-sm">Identify top-performing products and sales channels to boost revenue.</p>
                    </div>
                </div>
            </div>
        </section>


      </main>
      <footer className="p-4 text-center text-sm text-muted-foreground border-t border-border">
          Grams to Gains &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

// Helper icon for the features list
function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} viewBox="0 0 24 24" height="1em" width="1em" {...props}>
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <path d="M22 4L12 14.01l-3-3" />
        </svg>
    )
}
