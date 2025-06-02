"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { CheckCircle2, Package } from "lucide-react"
import Confetti from "@/components/confetti"

interface OrderDetails {
  orderId: string
  date: string
  total: number
}

export default function OrderSuccessPage() {
  const router = useRouter()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Get order details from session storage
    const storedOrder = sessionStorage.getItem("arcverse-order")

    if (!storedOrder) {
      // If no order details, redirect to home
      router.push("/")
      return
    }

    try {
      const parsedOrder = JSON.parse(storedOrder)
      setOrderDetails({
        orderId: parsedOrder.orderId,
        date: new Date(parsedOrder.date).toLocaleDateString(),
        total: parsedOrder.total,
      })

      // Trigger confetti after a short delay
      setTimeout(() => {
        setShowConfetti(true)
      }, 500)
    } catch (error) {
      console.error("Failed to parse order details:", error)
      router.push("/")
    }
  }, [router])

  if (!orderDetails) {
    return null // Or a loading state
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      {showConfetti && <Confetti />}

      <section className="pt-32 pb-24">
        <div className="container px-4 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: 0.2,
            }}
            className="mb-8 inline-flex"
          >
            <CheckCircle2 className="h-24 w-24 text-green-500" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Thank you for your purchase!</h1>
            <p className="text-xl text-muted-foreground mb-8">Your order has been received and is being processed.</p>

            <div className="bg-muted/20 rounded-2xl p-8 mb-12">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div className="flex items-center mb-4 md:mb-0">
                  <Package className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="text-lg font-medium">Order #{orderDetails.orderId}</span>
                </div>
                <div className="text-muted-foreground">{orderDetails.date}</div>
              </div>

              <div className="flex justify-between items-center border-t border-muted pt-6">
                <span className="font-medium">Total</span>
                <span className="font-bold text-lg">${orderDetails.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/">Continue Shopping</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link href="/support">Track Order</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
