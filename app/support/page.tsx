"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  MessagesSquare,
  Box,
  Wrench,
  RefreshCcw,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const supportCategories = [
  {
    title: "Orders & Shipping",
    description: "Track your order or get help with shipping-related questions",
    icon: <Box className="h-4 w-4" />,
    email: "orders@arcverse.com",
    phone: "+1 (555) 123-4567",
  },
  {
    title: "Technical Support",
    description: "Get help with product setup, troubleshooting, and repairs",
    icon: <Wrench className="h-4 w-4" />,
    email: "support@arcverse.com",
    phone: "+1 (555) 234-5678",
  },
  {
    title: "Returns & Refunds",
    description: "Process returns or get information about refunds",
    icon: <RefreshCcw className="h-4 w-4" />,
    email: "returns@arcverse.com",
    phone: "+1 (555) 345-6789",
  },
  {
    title: "General Inquiries",
    description: "For all other questions and assistance",
    icon: <HelpCircle className="h-4 w-4" />,
    email: "info@arcverse.com",
    phone: "+1 (555) 456-7890",
  },
];

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-24 pb-12">
        <div className="container px-4">
          <div className="mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center">
                <ArrowLeft className="h-3 w-3 mr-1.5" />
                Back
              </Link>
            </Button>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold tracking-tight mb-2">
                Support
              </h1>
              <p className="text-sm text-muted-foreground">
                We're here to help with any questions or issues you may have.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {supportCategories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base flex items-center gap-2">
                        {category.icon}
                        {category.title}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <a
                            href={`mailto:${category.email}`}
                            className="text-primary hover:underline"
                          >
                            {category.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <a
                            href={`tel:${category.phone}`}
                            className="text-primary hover:underline"
                          >
                            {category.phone}
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    Visit Our Store
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    123 Tech Boulevard
                    <br />
                    Innovation District
                    <br />
                    San Francisco, CA 94105
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Mon - Fri: 9:00 AM - 6:00 PM PST</span>
                  </div>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    Visit Our Store
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    123 Tech Boulevard
                    <br />
                    Innovation District
                    <br />
                    San Francisco, CA 94105
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Mon - Fri: 9:00 AM - 6:00 PM PST</span>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <MessagesSquare className="h-3 w-3" />
                    Call Us
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Call with our support team for immediate assistance.
                  </p>
                  <Button size="sm" className="w-full text-xs">
                    Start Call
                  </Button>
                </div>
              </div>

              <div className="aspect-square w-full rounded-lg overflow-hidden bg-muted/30">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0673431806855!2d-122.41941638439789!3d37.77492797975927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050fa5!2sTwitter+HQ!5e0!3m2!1sen!2sus!4v1523482919565"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
