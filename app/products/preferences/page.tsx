"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import ProductGrid from "@/components/product-grid";
import type { Product } from "@/lib/products";

export default function PreferencesPage() {
  const searchParams = useSearchParams();
  const categories = searchParams.get("categories");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const categoryIds = categories?.split(",").map(Number) || [];
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/filter-by-categories`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ categories: categoryIds }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching filtered products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categories]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <p className="text-red-500">{error}</p>
          <Button asChild>
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">AI Curated Products</h1>
          <p className="text-muted-foreground mt-2">
            Products tailored to your selected preferences
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/products">View All Products</Link>
        </Button>
      </div>
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <p className="text-lg text-muted-foreground">
            No products found for your selected preferences.
          </p>
          <Button asChild>
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
