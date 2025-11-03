"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useGetSingleProductQuery } from "@/redux/features/product/productApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { addToCart } from "@/utils/cart";
import { useClientUser } from "@/hooks/useClientUser";
import { toast } from "sonner";
import { resolveImageSrc } from "@/utils/resolveImageSrc";

const formatTaka = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 2,
  }).format(value);

export default function ProductDetails() {
  const params = useParams();
  const rawId = params?.id;
  const productId = Array.isArray(rawId) ? rawId[0] : (rawId ?? "");
  const { data, isLoading, isError } = useGetSingleProductQuery(productId, {
    skip: !productId,
  });
  const { user, isLoading: isUserLoading } = useClientUser();

  if (isLoading)
    return (
      <div className="mx-auto w-full py-10 text-center">Loading...</div>
    );
  if (isError)
    return (
      <div className="mx-auto w-full py-10 text-center text-red-500">
        Error loading product
      </div>
    );

  const medicine = data?.data;

  if (!medicine) {
    return (
      <div className="mx-auto w-full py-10 text-center">
        Product details are unavailable right now.
      </div>
    );
  }

  const basePrice = Number(medicine.price ?? 0);
  const discountPercentage = Number(medicine.discount ?? 0);
  const hasDiscount = discountPercentage > 0;
  const discountedPrice = Math.max(
    basePrice - (basePrice * discountPercentage) / 100,
    0,
  );
  const manufacturer =
    typeof medicine.manufacturer === "object" && medicine.manufacturer !== null
      ? medicine.manufacturer
      : null;
  const expiryDateLabel = medicine.expiryDate
    ? new Date(medicine.expiryDate).toLocaleDateString()
    : "Not specified";

  const handleAddToCart = () => {
    if (!medicine) {
      return;
    }

    if (isUserLoading) {
      toast.info("Checking your login status. Please try again in a moment.");
      return;
    }

    if (!user) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    addToCart(medicine);
    toast.success(`${medicine.name ?? "Medicine"} added to cart`);
  };

  return (
    <div className="mx-auto w-full px-6 py-10">
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Image Section */}
        <div className="relative flex justify-center bg-gray-50 p-6 rounded-2xl shadow-md">
          <Image
            src={resolveImageSrc(medicine.image)}
            alt={medicine.name}
            width={400}
            height={400}
            className="object-contain rounded-lg transition-transform duration-300 hover:scale-105"
          />
          {hasDiscount && (
            <Badge className="absolute top-6 left-6 bg-red-500 text-white px-3 py-1 text-sm shadow-md">
              -{discountPercentage}%
            </Badge>
          )}
        </div>

        {/* Product Info Section */}
        <div className="space-y-6 lg:sticky lg:top-20">
          <h1 className="text-4xl font-extrabold tracking-tight">
            {medicine.name}
          </h1>
          <p className="text-gray-600 text-lg">{medicine.description}</p>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-green-600">
              {formatTaka(discountedPrice)}
            </span>
            {discountPercentage > 0 && (
              <span className="text-gray-400 line-through text-lg">
                {formatTaka(basePrice)}
              </span>
            )}
          </div>

          {/* Stock + Prescription */}
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Stock:</span>{" "}
            {medicine.inStock ? (
              <span className="text-green-600 font-semibold">
                {medicine.quantity} available
              </span>
            ) : (
              <span className="text-red-600 font-semibold">Out of Stock</span>
            )}
          </p>
          <p>
            <span className="font-medium">Prescription Required:</span>{" "}
            {medicine.requiredPrescription ? "Yes" : "No"}
          </p>
          <p>
            <span className="font-medium">Expiry Date:</span>{" "}
            {expiryDateLabel}
          </p>
        </div>

          {/* Add to Cart */}
          <Button
            onClick={handleAddToCart}
            className="w-full md:w-2/3 rounded-xl py-6 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:from-green-600 hover:to-emerald-700"
            disabled={!medicine.inStock}
          >
            {medicine.inStock ? "🛒 Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>

      {/* Extra Details */}
      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Medicine Info */}
        <div className="p-6 rounded-2xl border shadow-sm bg-white hover:shadow-md transition">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
            Medicine Information
          </h2>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>
              <strong>Form:</strong> {medicine.form}
            </li>
            <li>
              <strong>Dosage:</strong> {medicine.dosage}
            </li>
            <li>
              <strong>Category:</strong> {medicine.category}
            </li>
            <li>
              <strong>Rating:</strong>{" "}
              <span className="text-yellow-500">⭐ {medicine.rating}/5</span>
            </li>
            <li>
              <strong>Pack Size:</strong> {medicine.packSize}
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl border shadow-sm bg-white hover:shadow-md transition">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
            Manufacturer
          </h2>
          <div className="text-gray-700 text-sm space-y-1">
            <p className="font-medium">{manufacturer?.name ?? "Not provided"}</p>
            <p>{manufacturer?.address ?? "—"}</p>
            <p>{manufacturer?.contact ?? "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
