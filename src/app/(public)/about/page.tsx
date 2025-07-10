import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Handshake, Target, Users } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-muted/30">
        <div className="container text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
              Cultivating Growth Through Technology
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">
              We are a team of technologists and industry experts passionate about providing cannabis manufacturers with the tools they need to thrive in a complex market.
            </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 md:py-24">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
            <div>
                <Image 
                    src="https://placehold.co/600x400.png"
                    alt="Team working together"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-xl"
                    data-ai-hint="team collaboration"
                />
            </div>
            <div>
                <Target className="h-10 w-10 text-primary mb-4" />
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-lg text-muted-foreground mb-4">
                    Our mission is to empower cannabis manufacturers by simplifying complexity. We build intuitive, powerful, and reliable software that streamlines operations from seed to sale, allowing our clients to focus on what they do best: creating high-quality products.
                </p>
                <p className="text-lg text-muted-foreground">
                    We believe that by providing clear data and intelligent insights, we can help our clients not only stay compliant but also achieve sustainable growth and profitability.
                </p>
            </div>
        </div>
      </section>
      
      {/* Our Values */}
      <section className="py-16 md:py-24 bg-muted/30">
          <div className="container text-center">
                <h2 className="text-3xl font-bold mb-12">Our Core Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="flex flex-col items-center">
                        <div className="bg-primary/10 p-4 rounded-full mb-4">
                           <Users className="h-10 w-10 text-primary" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-2">Customer-Centric</h3>
                        <p className="text-muted-foreground">Our customers are our partners. We succeed when they succeed. We listen to their feedback and build solutions that solve their real-world problems.</p>
                    </div>
                     <div className="flex flex-col items-center">
                        <div className="bg-primary/10 p-4 rounded-full mb-4">
                           <Handshake className="h-10 w-10 text-primary" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-2">Integrity & Transparency</h3>
                        <p className="text-muted-foreground">We operate with honesty and transparency. From our pricing to our product roadmap, we believe in building trust with our clients and the community.</p>
                    </div>
                     <div className="flex flex-col items-center">
                        <div className="bg-primary/10 p-4 rounded-full mb-4">
                           <Target className="h-10 w-10 text-primary" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-2">Innovation for Simplicity</h3>
                        <p className="text-muted-foreground">We embrace cutting-edge technology, like AI, not for complexity's sake, but to create solutions that are simpler, smarter, and more efficient for our users.</p>
                    </div>
                </div>
          </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Join Us on Our Journey</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                We're always looking for passionate people to join our team and for new clients to partner with. Let's grow together.
            </p>
            <Button asChild size="lg">
                <Link href="/contact">Contact Us</Link>
            </Button>
        </div>
      </section>
    </div>
  );
}
