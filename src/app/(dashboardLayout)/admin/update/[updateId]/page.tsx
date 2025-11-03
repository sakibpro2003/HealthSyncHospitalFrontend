"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetSingleProductQuery,
  useUpdateProductMutation,
} from "@/redux/features/product/productApi";
import type { TProduct } from "@/types/product";

type FormState = {
  name: string;
  image: string;
  description: string;
  price: string;
  quantity: string;
  inStock: boolean;
  requiredPrescription: boolean;
  expiryDate: string;
  rating: string;
  discount: string;
  packSize: string;
  dosage: string;
  category: string;
  manufacturerName: string;
  manufacturerAddress: string;
  manufacturerContact: string;
};

const CATEGORY_OPTIONS = [
  "Painkiller",
  "Antibiotic",
  "Cold",
  "Vitamin",
  "Cardiology",
  "Dermatology",
  "Gastroenterology",
  "Neurology",
];

const DEFAULT_FORM_STATE: FormState = {
  name: "",
  image: "",
  description: "",
  price: "",
  quantity: "",
  inStock: true,
  requiredPrescription: false,
  expiryDate: "",
  rating: "",
  discount: "",
  packSize: "",
  dosage: "",
  category: CATEGORY_OPTIONS[0],
  manufacturerName: "",
  manufacturerAddress: "",
  manufacturerContact: "",
};

const toDateInputValue = (value?: string) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().split("T")[0] ?? "";
};

