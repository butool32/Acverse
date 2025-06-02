"use client"

import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import type { CartItem } from "@/lib/cart-context"

interface CheckoutSummaryProps {
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  currentStep: number
}

export default function CheckoutSummary({ items, subtotal, tax, total, currentStep }: CheckoutSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-muted/20 rounded-2xl p-8 sticky top-24"
    >
      <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

      <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted/30 flex-shrink-0">
              <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{item.name}</h3>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                <span className="text-sm font-medium">
                  ${Number.parseFloat(item.price.replace(/[^0-9.]/g, "")).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-6" />

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>Free</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Estimated Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="flex justify-between font-semibold text-lg mb-6">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <div className="text-xs text-muted-foreground mt-6">
        {currentStep === 1 ? (
          <p>Please complete your billing information to proceed to payment.</p>
        ) : (
          <p>Your payment information is encrypted and secure. We never store your full card details.</p>
        )}
      </div>
    </motion.div>
  )
}
