import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import BestSellers from "@/components/best-sellers";
import Features from "@/components/features";
import ProductGrid from "@/components/product-grid";
import Footer from "@/components/footer";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Suspense
        fallback={
          <div className="h-[50vh] flex items-center justify-center">
            Loading best sellers...
          </div>
        }
      >
        <BestSellers />
      </Suspense>
      <Features />
      <Suspense
        fallback={
          <div className="h-[50vh] flex items-center justify-center">
            Loading products...
          </div>
        }
      >
        <ProductGrid />
      </Suspense>
      <Footer />
    </main>
  );
}
