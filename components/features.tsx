"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { CuboidIcon as Cube, Shield, Zap } from "lucide-react"

const features = [
  {
    icon: <Cube className="h-10 w-10" />,
    title: "Precision Engineering",
    description:
      "Every product is crafted with meticulous attention to detail, using only the finest materials available.",
  },
  {
    icon: <Zap className="h-10 w-10" />,
    title: "Cutting-Edge Technology",
    description: "Our devices incorporate the latest advancements in technology, providing unparalleled performance.",
  },
  {
    icon: <Shield className="h-10 w-10" />,
    title: "Lifetime Warranty",
    description: "We stand behind our products with confidence, offering comprehensive protection for your investment.",
  },
]

export default function Features() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <section className="py-24">
      <div className="container px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Uncompromising Excellence</h2>
          <p className="text-muted-foreground">
            At ARCVERSE, we're committed to creating products that redefine what's possible. Our dedication to quality
            and innovation is evident in everything we do.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-muted/30"
            >
              <div className="mb-4 p-3 rounded-full bg-primary/10 text-primary">{feature.icon}</div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
