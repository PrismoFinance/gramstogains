import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

const pricingTiers = [
  {
    name: "Starter",
    price: "$249",
    description: "For new manufacturers getting started.",
    features: [
      "Up to 2 users",
      "Full Inventory Management",
      "Wholesale Order Management",
      "Basic Sales Reporting",
      "Standard Support"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Growth",
    price: "$499",
    description: "For established businesses ready to scale.",
    features: [
      "Up to 10 users",
      "All features in Starter",
      "AI-Powered Sales Analytics",
      "Client & Prospecting CRM",
      "Priority Support"
    ],
    cta: "Choose Growth",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large-scale operations with unique needs.",
    features: [
      "Unlimited users",
      "All features in Growth",
      "Custom Integrations",
      "Dedicated Account Manager",
      "24/7 Premium Support"
    ],
    cta: "Contact Us",
    popular: false
  },
];

export default function PricingPage() {
  return (
    <div className="bg-background">
      <section className="py-16 md:py-24 text-center bg-muted/30">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
            Find the Perfect Plan for Your Business
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground">
            Simple, transparent pricing that scales with you. No hidden fees.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {pricingTiers.map((tier) => (
              <Card 
                key={tier.name} 
                className={`shadow-lg hover:shadow-2xl transition-shadow flex flex-col h-full ${tier.popular ? 'border-primary border-2 shadow-primary/20' : ''}`}
              >
                <CardHeader className="text-center">
                  {tier.popular && <div className="text-primary font-semibold mb-2">MOST POPULAR</div>}
                  <CardTitle className="text-3xl font-bold">{tier.name}</CardTitle>
                  <CardDescription className="text-lg">{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="text-center mb-8">
                    <span className="text-5xl font-bold">{tier.price}</span>
                    {tier.price.startsWith('$') && <span className="text-muted-foreground">/mo</span>}
                  </div>
                  <ul className="space-y-4">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                    <Button asChild size="lg" className={`w-full ${tier.popular ? '' : 'bg-primary'}`} variant={tier.popular ? 'default' : 'outline'}>
                        <Link href={tier.cta === 'Contact Us' ? '/contact' : '/login'}>{tier.cta}</Link>
                    </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
