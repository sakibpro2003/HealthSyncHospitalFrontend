"use client";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetAllMedicineQuery } from "@/redux/features/product/productApi";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { addToCart } from "@/utils/cart";

export default function MedicineCard() {
  const { data, isLoading, isError } = useGetAllMedicineQuery(undefined);

  if (isLoading) return <div className="text-center py-6">Loading...</div>;
  if (isError)
    return (
      <div className="text-center py-6 text-red-500">
        Error loading medicines
      </div>
    );

  return (
    <div className="grid w-11/12 mx-auto gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-6">
      {data?.data.map((medicine: any) => (
        <Card
          key={medicine._id}
          className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          {/* Discount Badge */}
          {medicine.discount > 0 && (
            <Badge className="absolute right-3 top-3 bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md">
              -{medicine.discount}%
            </Badge>
          )}

          {/* Image Section */}
          <div className="flex justify-center">
            <Image
              src={medicine.image}
              alt={medicine.name}
              width={180}
              height={180}
              className="h-36 w-36 object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          {/* Header */}
          <CardHeader>
            <CardTitle className="text-lg font-bold line-clamp-1 text-gray-800">
              {medicine.name}
            </CardTitle>
            <CardDescription className="line-clamp-2 text-sm text-gray-500">
              {medicine.description}
            </CardDescription>
          </CardHeader>

          {/* Details */}
          <CardContent className="flex-1 text-sm">
            <p className="flex justify-between">
              <span className="text-gray-600">Form</span>
              <span className="font-medium">{medicine.form}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Pack Size</span>
              <span className="font-medium">{medicine.packSize}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Rating</span>
              <span className="text-yellow-500 font-medium">
                ⭐ {medicine.rating}/5
              </span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Price</span>
              <span className="text-green-600 font-bold text-base">
                $
                {(
                  medicine.price -
                  (medicine.price * medicine.discount) / 100
                ).toFixed(2)}
              </span>
            </p>
            {medicine.discount > 0 && (
              <p className="text-right text-xs text-gray-400 line-through">
                ${medicine.price.toFixed(2)}
              </p>
            )}
            <p className="flex justify-between">
              <span className="text-gray-600">Stock</span>
              {medicine.inStock ? (
                <span className="text-green-600 font-medium">
                  {medicine.quantity} available
                </span>
              ) : (
                <span className="text-red-500 font-medium">Out of Stock</span>
              )}
            </p>
          </CardContent>

          {/* Footer */}
          <CardFooter className="px-5">
            <div className="flex w-1/2justify-between items-center gap-2">
              <Button onClick={()=>addToCart(medicine)} className="w-full" disabled={!medicine.inStock}>
                {medicine.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
              <Button className="w-1/2">
                <Link className="" href={`/medicine/${medicine._id}`}>
                  Details
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
