"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  ShoppingBag,
  X,
  LogOut,
  User,
  Settings,
  Package2,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartItems } from "@/lib/store/cartSlice";
import { fetchWishlistItems } from "@/lib/store/wishlistSlice";
import type { AppDispatch, RootState } from "@/lib/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIPreferencesModal } from "@/components/ai-preferences-modal";

interface WishlistItem {
  id: number;
  userId: number;
  productId: number;
  date: string;
  productName: string;
}

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth?.user?.id);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isLoadingWishlist = useSelector(
    (state: RootState) => state.wishlist.loading
  );
  const cartItemCount = cartItems.length;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (userId && typeof userId === "number") {
      dispatch(fetchCartItems(userId));
      dispatch(fetchWishlistItems(userId));
    }
  }, [userId, dispatch]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("arcverse-theme", newTheme);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      router.push("/login");
    }
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    router.push("/login");
  };

  // Helper function to check if current path is admin route
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <>
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300",
          isScrolled || pathname !== "/"
            ? "bg-background/60 backdrop-blur-xl shadow-sm border-b border-muted/20"
            : "bg-background/60  backdrop-blur-xl "
        )}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl tracking-tighter">
            ARCVERSE
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {/* Show admin navigation only for admin users */}
            {user?.role === "admin" ? (
              <>
                <Link
                  href="/admin/users"
                  className={cn(
                    "text-sm font-medium transition-all duration-300 relative group",
                    pathname === "/admin/users"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Users
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform transition-all duration-300",
                      pathname === "/admin/users"
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    )}
                  ></span>
                  <span className="absolute inset-0 -z-10 rounded-md bg-muted/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                </Link>
                <Link
                  href="/admin/products"
                  className={cn(
                    "text-sm font-medium transition-all duration-300 relative group",
                    pathname === "/admin/products"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Products
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform transition-all duration-300",
                      pathname === "/admin/products"
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    )}
                  ></span>
                  <span className="absolute inset-0 -z-10 rounded-md bg-muted/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                </Link>
              </>
            ) : (
              // Regular user navigation
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAIModalOpen(true)}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 hover:from-purple-600 hover:to-blue-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2"
                  >
                    <path d="M12 2a10 10 0 1 0 10 10H12V2Z"/>
                    <path d="M12 12 2 22"/>
                    <path d="M12 12 2 2"/>
                  </svg>
                  AI Preferences
                </Button>
                <Link
                  href="/products"
                  className={cn(
                    "text-sm font-medium transition-all duration-300 relative group",
                    pathname === "/products"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Products
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform transition-all duration-300",
                      pathname === "/products"
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    )}
                  ></span>
                  <span className="absolute inset-0 -z-10 rounded-md bg-muted/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                </Link>
                {/* <Link
                  href="/collections"
                  className={cn(
                    "text-sm font-medium transition-all duration-300 relative group",
                    pathname === "/collections"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Collections
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform transition-all duration-300",
                      pathname === "/collections"
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    )}
                  ></span>
                  <span className="absolute inset-0 -z-10 rounded-md bg-muted/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                </Link> */}
                <Link
                  href="/stories"
                  className={cn(
                    "text-sm font-medium transition-all duration-300 relative group",
                    pathname === "/stories"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Stories
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform transition-all duration-300",
                      pathname === "/stories"
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    )}
                  ></span>
                  <span className="absolute inset-0 -z-10 rounded-md bg-muted/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                </Link>
                <Link
                  href="/support"
                  className={cn(
                    "text-sm font-medium transition-all duration-300 relative group",
                    pathname === "/support"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Support
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform transition-all duration-300",
                      pathname === "/support"
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    )}
                  ></span>
                  <span className="absolute inset-0 -z-10 rounded-md bg-muted/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="relative"
              aria-label={`Switch to ${
                theme === "dark" ? "light" : "dark"
              } mode`}
            >
              <span className="sr-only">Toggle theme</span>
              {theme === "dark" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-sun transition-transform duration-500"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-moon transition-transform duration-500"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative group">
                  <Heart className="h-5 w-5 transition-transform group-hover:scale-110" />
                  <span className="sr-only">Wishlist</span>
                  {wishlistItems.length > 0 && (
                    <Badge
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs transition-transform group-hover:scale-110"
                      variant="secondary"
                    >
                      {wishlistItems.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuGroup>
                  <div className="flex flex-col gap-2 p-4">
                    <h3 className="font-medium text-sm">My Wishlist</h3>
                    {isLoadingWishlist ? (
                      <p className="text-sm text-muted-foreground py-2">
                        Loading...
                      </p>
                    ) : wishlistItems.length > 0 ? (
                      <ScrollArea className="h-[300px]">
                        {wishlistItems.map((item) => (
                          <DropdownMenuItem key={item.id} asChild>
                            <Link
                              href={`/products/${item.productId}`}
                              className="flex items-center gap-2 py-2"
                            >
                              <Heart className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                              <span className="flex-grow truncate">
                                {item.productName}
                              </span>
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </ScrollArea>
                    ) : (
                      <p className="text-sm text-muted-foreground py-2">
                        No items in wishlist
                      </p>
                    )}
                  </div>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="relative group"
            >
              <Link href="/cart" onClick={handleCartClick}>
                <ShoppingBag className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="sr-only">Bag</span>
                {cartItemCount > 0 && (
                  <Badge
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs transition-transform group-hover:scale-110"
                    variant="destructive"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Auth buttons */}
            {user ? (
              <div className="hidden md:flex items-center space-x-1">
                {user.role === "admin" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 hover:bg-muted/50 rounded-xl"
                    asChild
                  >
                    <Link href="/admin/users">
                      <Settings className="h-4 w-4" />
                      <span className="hidden lg:inline">Admin</span>
                    </Link>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 hover:bg-muted/50 rounded-xl"
                  asChild
                >
                  <Link href="/profile">
                    <User className="h-4 w-4" />
                    <span className="hidden lg:inline">{user.name}</span>
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2 hover:bg-muted/50 rounded-xl"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden lg:inline">Logout</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  asChild
                >
                  <Link href="/orders">
                    <Package2 className="h-5 w-5" />
                    <span className="sr-only">Orders</span>
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hover:bg-muted/50 rounded-xl"
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="bg-primary/90 hover:bg-primary rounded-xl"
                >
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-lg"
        >
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl tracking-tighter">
              ARCVERSE
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <nav className="container mx-auto px-4 py-8 flex flex-col space-y-6">
            {/* Show admin navigation in mobile menu for admin users */}
            {user?.role === "admin" ? (
              <>
                <Link
                  href="/admin/users"
                  className={cn(
                    "text-lg font-medium transition-all duration-300 relative group w-fit",
                    pathname === "/admin/users"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Users
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform transition-all duration-300",
                      pathname === "/admin/users"
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    )}
                  ></span>
                </Link>
                <Link
                  href="/admin/categories"
                  className={cn(
                    "text-lg font-medium transition-all duration-300 relative group w-fit",
                    pathname === "/admin/categories"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Categories
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform transition-all duration-300",
                      pathname === "/admin/categories"
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    )}
                  ></span>
                </Link>
                <Link
                  href="/admin/products"
                  className={cn(
                    "text-lg font-medium transition-all duration-300 relative group w-fit",
                    pathname === "/admin/products"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Products
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform transition-all duration-300",
                      pathname === "/admin/products"
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    )}
                  ></span>
                </Link>
              </>
            ) : (
              // Regular mobile navigation links
              <>
                <Link
                  href="/products"
                  className={cn(
                    "text-lg font-medium transition-all duration-300 relative group w-fit",
                    pathname === "/products"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Products
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform transition-all duration-300",
                      pathname === "/products"
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    )}
                  ></span>
                </Link>
                <Link
                  href="/collections"
                  className={cn(
                    "text-lg font-medium transition-all duration-300 relative group w-fit",
                    pathname === "/collections"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Collections
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform transition-all duration-300",
                      pathname === "/collections"
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    )}
                  ></span>
                </Link>
                <Link
                  href="/stories"
                  className={cn(
                    "text-lg font-medium transition-all duration-300 relative group w-fit",
                    pathname === "/stories"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Stories
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform transition-all duration-300",
                      pathname === "/stories"
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    )}
                  ></span>
                </Link>
                <Link
                  href="/support"
                  className={cn(
                    "text-lg font-medium transition-all duration-300 relative group w-fit",
                    pathname === "/support"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Support
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform transition-all duration-300",
                      pathname === "/support"
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    )}
                  ></span>
                </Link>
                <Link
                  href="/cart"
                  className={cn(
                    "text-lg font-medium transition-all duration-300 relative group w-fit",
                    pathname === "/cart"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={(e) => {
                    handleCartClick(e);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Bag {itemCount > 0 && `(${itemCount})`}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform transition-all duration-300",
                      pathname === "/cart"
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    )}
                  ></span>
                </Link>
              </>
            )}{" "}
            {/* Auth links for mobile */}
            {user ? (
              <>
                <Link
                  href="/profile"
                  className={cn(
                    "text-lg font-medium transition-all duration-300 relative group w-fit flex items-center gap-2",
                    pathname === "/profile"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  Profile
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform transition-all duration-300",
                      pathname === "/profile"
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    )}
                  ></span>
                </Link>
                <Link
                  href="/wishlist"
                  className={cn(
                    "text-lg font-medium transition-all duration-300 relative group w-fit flex items-center gap-2",
                    pathname === "/wishlist"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Heart className="h-5 w-5" />
                  Wishlist
                  {wishlistItems.length > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {wishlistItems.length}
                    </Badge>
                  )}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform transition-all duration-300",
                      pathname === "/wishlist"
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    )}
                  ></span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-lg font-medium transition-all duration-300 relative group w-fit text-muted-foreground hover:text-foreground flex items-center gap-2"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform transition-all duration-300 scale-x-0 group-hover:scale-x-100"></span>
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-4 pt-4">
                <Button
                  asChild
                  className="w-full rounded-xl bg-primary/90 hover:bg-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href="/signup">Sign Up</Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="w-full rounded-xl"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            )}
            <div className="flex items-center space-x-4 pt-4">
              <Button
                variant="outline"
                onClick={toggleTheme}
                className="flex items-center gap-2 transition-colors duration-300 rounded-xl"
              >
                {theme === "dark" ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-sun transition-transform duration-500"
                    >
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v2" />
                      <path d="M12 20v2" />
                      <path d="m4.93 4.93 1.41 1.41" />
                      <path d="m17.66 17.66 1.41 1.41" />
                      <path d="M2 12h2" />
                      <path d="M20 12h2" />
                      <path d="m6.34 17.66-1.41 1.41" />
                      <path d="m19.07 4.93-1.41 1.41" />
                    </svg>
                    Light Mode
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-moon transition-transform duration-500"
                    >
                      <path d="M12 3a6 6 0 0 0 9 9 9 0 1 1-9-9Z" />
                    </svg>
                    Dark Mode
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 rounded-xl"
              >
                <Search className="h-5 w-5" />
                Search
              </Button>
            </div>
          </nav>
        </motion.div>
      )}
      <AIPreferencesModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
      />
    </>
  );
}
