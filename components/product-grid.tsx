"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useInView } from "framer-motion";
import ARQuickLookButton from "./ar-quick-look-button";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingBag } from "lucide-react";

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

export default function ProductGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        console.log(data);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products");
        toast({
          title: "Error",
          description: "Failed to fetch products",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (isLoading) {
    return (
      <section className="py-24">
        <div className="container px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/30 mb-4">
                <ShoppingBag className="h-8 w-8 text-muted-foreground animate-pulse" />
              </div>
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || products.length === 0) {
    return (
      <section className="py-24">
        <div className="container px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/30 mb-4">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No Products Found</h3>
              <p className="text-muted-foreground mb-6">
                {error || "There are no products available at the moment."}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Explore Our Products
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our full range of premium products designed to elevate your
            everyday experience.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <Link href={`/products/${product.id}`}>
                <Card className="overflow-hidden border-0 bg-background shadow-sm hover:shadow-md transition-shadow duration-300">
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
        </motion.div>
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
