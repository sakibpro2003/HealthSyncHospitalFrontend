"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { clearCart } from "@/utils/cart";

const SuccessPaymentPage = () => {
  useEffect(() => {
    clearCart();
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md text-center">
        {/* Custom Success Icon */}
        <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-green-100 rounded-full">
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-4 text-green-700">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your transaction has been completed
          successfully.
        </p>
        <Link href="/">
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition">
            Go to Homepage
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SuccessPaymentPage;
