"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  useGetAllMedicineQuery,
  useRemoveMedicineMutation,
} from "@/redux/features/product/productApi";
import type { TProduct } from "@/types/product";
import Loader from "@/components/shared/Loader";

const ITEMS_PER_PAGE = 8;
const LOW_STOCK_THRESHOLD = 20;

type StockState = "healthy" | "low" | "out";
type StockFilter = "all" | StockState;
type PrescriptionFilter = "all" | "required" | "optional";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const getStockState = (quantity: number | null | undefined): StockState => {
  const safeQuantity = typeof quantity === "number" ? quantity : 0;
  if (safeQuantity <= 0) return "out";
  if (safeQuantity <= LOW_STOCK_THRESHOLD) return "low";
  return "healthy";
};

const stockStateLabel: Record<StockState, string> = {
  healthy: "In stock",
  low: "Low stock",
  out: "Out of stock",
};

const stockStateBadgeVariant: Record<StockState, "default" | "secondary" | "destructive"> = {
  healthy: "default",
  low: "secondary",
  out: "destructive",
};

const formatCurrency = (value: number | null | undefined): string =>
  typeof value === "number" ? currencyFormatter.format(value) : "--";

const formatDate = (value: string | null | undefined): string => {
  if (!value) return "--";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "--";
  return parsed.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const ManageMedicinePage = () => {
  const router = useRouter();

  const { data: medicinesData, isLoading, isError, refetch } =
    useGetAllMedicineQuery();
  const [removeMedicine, { isLoading: isRemoving }] =
    useRemoveMedicineMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [prescriptionFilter, setPrescriptionFilter] =
    useState<PrescriptionFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMedId, setSelectedMedId] = useState<string | null>(null);

  const medicines = useMemo<TProduct[]>(
    () => (Array.isArray(medicinesData?.data) ? medicinesData.data : []),
    [medicinesData]
  );

  const inventorySummary = useMemo(() => {
    const totalCount = medicines.length;
    const totalStock = medicines.reduce(
      (acc, med) => acc + (typeof med.quantity === "number" ? med.quantity : 0),
      0
    );
    const lowStock = medicines.filter(
      (med) => getStockState(med.quantity) === "low"
    ).length;
    const outOfStock = medicines.filter(
      (med) => getStockState(med.quantity) === "out"
    ).length;
    const averagePrice =
      totalCount > 0
        ? medicines.reduce(
            (acc, med) => acc + (typeof med.price === "number" ? med.price : 0),
            0
          ) / totalCount
        : 0;

    return {
      totalCount,
      totalStock,
      lowStock,
      outOfStock,
      averagePrice,
    };
  }, [medicines]);

  const filteredMedicines = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return medicines.filter((medicine) => {
      const stockState = getStockState(medicine.quantity);
      const requiresPrescription = Boolean(medicine.requiredPrescription);

      const matchesSearch =
        normalizedSearch.length === 0 ||
        `${medicine.name ?? ""} ${medicine.description ?? ""} ${
          typeof medicine.manufacturer === "string"
            ? medicine.manufacturer
            : medicine.manufacturer?.name ?? ""
        }`
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStock =
        stockFilter === "all" ? true : stockFilter === stockState;

      const matchesPrescription =
        prescriptionFilter === "all"
          ? true
          : prescriptionFilter === "required"
          ? requiresPrescription
          : !requiresPrescription;

      return matchesSearch && matchesStock && matchesPrescription;
    });
  }, [medicines, prescriptionFilter, searchTerm, stockFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMedicines.length / ITEMS_PER_PAGE)
  );

  const paginatedMeds = useMemo(
    () =>
      filteredMedicines.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      ),
    [filteredMedicines, currentPage]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, stockFilter, prescriptionFilter]);

  useEffect(() => {
    setCurrentPage((previous) => Math.min(previous, totalPages));
  }, [totalPages]);

  const selectedMedicine = useMemo(
    () => medicines.find((med) => med._id === selectedMedId) ?? null,
    [medicines, selectedMedId]
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <Loader fullScreen={false} label="Loading medicines" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <p className="text-center text-red-500">
          Unable to load medicines right now. Please try again later.
        </p>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!selectedMedId) return;

    try {
      await removeMedicine(selectedMedId).unwrap();
      toast.success("Medicine removed successfully");
      setSelectedMedId(null);
      await refetch();
    } catch (error) {
      toast.error(
        extractErrorMessage(error, "Failed to delete the selected medicine")
      );
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-20 text-center text-muted-foreground">
            Loading medicines...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-20 text-center text-destructive">
            Failed to fetch medicines.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 justify-between md:flex-row md:items-center">
        <div>
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            Pharmacy inventory
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Manage Medicines
          </h1>
          <p className="text-muted-foreground">
            Monitor stock levels, review pricing, and keep your medicine
            catalogue up to date.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => refetch()}>
            Refresh
          </Button>
          <Button asChild>
            <Link href="/create-new-medicine">Add Medicine</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle>Total medicines</CardTitle>
            <CardDescription>Active items in the catalogue</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {inventorySummary.totalCount}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total stock on hand</CardTitle>
            <CardDescription>
              Aggregate units currently in inventory
            </CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {inventorySummary.totalStock}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Low stock items</CardTitle>
            <CardDescription>
              At or below {LOW_STOCK_THRESHOLD} units
            </CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-yellow-600">
            {inventorySummary.lowStock}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average price</CardTitle>
            <CardDescription>Across all medicines</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {formatCurrency(inventorySummary.averagePrice)}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <CardTitle>Inventory filters</CardTitle>
            <CardDescription>
              Use the filters below to locate the medicine you need.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setStockFilter("all");
                setPrescriptionFilter("all");
              }}
            >
              Reset filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by medicine name, manufacturer, or description"
              className="w-full md:w-72"
            />
            <Select
              value={stockFilter}
              onValueChange={(value: StockFilter) => setStockFilter(value)}
            >
              <SelectTrigger className="md:w-52">
                <SelectValue placeholder="Filter by stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All stock levels</SelectItem>
                <SelectItem value="healthy">In stock</SelectItem>
                <SelectItem value="low">Low stock</SelectItem>
                <SelectItem value="out">Out of stock</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={prescriptionFilter}
              onValueChange={(value: PrescriptionFilter) =>
                setPrescriptionFilter(value)
              }
            >
              <SelectTrigger className="md:w-56">
                <SelectValue placeholder="Prescription status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All medicines</SelectItem>
                <SelectItem value="required">Requires prescription</SelectItem>
                <SelectItem value="optional">Over the counter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Medicine catalogue</CardTitle>
          <CardDescription>
            {filteredMedicines.length} item
            {filteredMedicines.length === 1 ? "" : "s"} matched
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          {filteredMedicines.length === 0 ? (
            <p className="px-6 py-12 text-center text-muted-foreground">
              No medicines found for the current filters.
            </p>
          ) : (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableCaption>A curated view of your medicine inventory.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medicine</TableHead>
                    <TableHead className="min-w-[140px]">Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Prescription</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedMeds.map((medicine) => {
                    const stockState = getStockState(medicine.quantity);
                    const needsPrescription = Boolean(
                      medicine.requiredPrescription
                    );
                    const lastUpdated =
                      medicine.updatedAt ??
                      medicine.updated_at ??
                      medicine.createdAt ??
                      "";

                    return (
                      <TableRow key={medicine._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative size-12 overflow-hidden rounded-lg border">
                              <Image
                                fill
                                sizes="48px"
                                src={
                                  medicine.image?.startsWith("http")
                                    ? medicine.image
                                    : "/placeholder.jpg"
                                }
                                alt={medicine.name ?? "Medicine image"}
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-semibold tracking-tight">
                                {medicine.name}
                              </p>
                              <p className="max-w-xs truncate text-sm text-muted-foreground">
                                {medicine.description || "-"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {medicine.category ? (
                            <Badge variant="secondary">{medicine.category}</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(medicine.price)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {typeof medicine.quantity === "number"
                                ? `${medicine.quantity} pcs`
                                : "-"}
                            </span>
                            <Badge
                              variant={stockStateBadgeVariant[stockState]}
                              className="mt-1 w-fit"
                            >
                              {stockStateLabel[stockState]}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {typeof medicine.manufacturer === "string"
                            ? medicine.manufacturer
                            : medicine.manufacturer?.name ?? "Unknown"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={needsPrescription ? "default" : "outline"}
                            className={needsPrescription ? "" : "text-muted-foreground"}
                          >
                            {needsPrescription ? "Requires Rx" : "Over the counter"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(lastUpdated)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={!medicine._id || isRemoving}
                              onClick={() => {
                                if (medicine._id) {
                                  router.push(`/admin/update/${medicine._id}`);
                                }
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={!medicine._id || isRemoving}
                              onClick={() => setSelectedMedId(medicine._id ?? null)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        {filteredMedicines.length > 0 && (
          <CardFooter className="justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredMedicines.length)} of{" "}
              {filteredMedicines.length} medicines
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setCurrentPage((prev) => Math.max(prev - 1, 1));
                    }}
                    aria-disabled={currentPage === 1}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink isActive aria-current="page">
                    {currentPage}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                    }}
                    aria-disabled={currentPage === totalPages}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        )}
      </Card>

      {selectedMedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader>
              <CardTitle>Delete medicine</CardTitle>
              <CardDescription>
                {selectedMedicine
                  ? `You are about to delete ${selectedMedicine.name}. This action cannot be undone.`
                  : "You are about to delete this medicine. This action cannot be undone."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedMedicine && (
                <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                  <div className="relative size-12 overflow-hidden rounded-md border">
                    <Image
                      fill
                      sizes="48px"
                      src={
                        selectedMedicine.image?.startsWith("http")
                          ? selectedMedicine.image
                          : "/placeholder.jpg"
                      }
                      alt={selectedMedicine.name ?? "Medicine image"}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{selectedMedicine.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedMedicine.category ?? "Uncategorised"}
                    </p>
                  </div>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                Deleting this medicine will remove it from all active listings.
                Patients will no longer be able to order it through the system.
              </p>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedMedId(null)}
                disabled={isRemoving}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isRemoving}
              >
                {isRemoving ? "Deleting..." : "Delete"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
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

export default ManageMedicinePage;
