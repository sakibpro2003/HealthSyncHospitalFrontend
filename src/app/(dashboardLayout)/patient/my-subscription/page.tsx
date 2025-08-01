"use client";

import {
  useCancelSubscriptionMutation,
  useGetSubscriptionsQuery,
} from "@/redux/features/subscription/subscriptionApi";
import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  PackageSearch,
  ShieldCheck,
  Loader2,
} from "lucide-react";

const MySubscription = () => {

  const [cancelSubscription, { isLoading: isCancelling }] =
    useCancelSubscriptionMutation();

  const handleCancelSubscription = async(id)=>{
    try{
      const res = await cancelSubscription(id);
      console.log(res, "cance res data new")
    }catch(err){
      console.log(err)
    }
  }
  
  // console.log(cancelSubscription, "cancel result");
  const [user, setUser] = useState<{
    email?: string;
    name?: string;
    role?: string;
    userId?: string;
  } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("Not logged in");
      }
    };
    fetchUser();
  }, []);

  const {
    data: subscriptionData,
    isLoading,
    isError,
  } = useGetSubscriptionsQuery(user?.userId, {
    skip: !user?.userId,
  });

  const subscriptions = subscriptionData?.data || [];

  return (
    <div className="p-6 bg-gradient-to-tr from-blue-50 to-white min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
        <PackageSearch className="w-6 h-6 text-blue-500" />
        My Subscriptions
      </h2>

      {isLoading && (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="animate-spin w-5 h-5" /> Loading subscriptions...
        </div>
      )}
      {isError && (
        <div className="text-red-500">Failed to load subscriptions.</div>
      )}

      {!isLoading && subscriptions.length === 0 && (
        <div className="text-gray-500">No active subscriptions found.</div>
      )}

      <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {subscriptions.map((sub: any) => (
          <div
            key={sub._id}
            className="backdrop-blur-md bg-white/60 border border-gray-200 rounded-2xl shadow-md p-5 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold text-gray-800">
                {sub.package?.title}
              </h3>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  sub.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {sub.status}
              </span>
            </div>

            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(sub.startDate).toLocaleDateString()} →{" "}
              {new Date(sub.endDate).toLocaleDateString()}
            </p>

            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
              <Clock className="w-4 h-4" />
              {sub.package?.durationInDays} days
            </p>

            <p className="text-sm text-gray-600 mt-1">
              💰 <strong>৳{sub.package?.price}</strong>
            </p>

            <div className="mt-3">
              <p className="text-sm text-gray-700 font-medium mb-1">
                Includes:
              </p>
              <div className="flex flex-wrap gap-2">
                {sub.package?.includes
                  ?.slice(0, 4)
                  .map((item: string, i: number) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                {/* {sub.package?.includes?.length > 4 && (
                  <span className="text-gray-400 text-xs">+ more</span>
                )} */}
              </div>
            </div>

            <div className="mt-3 text-xs text-gray-500 flex items-center justify-between gap-1">
              <div className="flex">
                <ShieldCheck className="w-4 h-4" />
                Auto Renew: {sub.autoRenew ? "Yes" : "No"}
              </div>
              <div className="mt-4 flex justify-end">
                {sub.status === "active" && (
                  <button
                    onClick={() => handleCancelSubscription(sub._id)}
                    className="px-4 py-1.5 text-sm rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition"
                  >
                    Deactivate
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MySubscription;
