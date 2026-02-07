'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: 'Message sent successfully!',
      description: "We'll get back to you as soon as possible.",
    });

    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-16">
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Get in Touch
              </h1>
              <p className="text-xl text-gray-600">
                Have a project in mind? Let's discuss how we can help bring your vision to life.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card>
                <CardHeader>
                  <Mail className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle>Email Us</CardTitle>
                  <CardDescription>
                    Send us an email and we'll respond within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href="mailto:contact@neuraweb.tech"
                    className="text-blue-600 hover:underline"
                  >
                    contact@neuraweb.tech
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Phone className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle>Call Us</CardTitle>
                  <CardDescription>
                    Available Monday to Friday, 9am to 6pm GMT
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href="tel:+441234567890"
                    className="text-blue-600 hover:underline"
                  >
                    +44 123 456 7890
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <MapPin className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle>Location</CardTitle>
                  <CardDescription>
                    Serving clients worldwide
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">United Kingdom</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us about your project..."
                      rows={6}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
      <Toaster />
    </>
  );
}
