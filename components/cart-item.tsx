"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { updateCartItem, removeFromCart } from "@/lib/store/cartSlice";
import { useToast } from "@/components/ui/use-toast";
import type { CartItem as CartItemType } from "@/lib/cart-context";

export default function CartItem({ item }: { item: CartItemType }) {
  const dispatch = useDispatch();
  const userId = useSelector((state: any) => state.auth.user?.id);
  const [isRemoving, setIsRemoving] = useState(false);
  const { toast } = useToast();

  const itemPrice =
    typeof item.price === "string"
      ? parseFloat(item.price.replace(/[^0-9.]/g, ""))
      : typeof item.price === "number"
      ? item.price
      : 0;
  const itemTotal = itemPrice * (item.quantity || 1);

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Please log in to update your cart",
        variant: "destructive",
      });
      return;
    }

    try {
      await dispatch(
        updateCartItem({
          userId,
          cartId: item.id,
          quantity: newQuantity,
        })
      ).unwrap();

      toast({
        title: "Success",
        description: "Cart updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive",
      });
    }
  };

  const handleRemove = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Please log in to remove items",
        variant: "destructive",
      });
      return;
    }

    setIsRemoving(true);
    try {
      await dispatch(
        removeFromCart({
          userId,
          productId: item.productId,
        })
      ).unwrap();

      toast({
        title: "Success",
        description: "Item removed from cart",
      });
    } catch (error) {
      setIsRemoving(false);
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className={`border-b border-muted pb-8 ${isRemoving ? "opacity-50" : ""}`}
    >
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <div className="relative w-full sm:w-32 aspect-square rounded-xl overflow-hidden bg-muted/30">
          <Image
            src={item.imageUrl || "/placeholder.svg"}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-lg">{item.name}</h3>
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 disabled:opacity-50"
              aria-label="Remove item"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-sm text-muted-foreground">{item.category}</p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-4">
            <div className="flex items-center border border-muted rounded-full">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-transparent hover:text-primary"
                onClick={() => handleUpdateQuantity(item.quantity - 1)}
                disabled={item.quantity <= 1 || isRemoving}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{item.quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-transparent hover:text-primary"
                onClick={() => handleUpdateQuantity(item.quantity + 1)}
                disabled={isRemoving}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-right">
              <p className="font-medium">${itemTotal.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">
                ${itemPrice.toFixed(2)} each
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
