import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, Database, BarChart3, SlidersHorizontal, UserCheck, Package, ShoppingCart } from 'lucide-react';

const features = [
  {
    icon: <Package className="h-8 w-8 text-primary" />,
    title: "Comprehensive Inventory Management",
    description: "Track every product from batch creation to final sale. Our system provides real-time visibility into stock levels, METRC-tagged items, and product history, ensuring you're always in control.",
    details: ["Batch-level tracking with METRC IDs", "Automated stock level adjustments", "Centralized product templates for consistency", "Supplier and COA management"]
  },
  {
    icon: <ShoppingCart className="h-8 w-8 text-primary" />,
    title: "Wholesale Order & Sales Management",
    description: "Streamline your entire sales process. Create wholesale orders, manage pricing, and track payment statuses with ease. Empower your sales team with the tools they need to succeed.",
    details: ["Intuitive wholesale order creation form", "Dynamic pricing based on specific batches", "Payment status and terms tracking", "Sales representative performance reporting"]
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
    title: "AI-Powered Sales Analytics",
    description: "Transform your sales data into actionable intelligence. Ask plain-English questions to uncover trends, identify top-performing products, and find new opportunities for growth.",
    details: ["Natural language query interface", "Visual dashboards for at-a-glance insights", "Top product and category identification", "Exportable data for custom reports"]
  },
  {
    icon: <UserCheck className="h-8 w-8 text-primary" />,
    title: "Client & Prospecting Tools",
    description: "Manage your dispensary relationships and find new leads effortlessly. Our integrated CRM tools help you keep track of clients and discover new prospects by state.",
    details: ["Centralized client directory", "Contact and notes management", "State-based dispensary prospecting", "Seamlessly convert prospects to clients"]
  }
];

export default function ProductsPage() {
  return (
    <div className="bg-background">
      <section className="py-16 md:py-24 text-center bg-muted/30">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
            A Powerful Platform Built for Growth
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">
            Grams to Gains provides an end-to-end solution for cannabis manufacturers, combining powerful inventory control, streamlined sales, and intelligent analytics in one intuitive platform.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12">
            {features.map((feature) => (
              <Card key={feature.title} className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
                <CardHeader className="flex flex-row items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-semibold mb-1">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3 text-muted-foreground">
                    {feature.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Operations?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Join other leading manufacturers who trust Grams to Gains to streamline their workflow and drive growth.
            </p>
            <Button asChild size="lg">
                <Link href="/pricing">View Pricing & Get Started</Link>
            </Button>
        </div>
      </section>
    </div>
  );
}
