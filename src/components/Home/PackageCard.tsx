"use client";
import { useGetAllhealthPackageQuery } from "@/redux/features/healthPackage/healthPackageApi";
import { useCreateSubscriptionMutation } from "@/redux/features/subscription/subscriptionApi";
import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useState } from "react";

const PackageCard = () => {
  const [user, setUser] = useState<{
    _id?:string,
    userId?: string,
    email?: string;
    name?: string;
    role?: string;
  } | null>(null);
  const { data } = useGetAllhealthPackageQuery(undefined);
  console.log(data, "package data");
  const [createSubscription] = useCreateSubscriptionMutation();

  const handleSubscription = async (
    packageId: string,
    title: string,
    price: number
  ) => {
    const resolvedUserId = user?.userId ?? user?._id;
    if (!resolvedUserId) {
      console.error("User must be logged in to subscribe");
      return;
    }

    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );

    const payload = {
      userId: resolvedUserId,
      email: user?.email,
      items: [
        {
          packageId,
          title,
          price,
          quantity: 1,
          type: "package" as const,
        },
      ],
    };
    console.log(payload, "package checkout payload");

    try {
      const res = await fetch(
        "http://localhost:5000/api/v1/payment/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();

      const result = await stripe?.redirectToCheckout({
        sessionId: data.data.id, // use the id from backend
      });

      if (result?.error) {
        console.error("Stripe redirect error:", result.error.message);
      }
      console.log("Subscribed:", res);
    } catch (err) {
      console.error("Error subscribing:", err);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        // console.log(data?.user?.userId,"user data")
        setUser(data.user);
      } catch (error) {
        console.error("Not logged in");
      }
    };
    fetchUser();
  }, []);
  console.log(user?.userId, "user data id ");

  return (
    <div className="mt-10">
      <h5 className="text-center font-bold text-3xl">
        Health Checkup Packages
      </h5>
      <div className="grid grid-cols-4 w-11/12 mx-auto gap-12">
        {data?.data?.result?.map((single) => (
          <div
            key={single._id}
            className="w-full flex flex-col mt-auto h-max max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700"
          >
            <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
              {single.title}
            </h5>
            <h5 className="mb-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
              {single.idealFor}
            </h5>
            <div className="flex items-baseline text-gray-900 dark:text-white">
              <span className="text-3xl font-semibold">TK</span>
              <span className="text-5xl font-extrabold tracking-tight">
                {single.price}
              </span>
              <span className="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">
                /month
              </span>
            </div>
            <ul className="space-y-5 my-7">
              {single.includes.map((e, index) => (
                <li key={index} className="flex">
                  <svg
                    className="shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                  </svg>
                  <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">
                    {e}
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={() =>
                handleSubscription(single?._id, single?.title, single?.price)
              }
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center"
            >
              Choose plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackageCard;
