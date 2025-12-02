"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Calendar,
  CircleDollarSign,
  Clock,
  Loader2,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useClientUser } from "@/hooks/useClientUser";
import {
  useCancelSubscriptionMutation,
  useGetSubscriptionsQuery,
} from "@/redux/features/subscription/subscriptionApi";

type SubscriptionPackage = {
  title?: string;
  price?: number;
  durationInDays?: number;
  includes?: string[];
};

type Subscription = {
  _id: string;
  status?: string;
  autoRenew?: boolean;
  startDate?: string;
  endDate?: string;
  package?: SubscriptionPackage;
};

const formatAmount = (value?: number) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
  }).format(Number.isFinite(value ?? NaN) ? Number(value) : 0);

const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
};

const formatStatus = (status?: string) => {
  if (!status) return "Unknown";
  return status
    .split("-")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
};

const statusTone: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  cancelled: "bg-rose-100 text-rose-700",
  expired: "bg-slate-200 text-slate-600",
};

const MySubscription = () => {
  const { user, isLoading: isUserLoading } = useClientUser();
  const patientId = user?.userId ?? user?._id;

  const {
    data: subscriptionData,
    isLoading: isSubscriptionLoading,
    isError,
    refetch,
    isFetching,
  } = useGetSubscriptionsQuery(patientId, {
    skip: !patientId,
  });

  const [cancelSubscription, { isLoading: isCancelling }] =
    useCancelSubscriptionMutation();

  const subscriptions = useMemo<Subscription[]>(() => {
    const rows = subscriptionData?.data;
    return Array.isArray(rows) ? (rows as Subscription[]) : [];
  }, [subscriptionData]);

  const activeSubscriptions = useMemo(
    () => subscriptions.filter((entry) => entry.status === "active"),
    [subscriptions]
  );

  const totalActiveSpend = useMemo(
    () =>
      activeSubscriptions.reduce(
        (acc, subscription) => acc + Number(subscription.package?.price ?? 0),
        0
      ),
    [activeSubscriptions]
  );

  const nextRenewalLabel = useMemo(() => {
    const dates = activeSubscriptions
      .map((entry) => entry.endDate)
      .filter(Boolean)
      .map((value) => new Date(value as string))
      .filter((date) => !Number.isNaN(date.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());
    if (!dates.length) {
      return "No renewals scheduled";
    }
    return dates[0].toLocaleDateString();
  }, [activeSubscriptions]);

  const stats = [
    {
      label: "Active plans",
      value: String(activeSubscriptions.length),
      description: "Subscriptions currently in good standing",
      tone: "bg-emerald-100 text-emerald-700",
      icon: ShieldCheck,
    },
    {
      label: "Monthly spend",
      value: `৳${formatAmount(totalActiveSpend)}`,
      description: "Combined value of your active plans",
      tone: "bg-violet-100 text-violet-600",
      icon: CircleDollarSign,
    },
    {
      label: "Next renewal",
      value: nextRenewalLabel,
      description: "Earliest upcoming billing date",
      tone: "bg-blue-100 text-blue-600",
      icon: RefreshCcw,
    },
  ];

  const isLoading = isUserLoading || isSubscriptionLoading || isFetching;
  const hasSubscriptions = subscriptions.length > 0;

  const handleCancelSubscription = async (id: string) => {
    try {
      await cancelSubscription(id).unwrap();
      toast.success("Subscription deactivated");
      await refetch();
    } catch (error) {
      console.error("Failed to cancel subscription", error);
      toast.error("We couldn’t cancel that subscription. Please try again.");
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-violet-100/40 py-12">
      <div className="mx-auto w-11/12 max-w-6xl space-y-10">
        <header className="overflow-hidden rounded-[34px] border border-white/70 bg-white/90 p-10 shadow-[0_40px_80px_-60px_rgba(79,70,229,0.45)] backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-violet-600">
                Membership Hub
              </span>
              <h1 className="text-4xl font-black text-slate-900 sm:text-5xl">
                Keep track of every care plan in one place
              </h1>
              <p className="text-base text-slate-600">
                Review active subscriptions, understand what each package includes, and stay ahead of renewal dates. Manage everything without leaving your dashboard.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 rounded-3xl border border-violet-100 bg-violet-50/60 px-6 py-5 text-sm text-violet-700 shadow-inner">
              <span className="text-xs uppercase tracking-[0.3em] text-violet-500">
                Signed in as
              </span>
              <p className="text-lg font-semibold text-violet-700">
                {user?.name ?? "Guest user"}
              </p>
              <p className="text-xs text-violet-500">{user?.email ?? "—"}</p>
              <Badge variant="outline" className="border-violet-200 text-violet-600">
                {user?.role ?? "patient"}
              </Badge>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {stats.map(({ label, value, description, tone, icon: Icon }) => (
            <article
              key={label}
              className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl ${tone}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                {label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {value}
              </p>
              <p className="mt-2 text-sm text-slate-500">{description}</p>
            </article>
          ))}
        </section>

        {isError && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-600">
            We couldn’t load your subscriptions. Please refresh the page or try again later.
          </div>
        )}

        {isLoading && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`subscription-skeleton-${index}`}
                className="h-64 animate-pulse rounded-3xl border border-white/70 bg-white/70"
              />
            ))}
          </div>
        )}

        {!isLoading && !isError && !hasSubscriptions && (
          <div className="rounded-[32px] border border-dashed border-violet-200 bg-white/80 p-12 text-center shadow-inner">
            <h2 className="text-2xl font-semibold text-slate-900">
              You don’t have any subscriptions yet
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Explore our tailored health plans to unlock exclusive follow-ups, diagnostics, and support services.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button asChild className="rounded-full bg-violet-600 px-6 text-sm font-semibold text-white hover:bg-violet-700">
                <Link href="/services">Browse packages</Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => refetch()}
                className="rounded-full border-violet-200 text-violet-600 hover:border-violet-300"
              >
                Refresh
              </Button>
            </div>
          </div>
        )}

        {!isLoading && hasSubscriptions && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {subscriptions.map((subscription) => {
              const pkg = subscription.package ?? {};
              const includes = Array.isArray(pkg.includes)
                ? pkg.includes.slice(0, 5)
                : [];
              const hasMore = Array.isArray(pkg.includes)
                ? pkg.includes.length > includes.length
                : false;
              const statusClass =
                statusTone[subscription.status ?? ""] ??
                "bg-slate-200 text-slate-600";

              return (
                <article
                  key={subscription._id}
                  className="group relative flex h-full flex-col gap-5 overflow-hidden rounded-[30px] border border-white/70 bg-white/95 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-400 to-emerald-400 opacity-0 transition group-hover:opacity-100" />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">
                        {pkg.title ?? "Unnamed package"}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        ৳{formatAmount(Number(pkg.price ?? 0))} · {pkg.durationInDays ?? "—"} day access
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass}`}
                    >
                      {formatStatus(subscription.status)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {includes.map((item, index) => (
                      <span
                        key={`${subscription._id}-feature-${index}`}
                        className="rounded-full bg-violet-100/80 px-3 py-1 text-xs font-medium text-violet-600"
                      >
                        {item}
                      </span>
                    ))}
                    {hasMore && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                        + more
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-600">
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-violet-500" />
                      <span>
                        {formatDate(subscription.startDate)} — {formatDate(subscription.endDate)}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-violet-500" />
                      <span>Auto renew {subscription.autoRenew ? "enabled" : "off"}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                      Plan ID: {subscription._id.slice(-6)}
                    </p>

                    {subscription.status === "active" ? (
                      <Button
                        variant="outline"
                        className="rounded-full border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50"
                        onClick={() => handleCancelSubscription(subscription._id)}
                        disabled={isCancelling}
                      >
                        {isCancelling ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing…
                          </span>
                        ) : (
                          "Deactivate"
                        )}
                      </Button>
                    ) : (
                      <Badge variant="outline" className="border-slate-200 text-slate-500">
                        Renewal paused
                      </Badge>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default MySubscription;
