"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import CheckoutSummary from "@/components/checkout-summary"
import BillingForm from "@/components/checkout-billing-form"
import PaymentForm from "@/components/checkout-payment-form"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useCart } from "@/lib/cart-context"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
  })
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  })

  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax

  const handleBillingSubmit = (data: typeof billingInfo) => {
    setBillingInfo(data)
    setCurrentStep(2)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handlePaymentSubmit = (data: typeof paymentInfo) => {
    setPaymentInfo(data)
    handlePlaceOrder()
  }

  const handlePlaceOrder = async () => {
    setIsSubmitting(true)

    // Generate a random order ID
    const orderId = Math.floor(100000 + Math.random() * 900000).toString()

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Store order details in session storage for the success page
    sessionStorage.setItem(
      "arcverse-order",
      JSON.stringify({
        orderId,
        items,
        billingInfo,
        total,
        date: new Date().toISOString(),
      }),
    )

    // Clear the cart
    clearCart()

    // Redirect to success page
    router.push("/checkout/success")
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-24">
        <div className="container px-4 max-w-6xl mx-auto">
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild className="mb-4 hover:bg-transparent hover:text-primary">
              <Link href="/cart" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Link>
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="space-y-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: currentStep === 1 ? 1 : 0, y: currentStep === 1 ? 0 : -20 }}
                  transition={{ duration: 0.5 }}
                  className={`${currentStep !== 1 ? "hidden" : ""}`}
                >
                  <BillingForm onSubmit={handleBillingSubmit} defaultValues={billingInfo} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: currentStep === 2 ? 1 : 0, y: currentStep === 2 ? 0 : 20 }}
                  transition={{ duration: 0.5 }}
                  className={`${currentStep !== 2 ? "hidden" : ""}`}
                >
                  <PaymentForm
                    onSubmit={handlePaymentSubmit}
                    defaultValues={paymentInfo}
                    isSubmitting={isSubmitting}
                    onBack={() => setCurrentStep(1)}
                  />
                </motion.div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <CheckoutSummary items={items} subtotal={subtotal} tax={tax} total={total} currentStep={currentStep} />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
