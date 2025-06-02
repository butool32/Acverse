"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "@/lib/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import CartItem from "@/components/cart-item";
import { markCartItemsAsOrdered } from "@/lib/store/cartSlice";
import { useToast } from "@/components/ui/use-toast";

export default function CartPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: any) => state.auth?.user?.id);
  const cartItems = useSelector((state: any) => state.cart?.items || []);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Calculate totals from cart items
  const subtotal = Array.isArray(cartItems)
    ? cartItems.reduce((acc: number, item: any) => {
        const price =
          typeof item.price === "string"
            ? parseFloat(item.price.replace(/[^0-9.]/g, ""))
            : typeof item.price === "number"
            ? item.price
            : 0;
        return acc + price * (item.quantity || 1);
      }, 0)
    : 0;

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) return;
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/cart/${userId}`
        );
        const data = await response.json();

        if (response.ok) {
          dispatch({ type: "cart/setCartItems", payload: data });
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [userId, dispatch]);

  const handleCheckout = async () => {
    if (!userId) {
      toast({
        title: "Please login",
        description: "You need to be logged in to checkout",
        variant: "destructive",
      });
      return;
    }

    if (!cartItems.length) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingOut(true);
    try {
      // Get cart IDs for marking as ordered
      // Using the correct field from cart items
      const cartIds = cartItems.map((item: any) => item.id);

      if (!cartIds.some((id: number) => id)) {
        throw new Error("Invalid cart items");
      }

      // Mark cart items as ordered
      await dispatch(markCartItemsAsOrdered(cartIds.filter(Boolean))).unwrap();

      // Store order info for success page
      sessionStorage.setItem(
        "arcverse-order",
        JSON.stringify({
          orderId: Math.floor(100000 + Math.random() * 900000).toString(),
          date: new Date().toISOString(),
          total: total,
          items: cartItems.map((item: any) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        })
      );

      // Clear cart in redux store
      dispatch({ type: "cart/clearCart" });

      // Navigate to success page
      router.push("/checkout/success");
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process checkout",
        variant: "destructive",
      });
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background pt-32">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-24">
        <div className="container px-4 max-w-6xl mx-auto">
          <div className="mb-12">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="mb-4 hover:bg-transparent hover:text-primary"
            >
              <Link href="/" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Your Bag
            </h1>
          </div>

          {!cartItems.length ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted/30 mb-6">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-medium mb-3">Your bag is empty</h2>
              <p className="text-muted-foreground mb-10 max-w-md mx-auto">
                Looks like you haven't added any products to your bag yet. Start
                exploring our premium collection.
              </p>
              <Button asChild size="lg" className="rounded-full px-8 group">
                <Link href="/products" className="flex items-center">
                  Start Shopping
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <div className="space-y-8">
                  <AnimatePresence>
                    {console.log("cartItems", cartItems)}
                    {cartItems.map((item: any) => (
                      <CartItem
                        key={item.id}
                        item={{
                          ...item,
                          image:
                            item.ProductImages?.[0]?.url || "/placeholder.svg",
                          category: item.category_name || "Product",
                        }}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-muted/20 rounded-2xl p-8 sticky top-24"
                >
                  <h2 className="text-xl font-semibold mb-6">Summary</h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Estimated Tax
                      </span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  </div>
                  <Separator className="my-6" />
                  <div className="flex justify-between font-semibold text-lg mb-8">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <Button
                    className="w-full rounded-full h-12 text-base font-medium"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                  </Button>
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => dispatch({ type: "cart/clearCart" })}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      disabled={isCheckingOut}
                    >
                      Clear Bag
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
