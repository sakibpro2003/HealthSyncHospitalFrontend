"use client";

import React, { useMemo, useState } from "react";
import {
  Activity,
  Beaker,
  Factory,
  Package,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "@/redux/features/product/productApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ProductFormState = {
  name: string;
  image: string;
  description: string;
  price: number | string;
  quantity: number | string;
  inStock: boolean;
  requiredPrescription: boolean;
  expiryDate: string;
  rating: number | string;
  discount: number | string;
  packSize: string;
  dosage: string;
  category: string;
  manufacturer: {
    name: string;
    address: string;
    contact: string;
  };
};

const initialProductState: ProductFormState = {
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
  category: "Painkiller",
  manufacturer: {
    name: "",
    address: "",
    contact: "",
  },
};

type ToggleField = "inStock" | "requiredPrescription";

const ProductForm = () => {
  const [product, setProduct] = useState<ProductFormState>(initialProductState);
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const [uploadProductImage, { isLoading: isUploading }] =
    useUploadProductImageMutation();

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = event.target;
    const isCheckbox = type === "checkbox";

    if (name.startsWith("manufacturer.")) {
      const [, field] = name.split(".");
      setProduct((prev) => ({
        ...prev,
        manufacturer: {
          ...prev.manufacturer,
          [field]: value,
        },
      }));
      return;
    }

    setProduct((prev) => ({
      ...prev,
      [name]: isCheckbox ? checked : value,
    }));
  };

  const handleToggle = (field: ToggleField) => {
    setProduct((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const { url } = await uploadProductImage(formData).unwrap();
      setProduct((prev) => ({ ...prev, image: url }));
      toast.success("Image uploaded");
    } catch (error) {
      const errorMessage = (() => {
        const isBaseQueryError =
          typeof error === "object" &&
          error !== null &&
          "status" in error &&
          "data" in error;

        if (isBaseQueryError) {
          const baseError = error as {
            data?: { message?: string } | string;
            error?: string;
          };
          if (typeof baseError.data === "string") return baseError.data;
          if (baseError.data && typeof baseError.data === "object" && "message" in baseError.data) {
            return (baseError.data as { message?: string }).message ?? "Image upload failed";
          }
          if (baseError.error === "TypeError: Failed to fetch") {
            return "Upload failed. Is the backend running at the API base URL?";
          }
          return baseError.error ?? "Image upload failed";
        }
        if (error instanceof Error) return error.message;
        return "Image upload failed";
      })();

      toast.error(errorMessage);
      console.warn("Image upload failed", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!product.image) {
      toast.error("Please upload a product image first");
      return;
    }

    try {
      const payload = {
        ...product,
        price: Number(product.price) || 0,
        quantity: Number(product.quantity) || 0,
        rating: Number(product.rating) || 0,
        discount: Number(product.discount) || 0,
        expiryDate: product.expiryDate ? new Date(product.expiryDate) : undefined,
      };

      await createProduct(payload).unwrap();
      toast.success("Medicine added successfully");
      setProduct(initialProductState);
    } catch (error) {
      toast.error("Failed to create medicine");
      console.error(error);
    }
  };

  const highlightCards = useMemo(
    () => [
      {
        label: "List price",
        value:
          Number(product.price) > 0
            ? `BDT ${Number(product.price).toFixed(2)}`
            : "Awaiting price",
        helper: "Retail before discount",
        icon: Package,
        accent: "bg-amber-50 text-amber-600 border-amber-100",
      },
      {
        label: "Inventory batch",
        value:
          Number(product.quantity) > 0 ? `${product.quantity} units` : "Set quantity",
        helper: "Visible to pharmacy ops",
        icon: Activity,
        accent: "bg-emerald-50 text-emerald-600 border-emerald-100",
      },
      {
        label: "Regulatory tag",
        value: product.requiredPrescription ? "Rx required" : "OTC ready",
        helper: product.requiredPrescription
          ? "Patients must upload prescriptions"
          : "Available without prescription",
        icon: ShieldCheck,
        accent: "bg-sky-50 text-sky-600 border-sky-100",
      },
    ],
    [product.price, product.quantity, product.requiredPrescription]
  );

  const complianceToggles: {
    label: string;
    description: string;
    field: ToggleField;
  }[] = [
    {
      label: "In stock and orderable",
      description: "Display medicine in all patient storefronts.",
      field: "inStock",
    },
    {
      label: "Requires prescription upload",
      description: "Only fulfil orders with verified doctor notes.",
      field: "requiredPrescription",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="rounded-3xl border border-white/60 bg-white/90 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-violet-600">
                <p className="h-4" /> Pharmacy control room
              </span>
              <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
                Launch a new medicine batch
              </h1>
              <p className="max-w-2xl text-base text-slate-600">
                Capture commercial, safety, and manufacturing data in a single submission.
                The preview cards update as you type, so your team stays in sync.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:w-96 xl:w-[26rem]">
              {highlightCards.map(({ label, value, helper, icon: Icon, accent }) => (
                <article
                  key={label}
                  className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className={`rounded-2xl border px-3 py-2 text-xs ${accent}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        {label}
                      </p>
                      <p className="text-base font-semibold text-slate-900">{value}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">{helper}</p>
                </article>
              ))}
            </div>
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-3xl border border-white/70 bg-white/95 p-8 shadow-[0_25px_60px_rgba(15,23,42,0.06)]"
        >
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <section className="rounded-2xl border border-slate-100 bg-slate-50/40 p-6">
                <div className="mb-4 flex items-center gap-3 text-slate-700">
                  <Package className="h-5 w-5 text-violet-500" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Product profile</p>
                    <p className="text-xs text-slate-500">
                      Name, imagery, and therapeutic overview.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-slate-600">Medicine name</Label>
                    <Input
                      name="name"
                      value={product.name}
                      onChange={handleChange}
                      placeholder="e.g., Paracet 500"
                      className="h-12 rounded-2xl bg-white/80"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-slate-600">Product image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="h-12 rounded-2xl bg-white/80"
                      required={!product.image}
                      disabled={isUploading}
                    />
                    <p className="text-xs text-slate-500">
                      {isUploading
                        ? "Uploading to Cloudinary..."
                        : product.image
                        ? `Uploaded: ${product.image}`
                        : "Choose a clear pack shot or blister photo to upload."}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-slate-600">Therapeutic description</Label>
                    <Textarea
                      name="description"
                      value={product.description}
                      onChange={handleChange}
                      placeholder="Summarise indications, key ingredients, and patient guidance."
                      className="min-h-[120px] rounded-2xl bg-white/80"
                      required
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-100 bg-slate-50/40 p-6">
                <div className="mb-4 flex items-center gap-3 text-slate-700">
                  <Beaker className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Clinical configuration
                    </p>
                    <p className="text-xs text-slate-500">
                      Dosage, pack size, categories, and review metadata.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm">Pack size</Label>
                    <Input
                      name="packSize"
                      value={product.packSize}
                      onChange={handleChange}
                      placeholder="10 tablets"
                      className="rounded-2xl bg-white/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Dosage strength</Label>
                    <Input
                      name="dosage"
                      value={product.dosage}
                      onChange={handleChange}
                      placeholder="500mg"
                      className="rounded-2xl bg-white/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Category</Label>
                    <select
                      name="category"
                      value={product.category}
                      onChange={handleChange}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white/80 px-3 text-sm text-slate-700 focus:border-violet-300 focus:outline-none"
                    >
                      <option value="Painkiller">Painkiller</option>
                      <option value="Antibiotic">Antibiotic</option>
                      <option value="Cold">Cold</option>
                      <option value="Vitamin">Vitamin</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Expiry date</Label>
                    <Input
                      type="date"
                      name="expiryDate"
                      value={product.expiryDate}
                      onChange={handleChange}
                      className="rounded-2xl bg-white/80"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Average rating (1-5)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      name="rating"
                      value={product.rating}
                      onChange={handleChange}
                      className="rounded-2xl bg-white/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Discount %</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      name="discount"
                      value={product.discount}
                      onChange={handleChange}
                      className="rounded-2xl bg-white/80"
                    />
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section className="rounded-2xl border border-slate-100 bg-slate-50/40 p-6">
                <div className="mb-4 flex items-center gap-3 text-slate-700">
                  <Activity className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Commercial & availability
                    </p>
                    <p className="text-xs text-slate-500">
                      Pricing, stock, and selling conditions.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm">Unit price (BDT)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      name="price"
                      value={product.price}
                      onChange={handleChange}
                      className="rounded-2xl bg-white/80"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Available quantity</Label>
                    <Input
                      type="number"
                      min="0"
                      name="quantity"
                      value={product.quantity}
                      onChange={handleChange}
                      className="rounded-2xl bg-white/80"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {complianceToggles.map(({ label, description, field }) => (
                    <button
                      key={field}
                      type="button"
                      onClick={() => handleToggle(field)}
                      className={`flex w-full flex-col rounded-2xl border px-4 py-3 text-left transition ${
                        product[field]
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <span className="text-sm font-semibold text-slate-900">{label}</span>
                      <span className="text-xs text-slate-500">{description}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-100 bg-slate-50/40 p-6">
                <div className="mb-4 flex items-center gap-3 text-slate-700">
                  <Factory className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Manufacturer dossier
                    </p>
                    <p className="text-xs text-slate-500">
                      Official contact for recalls or batch clarifications.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Manufacturer name</Label>
                    <Input
                      name="manufacturer.name"
                      value={product.manufacturer.name}
                      onChange={handleChange}
                      placeholder="HealthSync Pharma Ltd."
                      className="rounded-2xl bg-white/80"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Head office address</Label>
                    <Input
                      name="manufacturer.address"
                      value={product.manufacturer.address}
                      onChange={handleChange}
                      placeholder="House 42, Road 12, Dhaka"
                      className="rounded-2xl bg-white/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Primary contact</Label>
                    <Input
                      name="manufacturer.contact"
                      value={product.manufacturer.contact}
                      onChange={handleChange}
                      placeholder="+880 17 0000 0000"
                      className="rounded-2xl bg-white/80"
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-base font-semibold text-slate-900">
                Ready to publish this medicine?
              </p>
              <p className="text-sm text-slate-500">
                We will validate the payload and broadcast the product across dashboards.
              </p>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 rounded-full bg-violet-600 px-8 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Publishing..." : "Create medicine"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
