"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CreditCard, Lock } from "lucide-react"

const paymentFormSchema = z.object({
  cardNumber: z.string().min(16, "Card number must be at least 16 digits"),
  expiryDate: z.string().min(5, "Expiry date must be in MM/YY format"),
  cvv: z.string().min(3, "CVV must be at least 3 digits"),
  nameOnCard: z.string().min(2, "Name must be at least 2 characters"),
})

type PaymentFormValues = z.infer<typeof paymentFormSchema>

interface PaymentFormProps {
  onSubmit: (data: PaymentFormValues) => void
  defaultValues?: Partial<PaymentFormValues>
  isSubmitting: boolean
  onBack: () => void
}

export default function PaymentForm({ onSubmit, defaultValues, isSubmitting, onBack }: PaymentFormProps) {
  const [focused, setFocused] = useState<string | null>(null)

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: defaultValues || {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      nameOnCard: "",
    },
  })

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Format expiry date as MM/YY
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return value
  }

  return (
    <div className="bg-muted/20 rounded-2xl p-8">
      <h2 className="text-xl font-semibold mb-6">Payment Information</h2>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center text-sm text-muted-foreground">
          <Lock className="h-4 w-4 mr-2" />
          Secure Payment
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-10 bg-muted rounded"></div>
          <div className="h-6 w-10 bg-muted rounded"></div>
          <div className="h-6 w-10 bg-muted rounded"></div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="nameOnCard"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name on Card</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    className={`h-12 rounded-lg ${focused === "nameOnCard" ? "border-primary" : ""}`}
                    onFocus={() => setFocused("nameOnCard")}
                    onBlur={() => setFocused(null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cardNumber"
            render={({ field: { onChange, ...rest } }) => (
              <FormItem>
                <FormLabel>Card Number</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="1234 5678 9012 3456"
                      {...rest}
                      onChange={(e) => onChange(formatCardNumber(e.target.value))}
                      className={`h-12 rounded-lg pl-12 ${focused === "cardNumber" ? "border-primary" : ""}`}
                      onFocus={() => setFocused("cardNumber")}
                      onBlur={() => setFocused(null)}
                      maxLength={19}
                    />
                    <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field: { onChange, ...rest } }) => (
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="MM/YY"
                      {...rest}
                      onChange={(e) => onChange(formatExpiryDate(e.target.value))}
                      className={`h-12 rounded-lg ${focused === "expiryDate" ? "border-primary" : ""}`}
                      onFocus={() => setFocused("expiryDate")}
                      onBlur={() => setFocused(null)}
                      maxLength={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cvv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CVV</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123"
                      {...field}
                      className={`h-12 rounded-lg ${focused === "cvv" ? "border-primary" : ""}`}
                      onFocus={() => setFocused("cvv")}
                      onBlur={() => setFocused(null)}
                      maxLength={4}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-full text-base font-medium flex-1"
              onClick={onBack}
              disabled={isSubmitting}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button type="submit" className="h-12 rounded-full text-base font-medium flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Place Order"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
