import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

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

function ProductCard({ product }: { product: Product }) {
  const mainImage =
    product.images.find((img) => img.isDefault) || product.images[0];

  return (
    <Link href={`/products/${product.id}`} className="block">
      <article className="group bg-card rounded-xl overflow-hidden border transition-colors hover:bg-accent">
        {mainImage && (
          <img
            src={mainImage.url}
            alt={product.name}
            className="w-full aspect-square object-cover"
          />
        )}
        <div className="p-4">
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-muted-foreground line-clamp-2 text-sm mb-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <p className="font-medium">
              ${parseFloat(product.price).toFixed(2)}
            </p>
            <span className="text-sm text-muted-foreground">
              {product.category_name}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

const getProducts = async () => {
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

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-16">
        <div className="container px-4">
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Our Products
            </h1>
            <p className="text-xl text-muted-foreground mb-12">
              Discover our full range of premium products designed to elevate
              your everyday experience.
            </p>

            {products.length === 0 ? (
              <div className="bg-muted/30 p-12 rounded-xl flex items-center justify-center">
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
