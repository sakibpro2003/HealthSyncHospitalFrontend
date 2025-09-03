"use client"
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetSingleProductQuery, useUpdateProductMutation } from "@/redux/features/product/productApi";
import { toast } from "sonner";

type ProductType = {
  _id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  quantity: number;
  inStock: boolean;
  requiredPrescription: boolean;
  expiryDate: string;
  manufacturer: {
    name: string;
    address: string;
    contact: string;
  };
};

const UpdateProductPage = () => {
  const router = useRouter();
  const { updateId } = useParams();

  const { data: productData, isLoading, error } = useGetSingleProductQuery(updateId as string, {
    skip: !updateId,
  });

  const [updateProduct] = useUpdateProductMutation(updateId);

  // ✅ Use typed state
  const [product, setProduct] = useState<ProductType | null>(null);

  useEffect(() => {
    if (productData?.data) {
      setProduct(productData.data);
    }
  }, [productData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";

    setProduct((prev) =>
      prev
        ? { ...prev, [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value }
        : prev
    );
  };

  const handleManufacturerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setProduct((prev) =>
      prev
        ? { ...prev, manufacturer: { ...prev.manufacturer, [name]: value } }
        : prev
    );
  };

  const handleUpdate = async () => {
    if (!product) return;

    try {
      const result = await updateProduct({ id: updateId, product }).unwrap();
      // toast.success("Medicine updated successfully");
      console.log(result, "Update result");
      // router.push("/manage-medicines");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update medicine");
    }
  };

  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Failed to load product.</p>;

  return (
    <div className="p-2 bg-gray-50 rounded-lg shadow-xl w-full mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 text-center">Update Product</h1>

      {product && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Product Name */}
          <div>
            <label className="font-semibold text-gray-700 mb-2 block">Product Name</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="input input-bordered w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold text-gray-700 mb-2 block">Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Price */}
          <div>
            <label className="font-semibold text-gray-700 mb-2 block">Price</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="input input-bordered w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="font-semibold text-gray-700 mb-2 block">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              className="input input-bordered w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label className="font-semibold text-gray-700 mb-2 block">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={product.expiryDate?.split("T")[0] || ""}
              onChange={handleChange}
              className="input input-bordered w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="font-semibold text-gray-700 mb-2 block">Image URL</label>
            <input
              type="text"
              name="image"
              value={product.image}
              onChange={handleChange}
              className="input input-bordered w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* In Stock */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="inStock"
              checked={product.inStock}
              onChange={handleChange}
              className="checkbox checkbox-neutral"
            />
            <label className="font-semibold text-gray-700">In Stock</label>
          </div>

          {/* Requires Prescription */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="requiredPrescription"
              checked={product.requiredPrescription}
              onChange={handleChange}
              className="checkbox checkbox-primary"
            />
            <label className="font-semibold text-gray-700">Requires Prescription</label>
          </div>

          {/* Manufacturer Name */}
          <div>
            <label className="font-semibold text-gray-700 mb-2 block">Manufacturer Name</label>
            <input
              type="text"
              name="name"
              value={product.manufacturer.name}
              onChange={handleManufacturerChange}
              className="input input-bordered w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Manufacturer Address */}
          <div>
            <label className="font-semibold text-gray-700 mb-2 block">Manufacturer Address</label>
            <input
              type="text"
              name="address"
              value={product.manufacturer.address}
              onChange={handleManufacturerChange}
              className="input input-bordered w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Manufacturer Contact */}
          <div>
            <label className="font-semibold text-gray-700 mb-2 block">Manufacturer Contact</label>
            <input
              type="text"
              name="contact"
              value={product.manufacturer.contact}
              onChange={handleManufacturerChange}
              className="input input-bordered w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      <div className="flex justify-center mt-6">
        <button
          className="btn btn-primary py-2 px-6 bg-black hover:bg-black/60 text-white rounded-lg shadow-md focus:ring-2 focus:ring-blue-500"
          onClick={handleUpdate}
          disabled={!product}
        >
          Update Product
        </button>
      </div>
    </div>
  );
};

export default UpdateProductPage;
