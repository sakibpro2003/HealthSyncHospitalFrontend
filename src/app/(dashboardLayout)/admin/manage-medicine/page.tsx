/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  useGetAllMedicineQuery,
  useRemoveMedicineMutation,
} from "@/redux/features/product/productApi";

export const ManageMedicine = () => {
  const { data: medicinesData, isLoading, isError, refetch } =
    useGetAllMedicineQuery(undefined);

  const [removeMedicine] = useRemoveMedicineMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMedId, setSelectedMedId] = useState<string | null>(null);

  const itemsPerPage = 6;
  const medicines = medicinesData?.data || [];

  const handleDelete = async () => {
    if (!selectedMedId) return;
    try {
      await removeMedicine(selectedMedId).unwrap();
      setSelectedMedId(null);
      refetch(); 
    } catch (error) {
      console.error("Error deleting medicine:", error);
    }
  };

  const totalPages = Math.ceil(medicines.length / itemsPerPage);

  const paginatedMeds = medicines.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return <p className="text-gray-400">Loading medicines...</p>;
  }

  if (isError) {
    return <p className="text-red-500">Failed to fetch medicines.</p>;
  }

  return (
    <div className="lg:p-6 rounded-lg shadow-md">
      <div className="flex justify-between flex-wrap">
        <h1 className="text-2xl font-bold mb-4">Manage Medicines</h1>
        <div className="flex gap-2">
          <Link href={"/create-new-medicine"} className="btn-custom">
            Add New Medicine
          </Link>
        </div>
      </div>

      {medicines.length === 0 ? (
        <p className="text-gray-400">No medicines available.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse mt-10 border">
              <thead className="bg-black text-white">
                <tr>
                  <th className="p-3 border">Image</th>
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Description</th>
                  <th className="p-3 border">Price</th>
                  <th className="p-3 border">Quantity</th>
                  <th className="p-3 border">Manufacturer</th>
                  <th className="p-3 border">Update</th>
                  <th className="p-3 border">Delete</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMeds.map((med: any) => (
                  <tr key={med._id}>
                    <td className="p-3 border">
                      <Image
                        width={50}
                        height={50}
                        src={
                          med.image && med.image.startsWith("http")
                            ? med.image
                            : "/placeholder.jpg"
                        }
                        alt={med.name || "No Image"}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="p-3 border">{med.name}</td>
                    <td className="p-3 border truncate max-w-xs">
                      {med.description}
                    </td>
                    <td className="p-3 border">${med.price}</td>
                    <td className="p-3 border">{med.quantity} pcs</td>
                    <td className="p-3 border">
                      {typeof med.manufacturer === "string"
                        ? med.manufacturer
                        : med.manufacturer?.name || "Unknown"}
                    </td>
                    <td>
                      <Link className="btn-custom" href={`/update/${med._id}`}>
                        Update
                      </Link>
                    </td>
                    <td>
                      <button
                        className="btn-custom"
                        onClick={() => setSelectedMedId(med._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4 flex-wrap">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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

      {/* Confirm Delete Modal */}
      {selectedMedId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-black p-6 rounded-lg shadow-lg text-white">
            <h2 className="text-lg font-semibold">Confirm Delete</h2>
            <p>Are you sure you want to delete this medicine?</p>
            <div className="flex justify-end gap-2 mt-4">
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

export default ManageMedicine;
