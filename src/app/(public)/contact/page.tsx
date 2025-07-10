
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you would handle form submission here (e.g., send to an API)
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you shortly.",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="bg-background">
      <section className="py-16 md:py-24 text-center bg-muted/30">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
            Get In Touch
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground">
            Have questions about pricing, features, or anything else? Our team is ready to answer all your questions.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" required rows={5} />
                </div>
                <Button type="submit" className="w-full">Submit</Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Contact Information</h2>
            <p className="text-muted-foreground">
                Prefer to reach out directly? Here’s how you can find us. We're available during standard business hours, Monday to Friday.
            </p>
            <div className="space-y-4 text-lg">
                <div className="flex items-center gap-4">
                    <Mail className="h-6 w-6 text-primary" />
                    <a href="mailto:support@gramstogains.com" className="hover:text-primary">support@gramstogains.com</a>
                </div>
                <div className="flex items-center gap-4">
                    <Phone className="h-6 w-6 text-primary" />
                    <a href="tel:+15551234567" className="hover:text-primary">(555) 123-4567</a>
                </div>
                <div className="flex items-center gap-4">
                    <MapPin className="h-6 w-6 text-primary" />
                    <span>123 Tech Way, Denver, CO 80202</span>
                </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
