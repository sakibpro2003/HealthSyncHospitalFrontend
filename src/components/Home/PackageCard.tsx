"use client";
import { useGetAllhealthPackageQuery } from "@/redux/features/healthPackage/healthPackageApi";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import React, { useEffect, useMemo, useState } from "react";

const PackageCard = () => {
  const [user, setUser] = useState<{
    _id?: string;
    userId?: string,
    email?: string;
    name?: string;
    role?: string;
  } | null>(null);
  const { data } = useGetAllhealthPackageQuery(undefined);
  type HealthPackage = {
  _id: string;
  title: string;
  price: number;
  idealFor?: string;
  includes?: string[];
};

  const formatTaka = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(value);

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
        console.error("Not logged in",error);
      }
    };
    fetchUser();
  }, []);

  const packages = useMemo(() => data?.data?.result ?? [], [data]);

  return (
    <section className="relative mx-auto mt-16 w-7xl bg-gradient-to-b from-white via-violet-50/60 to-white py-16">
      <div className="mx-auto flex w-full flex-col gap-6 px-4 text-center sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-violet-500">
            Preventive Care
          </p>
          <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
            Health Checkup Packages
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
            Choose a plan that aligns with your lifestyle. Each package bundles
            essential screenings, ongoing support, and exclusive member perks
            so you can stay ahead of potential health risks.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {packages.map((single:HealthPackage, index:number) => {
            const isFeatured = index === 1;

            return (
              <article
                key={single._id}
                className={`group relative flex h-full flex-col rounded-3xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  isFeatured
                    ? "border-violet-200 bg-white/90 backdrop-blur-xl"
                    : "border-slate-200/80 bg-white/80 backdrop-blur"
                }`}
              >
                {isFeatured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white shadow-md">
                    Popular Choice
                  </span>
                )}

                <div className="flex flex-col gap-2 text-left">
                  <h3 className="text-xl font-semibold text-slate-900">
                    {single.title}
                  </h3>
                  {single.idealFor && (
                    <span className="w-fit rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-600">
                      {single.idealFor}
                    </span>
                  )}
                </div>

                <div className="mt-6 flex items-end justify-start gap-2">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {formatTaka(Number(single.price ?? 0))}
                  </span>
                  <span className="mb-1 text-sm font-medium uppercase tracking-[0.3em] text-slate-500">
                    /month
                  </span>
                </div>

                <ul className="mt-8 flex flex-1 flex-col gap-4 text-left">
                  {single.includes?.map((feature: string, idx: number) => (
                    <li key={`${single._id}-feature-${idx}`} className="flex gap-3">
                      <span className="mt-0.5 flex size-6 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                        <svg
                          className="size-3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="text-sm text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() =>
                    handleSubscription(single?._id, single?.title, single?.price)
                  }
                  className={`mt-8 w-full rounded-full py-3 text-sm font-semibold shadow-md transition ${
                    isFeatured
                      ? "bg-violet-600 text-white hover:bg-violet-700"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  Choose Plan
                </Button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PackageCard;
