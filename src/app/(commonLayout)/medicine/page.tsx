"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { TProduct } from "@/types/product";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllMedicineQuery } from "@/redux/features/product/productApi";
import { addToCart } from "@/utils/cart";
import { toast } from "sonner";
import { useClientUser } from "@/hooks/useClientUser";
import { resolveImageSrc } from "@/utils/resolveImageSrc";

const ITEMS_PER_PAGE = 8;

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 2,
  }).format(value);

const calculateSalePrice = (medicine: TProduct) => {
  const price = Number(medicine.price ?? 0);
  const discount = Number(medicine.discount ?? 0);
  const discounted = price - (price * discount) / 100;
  return Number.isFinite(discounted) ? Math.max(discounted, 0) : 0;
};

export default function MedicinePage() {
  const { data, isLoading, isError } = useGetAllMedicineQuery(undefined);
  const { user, isLoading: isUserLoading } = useClientUser();

  const medicines = useMemo<TProduct[]>(() => {
    return Array.isArray(data?.data) ? (data.data as TProduct[]) : [];
  }, [data]);

  const categories = useMemo(() => {
    const unique = new Set<string>();
    medicines.forEach((item) => {
      if (item?.category) {
        unique.add(item.category);
      }
    });
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [medicines]);

  const forms = useMemo(() => {
    const unique = new Set<string>();
    medicines.forEach((item) => {
      if (item?.form) {
        unique.add(item.form);
      }
    });
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [medicines]);

  const priceBounds = useMemo(() => {
    if (!medicines.length) {
      return [0, 0] as [number, number];
    }
    const prices = medicines.map((item) => calculateSalePrice(item));
    const min = Math.floor(Math.min(...prices));
    const max = Math.ceil(Math.max(...prices));
    return [min, max] as [number, number];
  }, [medicines]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedForm, setSelectedForm] = useState("all");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [prescriptionFilter, setPrescriptionFilter] = useState<
    "all" | "required" | "not-required"
  >("all");
  const [minRating, setMinRating] = useState("0");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [sortOption, setSortOption] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (priceBounds[0] === 0 && priceBounds[1] === 0) {
      return;
    }
    setPriceRange(priceBounds);
  }, [priceBounds]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedForm, onlyInStock, prescriptionFilter, minRating, priceRange, sortOption]);

  const filteredMedicines = useMemo(() => {
    const minRatingValue = Number(minRating);
    return medicines.filter((medicine) => {
      const salePrice = calculateSalePrice(medicine);
      const matchesSearch = searchTerm
        ? [medicine?.name, medicine?.description, medicine?.category]
            .filter(Boolean)
            .some((field) =>
              String(field).toLowerCase().includes(searchTerm.toLowerCase())
            )
        : true;
      const matchesCategory =
        selectedCategory === "all" || medicine?.category === selectedCategory;
      const matchesForm =
        selectedForm === "all" || medicine?.form === selectedForm;
      const matchesStock = !onlyInStock || Boolean(medicine?.inStock);
      const matchesPrescription =
        prescriptionFilter === "all" ||
        (prescriptionFilter === "required" && medicine?.requiredPrescription) ||
        (prescriptionFilter === "not-required" && !medicine?.requiredPrescription);
      const matchesRating = Number(medicine?.rating ?? 0) >= minRatingValue;
      const matchesPrice =
        salePrice >= priceRange[0] && salePrice <= priceRange[1];

      return (
        matchesSearch &&
        matchesCategory &&
        matchesForm &&
        matchesStock &&
        matchesPrescription &&
        matchesRating &&
        matchesPrice
      );
    });
  }, [
    medicines,
    searchTerm,
    selectedCategory,
    selectedForm,
    onlyInStock,
    prescriptionFilter,
    minRating,
    priceRange,
  ]);

  const sortedMedicines = useMemo(() => {
    const items = [...filteredMedicines];
    switch (sortOption) {
      case "price-asc":
        items.sort(
          (a, b) => calculateSalePrice(a) - calculateSalePrice(b)
        );
        break;
      case "price-desc":
        items.sort(
          (a, b) => calculateSalePrice(b) - calculateSalePrice(a)
        );
        break;
      case "rating-desc":
        items.sort((a, b) => (Number(b?.rating ?? 0) - Number(a?.rating ?? 0)) || calculateSalePrice(b) - calculateSalePrice(a));
        break;
      case "stock":
        items.sort((a, b) => Number(b?.inStock ?? 0) - Number(a?.inStock ?? 0));
        break;
      default:
        items.sort((a, b) => String(a?.name ?? "").localeCompare(String(b?.name ?? "")));
        break;
    }
    return items;
  }, [filteredMedicines, sortOption]);

  const totalItems = sortedMedicines.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedMedicines = sortedMedicines.slice(startIndex, endIndex);

  const showingFrom = totalItems === 0 ? 0 : startIndex + 1;
  const showingTo = Math.min(endIndex, totalItems);

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    selectedCategory !== "all" ||
    selectedForm !== "all" ||
    onlyInStock ||
    prescriptionFilter !== "all" ||
    minRating !== "0" ||
    priceRange[0] !== priceBounds[0] ||
    priceRange[1] !== priceBounds[1];

  const handleAddToCart = (medicine: TProduct) => {
    if (isUserLoading) {
      toast.info("Checking your login status. Please try again in a moment.");
      return;
    }

    if (!user) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    addToCart(medicine);
    toast.success(`${medicine?.name ?? "Medicine"} added to cart`);
  };

  const handlePriceChange = (index: 0 | 1, rawValue: string) => {
    const parsed = Number(rawValue);
    if (Number.isNaN(parsed)) {
      return;
    }
    setPriceRange((prev) => {
      const next = [...prev] as [number, number];
      if (index === 0) {
        const lowerBound = priceBounds[0];
        next[0] = Math.max(lowerBound, Math.min(parsed, next[1]));
      } else {
        const upperBound = priceBounds[1] || parsed;
        next[1] = Math.min(upperBound, Math.max(parsed, next[0]));
      }
      return next;
    });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedForm("all");
    setOnlyInStock(false);
    setPrescriptionFilter("all");
    setMinRating("0");
    setPriceRange(priceBounds);
    setSortOption("featured");
  };

  if (isLoading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
        <div className="mx-auto flex min-h-screen w-11/12 max-w-5xl items-center justify-center px-6">
          <div className="flex flex-col items-center gap-4 text-center text-slate-500">
            <span className="h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-transparent" />
            <p className="text-lg font-medium">Loading medicines...</p>
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-100">
        <div className="mx-auto flex min-h-screen w-11/12 max-w-3xl items-center justify-center px-6">
          <div className="rounded-3xl border border-red-200 bg-white/80 p-8 text-center shadow-xl backdrop-blur">
            <h1 className="text-2xl font-semibold text-red-600">
              We couldn&apos;t load the medicine catalog
            </h1>
            <p className="mt-2 text-sm text-red-500">
              Please refresh the page or try again in a moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <div className="mx-auto w-full px-6 py-14">
        <header className="mx-auto max-w-3xl text-center lg:max-w-none lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500">
            Medicine Catalog
          </p>
          <h1 className="mt-4 text-4xl font-black text-slate-900 sm:text-5xl">
            Find the right treatment with smart filters &amp; search
          </h1>
          <p className="mt-4 text-base text-slate-600 lg:max-w-2xl">
            Browse prescription and over-the-counter medicines, compare prices, and quickly add essentials to your cart. Every product includes key safety details so you can shop confidently.
          </p>
        </header>

        <div className="mt-12 grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-8  rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-xl backdrop-blur">
            <div className="space-y-3">
              <Label htmlFor="medicine-search" className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Search
              </Label>
              <Input
                id="medicine-search"
                placeholder="Search by name or purpose"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="rounded-2xl border-slate-200 bg-white/80 px-4 py-2 text-sm shadow-sm focus-visible:border-violet-400 focus-visible:ring-violet-200"
              />
            </div>

            <div className="space-y-5">
              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Category
                </Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full justify-between rounded-2xl border-slate-200 bg-white/80 px-4 py-2 text-sm shadow-sm">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-200 bg-white/90 backdrop-blur">
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Form
                </Label>
                <Select value={selectedForm} onValueChange={setSelectedForm}>
                  <SelectTrigger className="w-full justify-between rounded-2xl border-slate-200 bg-white/80 px-4 py-2 text-sm shadow-sm">
                    <SelectValue placeholder="All forms" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-200 bg-white/90 backdrop-blur">
                    <SelectItem value="all">All forms</SelectItem>
                    {forms.map((form) => (
                      <SelectItem key={form} value={form}>
                        {form}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Prescription
                </Label>
                <Select
                  value={prescriptionFilter}
                  onValueChange={(value: "all" | "required" | "not-required") =>
                    setPrescriptionFilter(value)
                  }
                >
                  <SelectTrigger className="w-full justify-between rounded-2xl border-slate-200 bg-white/80 px-4 py-2 text-sm shadow-sm">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-200 bg-white/90 backdrop-blur">
                    <SelectItem value="all">All medicines</SelectItem>
                    <SelectItem value="required">Prescription required</SelectItem>
                    <SelectItem value="not-required">No prescription needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Availability
                </Label>
                <button
                  type="button"
                  onClick={() => setOnlyInStock((prev) => !prev)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    onlyInStock
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm"
                      : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span>In stock only</span>
                  <Badge
                    variant={onlyInStock ? "secondary" : "outline"}
                    className="rounded-full px-3 uppercase tracking-wide"
                  >
                    {onlyInStock ? "Active" : "Off"}
                  </Badge>
                </button>
              </div>

              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Minimum rating
                </Label>
                <Select value={minRating} onValueChange={setMinRating}>
                  <SelectTrigger className="w-full justify-between rounded-2xl border-slate-200 bg-white/80 px-4 py-2 text-sm shadow-sm">
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-200 bg-white/90 backdrop-blur">
                    <SelectItem value="0">Any rating</SelectItem>
                    <SelectItem value="3">3★ &amp; above</SelectItem>
                    <SelectItem value="4">4★ &amp; above</SelectItem>
                    <SelectItem value="4.5">4.5★ &amp; above</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Price range
                </Label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
                      Min
                    </span>
                    <Input
                      type="number"
                      min={priceBounds[0]}
                      max={priceRange[1]}
                      value={priceRange[0]}
                      onChange={(event) =>
                        handlePriceChange(0, event.target.value)
                      }
                      className="mt-1 rounded-2xl border-slate-200 bg-white/80 px-4 py-2 text-sm shadow-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
                      Max
                    </span>
                    <Input
                      type="number"
                      min={priceRange[0]}
                      max={priceBounds[1] || 9999}
                      value={priceRange[1]}
                      onChange={(event) =>
                        handlePriceChange(1, event.target.value)
                      }
                      className="mt-1 rounded-2xl border-slate-200 bg-white/80 px-4 py-2 text-sm shadow-sm"
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </p>
              </div>
            </div>

            <div>
              <Button
                onClick={resetFilters}
                variant="ghost"
                className="w-full rounded-2xl border border-transparent text-sm font-semibold text-violet-600 transition hover:border-violet-200 hover:bg-violet-50"
                disabled={!hasActiveFilters}
              >
                Reset filters
              </Button>
            </div>
          </aside>

          <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/60 bg-white/70 p-6 shadow-sm backdrop-blur-lg sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1 text-sm text-slate-600">
                <p className="font-semibold text-slate-800">
                  Showing {showingFrom}-{showingTo} of {totalItems} medicines
                </p>
                <p>
                  {onlyInStock ? "Filtered to in-stock items" : "Browse all availability"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {hasActiveFilters && (
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {selectedCategory !== "all" && (
                      <Badge variant="outline" className="rounded-full px-3">
                        {selectedCategory}
                      </Badge>
                    )}
                    {selectedForm !== "all" && (
                      <Badge variant="outline" className="rounded-full px-3">
                        {selectedForm}
                      </Badge>
                    )}
                    {onlyInStock && (
                      <Badge variant="outline" className="rounded-full px-3">
                        In stock
                      </Badge>
                    )}
                    {prescriptionFilter === "required" && (
                      <Badge variant="outline" className="rounded-full px-3">
                        Rx needed
                      </Badge>
                    )}
                    {prescriptionFilter === "not-required" && (
                      <Badge variant="outline" className="rounded-full px-3">
                        OTC
                      </Badge>
                    )}
                    {minRating !== "0" && (
                      <Badge variant="outline" className="rounded-full px-3">
                        {minRating}★+
                      </Badge>
                    )}
                  </div>
                )}

                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-48 justify-between rounded-2xl border-slate-200 bg-white px-4 py-2 text-sm shadow-sm">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-200 bg-white/95 backdrop-blur">
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating-desc">Rating: High to Low</SelectItem>
                    <SelectItem value="stock">Availability</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {paginatedMedicines.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-violet-200 bg-white/60 p-12 text-center shadow-inner backdrop-blur">
                <h2 className="text-2xl font-semibold text-slate-800">
                  No medicines match your filters
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Try adjusting your filters or resetting them to explore the full catalog.
                </p>
                <Button
                  onClick={resetFilters}
                  className="mt-6 rounded-full bg-violet-600 px-6 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-violet-700"
                >
                  Reset filters
                </Button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {paginatedMedicines.map((medicine) => {
                  const salePrice = calculateSalePrice(medicine);
                  const manufacturer =
                    typeof medicine?.manufacturer === "string"
                      ? medicine.manufacturer
                      : medicine?.manufacturer?.name;

                  return (
                    <Card
                      key={medicine?._id}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 shadow-md transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl"
                    >
                      <div className="relative flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 px-4 pt-5">
                        {medicine?.discount ? (
                          <Badge className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-lg">
                            -{medicine.discount}%
                          </Badge>
                        ) : null}
                        <div className="relative h-28 w-28">
                          <Image
                            src={resolveImageSrc(medicine?.image)}
                            alt={medicine?.name ?? "Medicine"}
                            fill
                            sizes="(min-width: 1280px) 10rem, (min-width: 640px) 8rem, 7rem"
                            className="object-contain transition duration-500 group-hover:scale-105"
                          />
                        </div>
                      </div>

                      <CardHeader className="space-y-1.5 px-4 pt-3">
                        <CardTitle className="text-lg font-semibold text-slate-900 line-clamp-1">
                          {medicine?.name}
                        </CardTitle>
                        <p className="text-xs uppercase tracking-[0.3em] text-violet-500">
                          {medicine?.category ?? "General"}
                        </p>
                        <p className="line-clamp-2 text-xs text-slate-500 sm:text-sm">
                          {medicine?.description ?? "No description available."}
                        </p>
                      </CardHeader>

                      <CardContent className="flex flex-1 flex-col gap-2 px-4 text-xs text-slate-600 sm:text-sm">
                        <div className="flex items-center justify-between">
                          <span>Form</span>
                          <span className="font-medium text-slate-800 text-sm">
                            {medicine?.form ?? "—"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Pack size</span>
                          <span className="font-medium text-slate-800 text-sm">
                            {medicine?.packSize ?? "—"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Manufacturer</span>
                          <span className="font-medium text-slate-800 line-clamp-1 text-sm">
                            {manufacturer ?? "Unknown"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Rating</span>
                          <span className="font-semibold text-amber-500 text-sm">
                            ⭐ {Number(medicine?.rating ?? 0).toFixed(1)}
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600">Price</span>
                            <span className="text-base font-bold text-violet-600 sm:text-lg">
                              {formatPrice(salePrice)}
                            </span>
                          </div>
                          {medicine?.discount ? (
                            <span className="text-right text-xs text-slate-400 line-through">
                              {formatPrice(Number(medicine?.price ?? 0))}
                            </span>
                          ) : null}
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Availability</span>
                          {medicine?.inStock ? (
                            <Badge className="rounded-full bg-emerald-500/90 px-2.5 text-[10px] font-semibold">
                              {medicine?.quantity ?? 0} in stock
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="rounded-full border-red-300 bg-red-50 px-2.5 text-[10px] font-semibold text-red-500">
                              Out of stock
                            </Badge>
                          )}
                        </div>
                        {medicine?.requiredPrescription ? (
                          <div className="flex items-center justify-between">
                            <span>Prescription</span>
                            <Badge variant="outline" className="rounded-full border-violet-300 bg-violet-50 px-2.5 text-[10px] font-semibold text-violet-600">
                              Required
                            </Badge>
                          </div>
                        ) : null}
                      </CardContent>

                      <CardFooter className="flex flex-col gap-2 px-4 pb-4">
                        <Button
                          onClick={() => handleAddToCart(medicine)}
                          disabled={!medicine?.inStock}
                          className="flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 py-1.5 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-200"
                        >
                          {medicine?.inStock ? "Add to cart" : "Out of stock"}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full rounded-full border-slate-200 py-1.5 text-sm font-semibold text-slate-700 hover:border-violet-300 hover:text-violet-600"
                          asChild
                        >
                          <Link href={`/medicine/${medicine?._id}`}>
                            View details
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}

            {totalPages > 1 && (
              <Pagination className="pt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        setCurrentPage((prev) => Math.max(prev - 1, 1));
                      }}
                      aria-disabled={currentPage === 1}
                      className={currentPage === 1 ? "pointer-events-none opacity-40" : ""}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, index) => {
                    const page = index + 1;
                    const isActive = page === currentPage;
                    const shouldRender =
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1;

                    if (!shouldRender) {
                      if (
                        (page === currentPage - 2 && page > 1) ||
                        (page === currentPage + 2 && page < totalPages)
                      ) {
                        return (
                          <PaginationItem key={`ellipsis-${page}`}>
                            <span className="px-3 py-2 text-sm text-slate-400">...</span>
                          </PaginationItem>
                        );
                      }
                      return null;
                    }

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={isActive}
                          onClick={(event) => {
                            event.preventDefault();
                            setCurrentPage(page);
                          }}
                          className="rounded-full"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                      }}
                      aria-disabled={currentPage === totalPages}
                      className={currentPage === totalPages ? "pointer-events-none opacity-40" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
