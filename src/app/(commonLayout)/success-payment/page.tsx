"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { clearCart } from "@/utils/cart";

type PaymentState = "loading" | "success" | "error";

const SuccessPaymentContent = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [state, setState] = useState<PaymentState>("loading");

  useEffect(() => {
    const confirm = async () => {
      if (!sessionId) {
        setState("error");
        return;
      }

      try {
        const res = await fetch(
          "http://localhost:5000/api/v1/payment/confirm",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sessionId }),
          }
        );

        if (!res.ok) {
          throw new Error("Payment confirmation failed");
        }

        clearCart();
        setState("success");
      } catch (error) {
        console.error(error);
        setState("error");
      }
    };

    confirm();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md text-center">
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

        {state === "loading" && (
          <>
            <h1 className="text-3xl font-bold mb-4 text-green-700">
              Finalizing Payment...
            </h1>
            <p className="text-gray-600 mb-6">
              Please wait while we confirm your transaction.
            </p>
          </>
        )}

        {state === "success" && (
          <>
            <h1 className="text-3xl font-bold mb-4 text-green-700">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your transaction has been completed
              successfully.
            </p>
          </>
        )}

        {state === "error" && (
          <>
            <h1 className="text-3xl font-bold mb-4 text-red-600">
              Unable to Confirm Payment
            </h1>
            <p className="text-gray-600 mb-6">
              We could not verify your payment. Please contact support if the
              amount has been deducted.
            </p>
          </>
        )}

        <Link href="/">
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition">
            Go to Homepage
          </button>
        </Link>
      </div>
    </div>
  );
};

const SuccessPaymentPage = () => (
  <Suspense
    fallback={
      <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4 text-green-700">
            Finalizing Payment...
          </h1>
          <p className="text-gray-600">
            Please wait while we confirm your transaction.
          </p>
        </div>
      </div>
    }
  >
    <SuccessPaymentContent />
  </Suspense>
);

export default SuccessPaymentPage;