const parseNumberField = (value: string) => {
  if (value.trim().length === 0) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const normaliseManufacturer = (manufacturer: TProduct["manufacturer"]) => {
  if (!manufacturer) {
    return {
      name: "",
      address: "",
      contact: "",
    };
  }

  if (typeof manufacturer === "string") {
    return {
      name: manufacturer,
      address: "",
      contact: "",
    };
  }

  return {
    name: manufacturer.name ?? "",
    address: manufacturer.address ?? "",
    contact: manufacturer.contact ?? "",
  };
};

const extractErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as { data?: { message?: unknown } }).data?.message === "string"
  ) {
    return (error as { data: { message: string } }).data.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

const MedicineUpdatePage = () => {
  const params = useParams<{ updateId: string }>();
  const router = useRouter();

  const productId = useMemo(() => {
    const id = params?.updateId;
    if (Array.isArray(id)) return id[0];
    return id ?? "";
  }, [params]);

  const shouldFetchProduct = productId.length > 0;

  const {
    data: productResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetSingleProductQuery(productId, {
    skip: !shouldFetchProduct,
  });

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);

  useEffect(() => {
    if (!productResponse?.data) {
      return;
    }

    const product = productResponse.data;
    const manufacturer = normaliseManufacturer(product.manufacturer);

    setFormState({
      name: product.name ?? "",
      image: product.image ?? "",
      description: product.description ?? "",
      price:
        typeof product.price === "number" && !Number.isNaN(product.price)
          ? product.price.toString()
          : "",
      quantity:
        typeof product.quantity === "number" && !Number.isNaN(product.quantity)
          ? product.quantity.toString()
          : "",
      inStock: Boolean(product.inStock),
      requiredPrescription: Boolean(product.requiredPrescription),
      expiryDate: toDateInputValue(
        product.expiryDate ?? product.updatedAt ?? product.createdAt
      ),
      rating:
        typeof product.rating === "number" && !Number.isNaN(product.rating)
          ? product.rating.toString()
          : "",
      discount:
        typeof product.discount === "number" && !Number.isNaN(product.discount)
          ? product.discount.toString()
          : "",
      packSize: product.packSize ?? "",
      dosage: product.dosage ?? "",
      category: product.category ?? CATEGORY_OPTIONS[0],
      manufacturerName: manufacturer.name,
      manufacturerAddress: manufacturer.address,
      manufacturerContact: manufacturer.contact,
    });
  }, [productResponse]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;

    if (type === "checkbox" && event.target instanceof HTMLInputElement) {
      setFormState((previous) => ({ ...previous, [name]: event.target.checked }));
      return;
    }

    setFormState((previous) => ({ ...previous, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormState((previous) => ({ ...previous, category: value }));
  };

  const handleBooleanChange = (field: "inStock" | "requiredPrescription") => {
    return (value: string) => {
      setFormState((previous) => ({
        ...previous,
        [field]: value === "true",
      }));
    };
  };

  const validateForm = () => {
    if (!formState.name.trim()) {
      toast.error("Medicine name is required");
      return false;
    }

    if (!formState.image.trim()) {
      toast.error("Image URL is required");
      return false;
    }

    if (!formState.description.trim()) {
      toast.error("Description is required");
      return false;
    }

    const priceValue = parseNumberField(formState.price);
    if (priceValue === undefined) {
      toast.error("Please provide a valid price");
      return false;
    }

    const quantityValue = parseNumberField(formState.quantity);
    if (quantityValue === undefined) {
      toast.error("Please provide a valid quantity");
      return false;
    }

    if (
      formState.expiryDate &&
      Number.isNaN(new Date(formState.expiryDate).getTime())
    ) {
      toast.error("Provide a valid expiry date");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!productId) return;

    if (!validateForm()) {
      return;
    }

    const priceValue = parseNumberField(formState.price);
    const quantityValue = parseNumberField(formState.quantity);
    const ratingValue = parseNumberField(formState.rating);
    const discountValue = parseNumberField(formState.discount);

    const manufacturer = formState.manufacturerName.trim()
      ? {
          name: formState.manufacturerName.trim(),
          ...(formState.manufacturerAddress.trim()
            ? { address: formState.manufacturerAddress.trim() }
            : {}),
          ...(formState.manufacturerContact.trim()
            ? { contact: formState.manufacturerContact.trim() }
            : {}),
        }
      : undefined;

    const updatePayload: Partial<TProduct> = {
      name: formState.name.trim(),
      image: formState.image.trim(),
      description: formState.description.trim(),
      inStock: formState.inStock,
      requiredPrescription: formState.requiredPrescription,
      category: formState.category.trim(),
      packSize: formState.packSize.trim() || undefined,
      dosage: formState.dosage.trim() || undefined,
    };

    if (priceValue !== undefined) updatePayload.price = priceValue;
    if (quantityValue !== undefined) updatePayload.quantity = quantityValue;
    if (ratingValue !== undefined) updatePayload.rating = ratingValue;
    if (discountValue !== undefined) updatePayload.discount = discountValue;

    if (formState.expiryDate) {
      const parsedDate = new Date(formState.expiryDate);
      if (!Number.isNaN(parsedDate.getTime())) {
        updatePayload.expiryDate = parsedDate.toISOString();
      }
    }

    if (manufacturer) {
      updatePayload.manufacturer = manufacturer;
    }

    try {
      await updateProduct({
        id: productId,
        updatePayload,
      }).unwrap();

      toast.success("Medicine updated successfully");
      router.push("/admin/manage-medicine");
    } catch (error) {
      toast.error(
        extractErrorMessage(error, "Failed to update medicine details")
      );
    }
  };

  if (!productId) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center text-destructive">
            Invalid medicine identifier.
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || isFetching) {
    return (
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-56" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !productResponse?.data) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-destructive">
              Failed to load medicine details. Please try again.
            </p>
            <Button onClick={() => refetch()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit medicine</CardTitle>
          <CardDescription>
            Update inventory information, pricing, and prescription requirements.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Medicine name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Paracetamol 500mg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  value={formState.image}
                  onChange={handleInputChange}
                  placeholder="https://"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formState.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Outline dosage instructions, active ingredients, and notes for pharmacists."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Unit price (USD)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formState.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity in stock</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={formState.quantity}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formState.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="packSize">Pack size</Label>
                <Input
                  id="packSize"
                  name="packSize"
                  value={formState.packSize}
                  onChange={handleInputChange}
                  placeholder="e.g., 10 tablets"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  name="dosage"
                  value={formState.dosage}
                  onChange={handleInputChange}
                  placeholder="e.g., 500mg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry date</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={formState.expiryDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formState.rating}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={formState.discount}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inStock">Stock status</Label>
                <Select
                  value={formState.inStock ? "true" : "false"}
                  onValueChange={handleBooleanChange("inStock")}
                >
                  <SelectTrigger id="inStock">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">In stock</SelectItem>
                    <SelectItem value="false">Out of stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requiredPrescription">Prescription</Label>
                <Select
                  value={formState.requiredPrescription ? "true" : "false"}
                  onValueChange={handleBooleanChange("requiredPrescription")}
                >
                  <SelectTrigger id="requiredPrescription">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Over the counter</SelectItem>
                    <SelectItem value="true">Requires prescription</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium">Manufacturer details</h2>
              <p className="text-sm text-muted-foreground">
                Keep manufacturer contact information current for recalls or restock
                enquiries.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="manufacturerName">Manufacturer name</Label>
                <Input
                  id="manufacturerName"
                  name="manufacturerName"
                  value={formState.manufacturerName}
                  onChange={handleInputChange}
                  placeholder="e.g., HealthSync Labs"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufacturerContact">Manufacturer contact</Label>
                <Input
                  id="manufacturerContact"
                  name="manufacturerContact"
                  value={formState.manufacturerContact}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="manufacturerAddress">Manufacturer address</Label>
                <Textarea
                  id="manufacturerAddress"
                  name="manufacturerAddress"
                  value={formState.manufacturerAddress}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Street address, city, country"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/manage-medicine")}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 size-4 animate-spin" />}
              Save changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default MedicineUpdatePage;
