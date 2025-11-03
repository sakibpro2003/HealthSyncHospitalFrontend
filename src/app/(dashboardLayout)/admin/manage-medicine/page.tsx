"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  useGetAllMedicineQuery,
  useRemoveMedicineMutation,
} from "@/redux/features/product/productApi";
import type { TProduct } from "@/types/product";

const ITEMS_PER_PAGE = 6;

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

const ManageMedicinePage = () => {
  const { data: medicinesData, isLoading, isError, refetch } =
    useGetAllMedicineQuery();
  const [removeMedicine] = useRemoveMedicineMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMedId, setSelectedMedId] = useState<string | null>(null);

  const medicines: TProduct[] = medicinesData?.data ?? [];
  const totalPages = Math.max(1, Math.ceil(medicines.length / ITEMS_PER_PAGE));

  const paginatedMeds = medicines.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
    return <p className="text-gray-400">Loading medicines...</p>;
  }

  if (isError) {
    return <p className="text-red-500">Failed to fetch medicines.</p>;
  }

  return (
    <div className="rounded-lg shadow-md lg:p-6">
      <div className="flex flex-wrap justify-between">
        <h1 className="mb-4 text-2xl font-bold">Manage Medicines</h1>
        <div className="flex gap-2">
          <Link href="/create-new-medicine" className="btn-custom">
            Add New Medicine
          </Link>
        </div>
      </div>

      {medicines.length === 0 ? (
        <p className="text-gray-400">No medicines available.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="mt-10 w-full border border-collapse">
              <thead className="bg-black text-white">
                <tr>
                  <th className="border p-3">Image</th>
                  <th className="border p-3">Name</th>
                  <th className="border p-3">Description</th>
                  <th className="border p-3">Price</th>
                  <th className="border p-3">Quantity</th>
                  <th className="border p-3">Manufacturer</th>
                  <th className="border p-3">Update</th>
                  <th className="border p-3">Delete</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMeds.map((med) => (
                  <tr key={med._id}>
                    <td className="border p-3">
                      <Image
                        width={50}
                        height={50}
                        src={
                          med.image?.startsWith("http")
                            ? med.image
                            : "/placeholder.jpg"
                        }
                        alt={med.name || "No Image"}
                        className="h-12 w-12 rounded object-cover"
                      />
                    </td>
                    <td className="border p-3">{med.name}</td>
                    <td className="max-w-xs truncate border p-3">
                      {med.description}
                    </td>
                    <td className="border p-3">
                      {med.price ? `$${med.price.toFixed(2)}` : "--"}
                    </td>
                    <td className="border p-3">{med.quantity} pcs</td>
                    <td className="border p-3">
                      {typeof med.manufacturer === "string"
                        ? med.manufacturer
                        : med.manufacturer?.name ?? "Unknown"}
                    </td>
                    <td className="border p-3">
                      <Link className="btn-custom" href={`/update/${med._id}`}>
                        Update
                      </Link>
                    </td>
                    <td className="border p-3">
                      <button
                        className="btn-custom"
                        onClick={() => setSelectedMedId(med._id ?? null)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between">
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={currentPage === 1}
              className="btn-custom disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="btn-custom disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {selectedMedId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="rounded-lg bg-black p-6 text-white shadow-lg">
            <h2 className="text-lg font-semibold">Confirm Delete</h2>
            <p>Are you sure you want to delete this medicine?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="btn border-none rounded-sm shadow-none"
                onClick={() => setSelectedMedId(null)}
              >
                Cancel
              </button>
              <button
                className="btn border-none rounded-sm shadow-none bg-red-600"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMedicinePage;
