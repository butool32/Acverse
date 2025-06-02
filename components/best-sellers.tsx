"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import ARQuickLookButton from "./ar-quick-look-button";
import { useToast } from "@/components/ui/use-toast";

interface ProductImage {
  id: number;
  url: string;
  isDefault: number;
  colour_variants: string | null;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  CategoryId: number;
  category_name: string;
  images: ProductImage[];
  hasAR?: boolean;
}

export default function BestSellers() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        // Get only the first 6 products for best sellers
        setProducts(data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to fetch best sellers",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount =
        direction === "left"
          ? -current.clientWidth * 0.75
          : current.clientWidth * 0.75;

      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <section className="py-24 bg-muted/30">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Best Sellers
              </h2>
              <p className="text-muted-foreground mt-2">Loading products...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Best Sellers</h2>
            <p className="text-muted-foreground mt-2">
              Our most popular products this season
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Scroll left</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Scroll right</span>
            </Button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-6 pb-6"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="min-w-[280px] sm:min-w-[340px] snap-start"
            >
              <Link href={`/products/${product.id}`}>
                <Card className="overflow-hidden border-0 bg-background shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div className="relative aspect-square bg-muted/50">
                      <Image
                        src={
                          product.images?.find((img) => img.isDefault)?.url ||
                          product.images?.[0]?.url ||
                          "/placeholder.svg"
                        }
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="inline-block bg-background/80 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full">
                          {product.category_name}
                        </span>
                      </div>
                      {product.hasAR && (
                        <div className="absolute bottom-4 right-4">
                          <ARQuickLookButton
                            size="sm"
                            isInsideLink={true}
                            modelUrl={getModelUrlForProduct(product.id)}
                          />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-medium text-lg">{product.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold">
                          ${Number(product.price).toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full hover:bg-primary hover:text-primary-foreground"
                        >
                          Add to Bag
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Helper function to get the appropriate model URL based on product ID
function getModelUrlForProduct(productId: number): string {
  // Default to iPad Pro model
  const defaultModel =
    "https://www.apple.com/105/media/us/ipad-pro/2020/79fd9e34-5115-4ea4-b8d6-41f4ef1cf3e2/anim/ar/ipad_pro_space_gray_usdz.usdz";
  return defaultModel;
}
