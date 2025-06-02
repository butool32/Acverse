"use client";

import { useState, useEffect } from "react";
import AdminLayout from "../components/admin-layout";
import DashboardLayout from "../components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InputField } from "@/components/ui/input-field";
import { toast } from "@/components/ui/use-toast";
import { Upload, Pencil, Trash2, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as DialogPrimitive from "@radix-ui/react-dialog";

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
  createdAt: string;
  updatedAt: string;
  CategoryId: number;
  specifications: Record<string, string>;
  category_name: string;
  category_description: string;
  images: ProductImage[];
}

interface ColorVariant {
  color: string;
  images: string[];
  imageIndices?: number[];
}

interface Category {
  id: number;
  name: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    mainImage: null as File | null,
    images: [] as File[],
  });

  const [specifications, setSpecifications] = useState<
    Array<{ key: string; value: string }>
  >([]);
  const [colorVariants, setColorVariants] = useState<
    Array<{ color: string; images: File[] }>
  >([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("arcverse-token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("arcverse-token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    }
  };

  const handleAddSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const handleRemoveSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleSpecificationChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  const handleColorVariantChange = (
    index: number,
    field: "color",
    value: string
  ) => {
    const newVariants = [...colorVariants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setColorVariants(newVariants);
  };

  const handleColorImagesChange = (index: number, files: FileList | null) => {
    if (!files) return;

    const newVariants = [...colorVariants];
    const selectedFiles = Array.from(files).slice(0, 3); // Limit to 3 images
    newVariants[index] = { ...newVariants[index], images: selectedFiles };
    setColorVariants(newVariants);
  };

  const handleAddColorVariant = () => {
    setColorVariants([...colorVariants, { color: "", images: [] }]);
  };

  const handleRemoveColorVariant = (index: number) => {
    setColorVariants(colorVariants.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setNewProduct({
        ...newProduct,
        mainImage: files[0],
        images: files,
      });
      setImagePreview(URL.createObjectURL(files[0]));
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/uploads/single`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleMultipleImageUpload = async (
    files: File[]
  ): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/uploads/multiple`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload images");
      }

      const data = await response.json();
      return data.urls;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // First upload main image
      let mainImageUrl = "";
      if (newProduct.mainImage) {
        mainImageUrl = await handleImageUpload(newProduct.mainImage);
      }

      // Upload color variant images
      const variantsWithUrls = await Promise.all(
        colorVariants.map(async (variant) => {
          if (variant.images?.length > 0) {
            const urls = await handleMultipleImageUpload(variant.images);
            return {
              color: variant.color,
              images: urls,
            };
          }
          return variant;
        })
      );

      // Create product with image URLs
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        categoryId: parseInt(newProduct.categoryId),
        specifications: specifications.reduce((acc, spec) => {
          if (spec.key && spec.value) acc[spec.key] = spec.value;
          return acc;
        }, {} as Record<string, string>),
        mainImage: mainImageUrl,
        colorVariants: variantsWithUrls,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("arcverse-token")}`,
          },
          body: JSON.stringify(productData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      toast({
        title: "Success",
        description: "Product created successfully",
      });

      // Reset form
      setNewProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
        mainImage: null,
        images: [],
      });
      setSpecifications([]);
      setColorVariants([]);
      setImagePreview(null);

      // Refresh products list
      fetchProducts();
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("arcverse-token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete product");

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">Products</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add Product</Button>
              </DialogTrigger>
              <DialogContent className="max-w-[600px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Product</DialogTitle>
                </DialogHeader>
                <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
                <form onSubmit={handleCreateProduct} className="space-y-4">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <InputField
                      id="product-name"
                      label="Name"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        id="product-price"
                        label="Price"
                        type="number"
                        value={newProduct.price}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            price: e.target.value,
                          })
                        }
                        required
                      />
                      <InputField
                        id="product-stock"
                        label="Stock"
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            stock: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <textarea
                        id="product-description"
                        value={newProduct.description}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            description: e.target.value,
                          })
                        }
                        className="w-full h-20 px-3 py-2 border rounded-md resize-none"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <select
                        value={newProduct.categoryId}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            categoryId: e.target.value,
                          })
                        }
                        className="w-full h-10 px-3 border rounded-md"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Main Image */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Main Image</label>
                    <div className="flex gap-4 items-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="flex-1 px-3 py-2 border rounded-md text-sm"
                        required
                      />
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">
                        Specifications
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddSpecification}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {specifications.map((spec, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input
                            placeholder="Key"
                            value={spec.key}
                            onChange={(e) =>
                              handleSpecificationChange(
                                index,
                                "key",
                                e.target.value
                              )
                            }
                            className="flex-1 h-8 px-2 border rounded-md text-sm"
                          />
                          <input
                            placeholder="Value"
                            value={spec.value}
                            onChange={(e) =>
                              handleSpecificationChange(
                                index,
                                "value",
                                e.target.value
                              )
                            }
                            className="flex-1 h-8 px-2 border rounded-md text-sm"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveSpecification(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Color Variants */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">
                        Color Variants
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddColorVariant}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {colorVariants.map((variant, index) => (
                        <div
                          key={index}
                          className="flex gap-2 items-center p-2 border rounded-md"
                        >
                          <input
                            type="color"
                            value={variant.color || "#000000"}
                            onChange={(e) =>
                              handleColorVariantChange(
                                index,
                                "color",
                                e.target.value
                              )
                            }
                            className="w-8 h-8"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) =>
                              handleColorImagesChange(index, e.target.files)
                            }
                            className="flex-1 text-sm"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveColorVariant(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Create Product
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="border rounded-lg overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Images</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                  <TableHead className="font-semibold">Price</TableHead>
                  <TableHead className="font-semibold">Stock</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">
                    Specifications
                  </TableHead>
                  <TableHead className="font-semibold w-32">Created</TableHead>
                  <TableHead className="font-semibold w-40 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow
                    key={product.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex gap-2">
                        {product.images.map((image) => (
                          <div key={image.id} className="relative">
                            <img
                              src={image.url}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-md border border-border"
                            />
                            {image.colour_variants && (
                              <div
                                className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                                style={{
                                  backgroundColor: image.colour_variants,
                                }}
                                title={`Color: ${image.colour_variants}`}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell className=" max-w-[200px] truncate">
                      {product.description || "—"}
                    </TableCell>
                    <TableCell className="">
                      ${parseFloat(product.price).toFixed(2)}
                    </TableCell>
                    <TableCell className="">{product.stock}</TableCell>
                    <TableCell className="">{product.category_name}</TableCell>
                    <TableCell>
                      <div className="max-w-[200px] text-sm ">
                        {Object.entries(product.specifications).map(
                          ([key, value], index, arr) => (
                            <span className="flex flex-col" key={key}>
                              {key}: {value}
                              {index < arr.length - 1 ? ", " : ""}
                            </span>
                          )
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="">
                      {new Date(product.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="hover:bg-destructive/10 border hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DashboardLayout>
    </AdminLayout>
  );
}
