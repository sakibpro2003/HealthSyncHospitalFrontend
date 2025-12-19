"use client";
import { useGetAllhealthPackageQuery } from "@/redux/features/healthPackage/healthPackageApi";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import React, { useMemo } from "react";
import { useClientUser } from "@/hooks/useClientUser";
import { toast } from "sonner";

const PackageCard = () => {
  const { data } = useGetAllhealthPackageQuery(undefined);
  const { user, isLoading: isUserLoading } = useClientUser();
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
    if (isUserLoading) {
      toast.info("Checking your login status. Please try again in a moment.");
      return;
    }

    const resolvedUserId = user?.userId ?? user?._id;
    if (!resolvedUserId) {
      toast.error("Please log in to subscribe to a package.");
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

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        toast.error(errorBody?.message ?? "Unable to start checkout.");
        return;
      }

      const session = await res.json();

      const result = await stripe?.redirectToCheckout({
        sessionId: session?.data?.id,
      });

      if (result?.error) {
        toast.error(result.error.message ?? "Stripe redirect failed.");
      }
    } catch (err) {
      console.error("Error subscribing:", err);
      toast.error("Something went wrong while processing your request.");
    }
  };

  const packages = useMemo(() => data?.data?.result ?? [], [data]);

  return (
    <>
      <section
        className="relative mx-auto mt-14 w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8"
      >
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-50 via-white to-indigo-50" />
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.08),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.08),transparent_30%),radial-gradient(circle_at_10%_70%,rgba(99,102,241,0.07),transparent_28%)]" />
        <div className="absolute left-16 top-10 -z-10 h-28 w-28 rounded-full bg-violet-200/50 blur-3xl" />
        <div className="absolute bottom-0 right-8 -z-10 h-24 w-24 rounded-full bg-indigo-200/50 blur-3xl" />

        <div className="mx-auto flex flex-col gap-8 text-center">
          <div className="space-y-3">
            <p className="mx-auto w-fit rounded-full bg-violet-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-violet-700">
              Preventive Care
            </p>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
              Health Checkup Packages
            </h2>
            <p className="mx-auto mt-2 max-w-3xl text-base text-slate-600 sm:text-lg">
              Choose a plan that aligns with your lifestyle. Each package bundles essential screenings, ongoing support, and exclusive member perks so you can stay ahead of potential health risks.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {packages.map((single: HealthPackage, index: number) => {
              const isFeatured = index === 1;

              return (
                <article
                  key={single._id}
                  className={`relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-b from-white/90 via-white to-violet-50/60 p-6 shadow-md ring-1 ring-violet-100/70 backdrop-blur ${
                    isFeatured ? "shadow-violet-100 ring-violet-200" : ""
                  }`}
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/90 via-white/40 to-transparent" />
                  {isFeatured ? (
                    <span className="absolute right-4 top-4 rounded-full bg-violet-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-white shadow-md">
                      Popular Choice
                    </span>
                  ) : (
                    <span className="absolute right-4 top-4 rounded-full border border-violet-100 bg-white/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-violet-700 shadow-sm">
                      New Plan
                    </span>
                  )}

                  <div className="flex flex-col gap-2 text-left">
                    <h3 className="text-xl font-bold text-slate-900">
                      {single.title}
                    </h3>
                    {single.idealFor && (
                      <span className="w-fit rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                        {single.idealFor}
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-700 via-indigo-700 to-sky-600 px-4 py-3 text-white shadow-md ring-1 ring-violet-200/60">
                    <div>
                      <span className="block text-xs uppercase tracking-[0.25em] text-white/70">
                        Investment
                      </span>
                      <span className="text-3xl font-black">
                        {formatTaka(Number(single.price ?? 0))}
                      </span>
                      <span className="text-xs font-semibold text-white/70"> / month</span>
                    </div>
                    <div className="ml-auto rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold tracking-wide text-white">
                      No hidden fees
                    </div>
                  </div>

                  <ul className="mt-6 flex flex-1 flex-col gap-3 text-left">
                    {single.includes?.map((feature: string, idx: number) => (
                      <li key={`${single._id}-feature-${idx}`} className="flex gap-3">
                        <span className="mt-0.5 flex size-6 items-center justify-center rounded-full bg-violet-100 text-violet-700">
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
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
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

    </>
  );
};

export default PackageCard;
