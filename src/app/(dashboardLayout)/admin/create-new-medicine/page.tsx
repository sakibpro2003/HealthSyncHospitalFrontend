"use client";

import React, { useState } from "react";
import { useCreateProductMutation } from "@/redux/features/product/productApi";

import { toast } from "sonner";

const ProductForm = () => {
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const [product, setProduct] = useState({
    name: "",
    image: "",
    description: "",
    price: 0,
    quantity: 0,
    inStock: true,
    requiredPrescription: false,
    expiryDate: "",
    rating: 0,
    discount: 0,
    packSize: "",
    dosage: "",
    category: "Painkiller", // default
    manufacturer: {
      name: "",
      address: "",
      contact: "",
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;

    if (name.includes("manufacturer.")) {
      const field = name.split(".")[1];
      setProduct((prev) => ({
        ...prev,
        manufacturer: { ...prev.manufacturer, [field]: value },
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...product,
        price: Number(product.price),
        quantity: Number(product.quantity),
        rating: Number(product.rating),
        discount: Number(product.discount),
        expiryDate: new Date(product.expiryDate),
      };

      await createProduct(payload).unwrap();
      toast.success("Medicine added successfully");
      // router.push("/manage-medicines");
    } catch (err) {
      toast.error("Failed to create medicine");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-auto">
      <div className="max-w-4xl w-full p-6 bg-white shadow-lg rounded-lg border border-gray-300">
        <h2 className="text-2xl font-bold mb-6 text-center">Create New Medicine</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Medicine Name</label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Image URL</label>
              <input
                type="text"
                name="image"
                value={product.image}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Price</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={product.quantity}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={product.discount}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="inStock"
                checked={product.inStock}
                onChange={handleChange}
              />
              <label className="text-sm font-medium">In Stock</label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="requiredPrescription"
                checked={product.requiredPrescription}
                onChange={handleChange}
              />
              <label className="text-sm font-medium">Requires Prescription</label>
            </div>

            <div>
              <label className="block text-sm font-medium">Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                value={product.expiryDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Rating (1-5)</label>
              <input
                type="number"
                name="rating"
                min="1"
                max="5"
                value={product.rating}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Pack Size</label>
              <input
                type="text"
                name="packSize"
                value={product.packSize}
                onChange={handleChange}
                placeholder="e.g., 10 tablets"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Dosage</label>
              <input
                type="text"
                name="dosage"
                value={product.dosage}
                onChange={handleChange}
                placeholder="e.g., 500mg"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Category</label>
              <select
                name="category"
                value={product.category}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="Painkiller">Painkiller</option>
                <option value="Antibiotic">Antibiotic</option>
                <option value="Cold">Cold</option>
                <option value="Vitamin">Vitamin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Manufacturer Name</label>
              <input
                type="text"
                name="manufacturer.name"
                value={product.manufacturer.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Manufacturer Address</label>
              <input
                type="text"
                name="manufacturer.address"
                value={product.manufacturer.address}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Manufacturer Contact</label>
              <input
                type="text"
                name="manufacturer.contact"
                value={product.manufacturer.contact}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-span-2">
            <button
              type="submit"
              className={`w-full p-2 rounded-lg ${
                isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-black"
              } text-white hover:bg-black/60`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <div className="animate-spin border-t-2 border-white w-6 h-6 rounded-full"></div>
                  <span className="ml-2">Creating...</span>
                </div>
              ) : (
                "Create Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
