"use client";

import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductDetail from "@/components/product-detail";
import RelatedProducts from "@/components/related-products";
import { Loader2 } from "lucide-react";

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
  specifications: Record<string, string>;
  category_name: string;
  category_description: string;
  images: ProductImage[];
}

const getProduct = async (id: number, userId?: string | number | null) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}?userId=${
        userId || ""
      }`,
      {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        next: {
          revalidate: 0, // Disable caching
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Product not found");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

// Add function to fetch all products
const getAllProducts = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import type { RootState } from "@/lib/store";

export default function ProductPage({ params }: { params: { id: string } }) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [productData, productsData] = await Promise.all([
        getProduct(Number.parseInt(params.id), user?.id),
        getAllProducts(),
      ]);
      setProduct(productData);
      setAllProducts(productsData);
      setIsLoading(false);
    };
    fetchData();
  }, [params.id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-32">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <ProductDetail product={product} />
      <RelatedProducts currentProductId={product.id} products={allProducts} />
      <Footer />
    </main>
  );
}
