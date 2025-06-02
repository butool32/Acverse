"use client"

import { useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion, useInView } from "framer-motion"
import { ArrowRight, View } from "lucide-react"

export default function ProductShowcase() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-24 overflow-hidden">
      <div className="container px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Introducing ARC Vision Pro</h2>
            <p className="text-muted-foreground mb-6">
              Experience digital content like never before with our most advanced mixed reality device. ARC Vision Pro
              seamlessly blends digital content with your physical space, creating unlimited possibilities for work,
              entertainment, and connection.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="mr-2 text-primary">•</span>
                <span>Revolutionary spatial computing platform</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">•</span>
                <span>Ultra-high resolution display system</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">•</span>
                <span>Advanced eye tracking and gesture control</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">•</span>
                <span>All-day battery life with external power pack</span>
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="rounded-full px-8">
                Pre-order Now
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-8 group">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted/50">
              <Image
                src="/placeholder.svg?height=800&width=800&query=futuristic VR headset on gradient background"
                alt="ARC Vision Pro"
                fill
                className="object-cover"
              />
              <Button
                variant="secondary"
                size="lg"
                className="absolute bottom-6 right-6 rounded-full bg-background/80 backdrop-blur-sm"
              >
                <View className="h-5 w-5 mr-2" />
                View in AR
              </Button>
            </div>

            <div className="absolute -bottom-6 -right-6 -left-6 h-12 bg-gradient-to-t from-background to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
