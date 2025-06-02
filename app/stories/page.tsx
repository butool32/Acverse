"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const stories = [
  {
    category: "Innovation",
    title: "The Birth of ARC Vision Pro",
    description:
      "How we revolutionized mixed reality with our most ambitious project yet",
    image: "/sleek-vr-headset.png",
    date: "May 2025",
    readTime: "5 min read",
  },
  {
    category: "Design Story",
    title: "Crafting the Perfect Sound",
    description: "The journey behind our award-winning ARC Headphones Pro",
    image: "/premium-headphones-white.png",
    date: "April 2025",
    readTime: "4 min read",
  },
  {
    category: "Customer Story",
    title: "Gaming Without Limits",
    description:
      "How professional gamers are using ARC devices to transform their experience",
    image: "/sleek-tech-display.png",
    date: "March 2025",
    readTime: "3 min read",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Creative Director",
    company: "Design Studios Co.",
    quote:
      "ARC products have completely transformed how we approach creative work. The AR capabilities are simply mind-blowing.",
    image: "/placeholder-user.jpg",
  },
  {
    name: "James Rodriguez",
    role: "Professional Gamer",
    company: "Team Epsilon",
    quote:
      "The response time and clarity of ARC displays give us a competitive edge we've never had before.",
    image: "/placeholder-user.jpg",
  },
  {
    name: "Dr. Emily Watson",
    role: "Research Lead",
    company: "Future Tech Institute",
    quote:
      "The precision and reliability of ARC devices make them invaluable tools in our research work.",
    image: "/placeholder-user.jpg",
  },
];

export default function StoriesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-16">
        <div className="container px-4">
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Our Stories
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover the inspiration, innovation, and impact behind our
                products and community.
              </p>
            </div>

            {/* Featured Story */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-[21/9] mb-16 rounded-2xl overflow-hidden group"
            >
              <Image
                src="/sleek-device-reveal.png"
                alt="Featured Story"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/90 text-xs font-medium mb-4">
                  Featured Story
                </span>
                <h2 className="text-3xl font-bold mb-2">
                  Redefining Reality: The Future of AR
                </h2>
                <p className="text-white/90 max-w-2xl mb-4">
                  Take a deep dive into how ARC is pushing the boundaries of
                  augmented reality and shaping the future of human-computer
                  interaction.
                </p>
                <Button variant="secondary" size="sm" className="group">
                  Read More{" "}
                  <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </div>
            </motion.div>

            {/* Latest Stories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {stories.map((story, index) => (
                <motion.div
                  key={story.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden border-0 bg-card transition-shadow hover:shadow-lg">
                    <CardContent className="p-0">
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={story.image}
                          alt={story.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <span className="text-xs font-medium text-primary">
                          {story.category}
                        </span>
                        <h3 className="text-xl font-semibold mt-2 mb-2">
                          {story.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {story.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{story.date}</span>
                          <span>{story.readTime}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="bg-muted/30 rounded-2xl p-8 mb-16">
              <h2 className="text-2xl font-bold text-center mb-8">
                Customer Stories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-background p-6 rounded-xl"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{testimonial.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {testimonial.role} at {testimonial.company}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground italic">
                      "{testimonial.quote}"
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
              <p className="text-muted-foreground mb-6">
                Subscribe to our newsletter to receive the latest stories and
                updates.
              </p>
              <div className="flex gap-4 justify-center">
                <Button>Subscribe to Newsletter</Button>
                <Button variant="outline">Follow us on Twitter</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
