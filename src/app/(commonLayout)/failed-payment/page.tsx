import React from "react";
import Link from "next/link";

const FailedPaymentPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md text-center">
        {/* Custom Failed Icon */}
        <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-red-100 rounded-full">
          <svg
            className="w-12 h-12 text-red-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-4 text-red-700">
          Payment Failed!
        </h1>
        <p className="text-gray-600 mb-6">
          Oops! Something went wrong with your transaction. Please try again.
        </p>
        <Link href="/cart">
          <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition">
            Go Back to Cart
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FailedPaymentPage;
