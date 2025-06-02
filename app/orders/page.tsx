"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package2 } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  name: string;
  price: string | number;
  description: string;
  imageUrl?: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const userId = useSelector((state: any) => state.auth?.user?.id);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/cart/orders/${userId}`
        );
        const data = await response.json();

        if (response.ok) {
          setOrders(data);
        } else {
          throw new Error(data.message || "Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Error",
          description: "Failed to fetch orders",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [userId, toast]);

  if (!userId) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-32 pb-24">
          <div className="container px-4 max-w-6xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6">Please Login</h1>
            <p className="text-muted-foreground mb-8">
              You need to be logged in to view your orders.
            </p>
            <Button
              onClick={() => router.push("/login")}
              size="lg"
              className="rounded-full px-8"
            >
              Login
            </Button>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-24">Loading...</div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-24">
        <div className="container px-4 max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-12">
            My Orders
          </h1>

          {!orders.length ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted/30 mb-6">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-medium mb-3">No orders yet</h2>
              <p className="text-muted-foreground mb-10 max-w-md mx-auto">
                Looks like you haven't placed any orders yet. Start exploring our
                collection.
              </p>
              <Button
                onClick={() => router.push("/products")}
                size="lg"
                className="rounded-full px-8"
              >
                Start Shopping
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-8">
              <AnimatePresence>
                {orders.map((order) => (
                  <motion.div
                    key={`${order.productId}-${order.id}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-b border-muted pb-8"
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                      <div className="relative w-full sm:w-32 aspect-square rounded-xl overflow-hidden bg-muted/30">
                        <Image
                          src={order.imageUrl || "/placeholder.svg"}
                          alt={order.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-lg">{order.name}</h3>
                          <div className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary text-sm">
                            <Package2 className="h-3 w-3 mr-1" />
                            Ordered
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {order.description}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-4">
                          <div className="text-sm text-muted-foreground">
                            Quantity: {order.quantity}
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              $
                              {(
                                Number(
                                  typeof order.price === "string"
                                    ? order.price.replace(/[^0-9.]/g, "")
                                    : order.price
                                ) * order.quantity
                              ).toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              $
                              {Number(
                                typeof order.price === "string"
                                  ? order.price.replace(/[^0-9.]/g, "")
                                  : order.price
                              ).toFixed(2)}{" "}
                              each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}