"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Heart, ShoppingBag, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setCartItems } from "@/lib/store/cartSlice";
import { setItems as setWishlistItems } from "@/lib/store/wishlistSlice";
import ARQuickLookButton from "./ar-quick-look-button";
import { toast } from "@/components/ui/use-toast";

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
  is_favourite?: number;
}

import type { User } from "@/lib/features/authSlice";

interface ProductDetailProps {
  product: Product;
  user?: User | null;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const dispatch = useDispatch();
  const userId = useSelector((state: any) => state.auth?.user?.id);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [isFavourite, setIsFavourite] = useState(product.is_favourite === 1);
  const [selectedImage, setSelectedImage] = useState(
    product.images.find((img) => img.isDefault) || product.images[0]
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.images.find((img) => img.colour_variants)?.colour_variants || null
  );
  const [quantity, setQuantity] = useState(1);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToBag = async () => {
    if (isAddingToCart) return;

    if (!userId) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsAddingToCart(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/${userId}/items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: product.id,
            quantity: quantity,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      // After successful add to cart, fetch updated cart items
      const cartResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/${userId}`
      );
      const updatedCart = await cartResponse.json();
      dispatch(setCartItems(updatedCart));

      toast({
        title: "Added to cart",
        description: "Product has been added to your cart",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (isTogglingWishlist) return;

    if (!userId) {
      toast({
        title: "Please login",
        description: "You need to be logged in to manage wishlist",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsTogglingWishlist(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wishlist/toggle`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            productId: product.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to toggle wishlist");
      }

      const result = await response.json();
      setIsFavourite(result.isWishlisted);

      // After successful toggle, fetch updated wishlist
      const wishlistResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wishlist/${userId}`
      );
      if (!wishlistResponse.ok) {
        throw new Error("Failed to fetch updated wishlist");
      }

      const updatedWishlist = await wishlistResponse.json();
      dispatch(setWishlistItems(updatedWishlist));

      toast({
        title: result.isWishlisted
          ? "Added to wishlist"
          : "Removed from wishlist",
        description: result.message,
      });
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      });
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  return (
    <section className="pt-16 pb-12">
      <div className="container px-4 max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <Link href="/products" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Products
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="sticky top-20 space-y-3">
              {/* Main Image - Made smaller */}
              <div className="aspect-square relative rounded-lg overflow-hidden  max-h-[450px]">
                <Image
                  src={selectedImage?.url || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                  priority
                />
              </div>

              {/* Thumbnail Gallery - Horizontal scroll */}
              <div className="flex gap-2  pb-2 snap-x scrollbar-hide">
                {product.images.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(image)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden bg-muted/50 
                      ${
                        selectedImage?.id === image.id
                          ? "ring-2 ring-primary"
                          : "hover:opacity-80"
                      }`}
                  >
                    <Image
                      src={image.url}
                      alt={`${product.name} view`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Category */}
            <div className="text-sm text-muted-foreground">
              {product.category_name}
            </div>

            {/* Title and Price */}
            <div>
              <h1 className="text-2xl font-semibold tracking-tight mb-2">
                {product.name}
              </h1>
              <p className="text-sm font-semibold text-primary">
                <span className="text-gray-500 text-xl">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
              </p>
            </div>

            {/* Quantity Selector - More compact */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="h-8 w-8"
                >
                  <span className="text-sm">-</span>
                </Button>
                <span className="w-8 text-center text-sm">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={increaseQuantity}
                  className="h-8 w-8"
                >
                  <span className="text-sm">+</span>
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row gap-3 pt-2">
              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToBag}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>{" "}
              <Button
                variant={isFavourite ? "secondary" : "outline"}
                size="lg"
                className={`w-full transition-colors ${
                  isTogglingWishlist ? "opacity-70" : ""
                }`}
                onClick={handleToggleWishlist}
                disabled={isTogglingWishlist}
              >
                {isTogglingWishlist ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Heart
                    className={`h-4 w-4 mr-2 transition-colors ${
                      isFavourite ? "fill-primary text-primary" : ""
                    }`}
                  />
                )}
                {isFavourite ? "Saved to Wishlist" : "Save to Wishlist"}
              </Button>
            </div>

            {/* Specifications Tabs */}
            <Tabs defaultValue="details" className="w-full pt-4">
              <TabsList className="w-full grid grid-cols-3  h-10">
                <TabsTrigger value="details" className="text-sm">
                  Details
                </TabsTrigger>
                <TabsTrigger value="specs" className="text-sm">
                  Specifications
                </TabsTrigger>
                <TabsTrigger value="shipping" className="text-sm">
                  Shipping
                </TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="pt-4 text-sm">
                <p className="text-muted-foreground">{product.description}</p>
              </TabsContent>
              <TabsContent value="specs" className="pt-4">
                <ul className="text-sm space-y-2">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <li
                        key={key}
                        className="flex items-center text-muted-foreground"
                      >
                        <span className="font-medium min-w-[120px]">
                          {key}:
                        </span>
                        <span>{value}</span>
                      </li>
                    )
                  )}
                </ul>
              </TabsContent>
              <TabsContent
                value="shipping"
                className="pt-4 text-sm text-muted-foreground"
              >
                <p className="mb-2">
                  Free standard shipping on orders over $50
                </p>
                <p>Estimated delivery: 2-4 business days</p>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
