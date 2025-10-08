"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  CreditCard,
  FileDown,
  Loader2,
  PiggyBank,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useClientUser } from "@/hooks/useClientUser";
import {
  useDownloadReceiptMutation,
  useGetPaymentsByUserQuery,
} from "@/redux/features/payment/paymentApi";

const statusStyles: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-rose-100 text-rose-600",
};

const typeLabels: Record<string, string> = {
  product: "Pharmacy",
  package: "Health package",
  appointment: "Appointment",
};

const formatAmount = (value?: number) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
  }).format(Number.isFinite(value ?? NaN) ? Number(value) : 0);

const formatDateTime = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};

const BillingPage = () => {
  const { user, isLoading: isUserLoading } = useClientUser();
  const patientId = user?.userId ?? user?._id;

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};
    if (statusFilter !== "all") {
      params.status = statusFilter;
    }
    if (typeFilter !== "all") {
      params.type = typeFilter;
    }
    return params;
  }, [statusFilter, typeFilter]);

  const {
    data,
    isLoading: isBillingLoading,
    isFetching,
    refetch,
  } = useGetPaymentsByUserQuery(
    { userId: patientId ?? "", params: queryParams },
    { skip: !patientId }
  );

  const [downloadReceipt, { isLoading: isDownloading }] =
    useDownloadReceiptMutation();

  const payments = useMemo(() => data?.payments ?? [], [data]);
  const summary = data?.summary;

  const filters = {
    status: ["all", "paid", "pending", "failed"] as const,
    type: ["all", "product", "package", "appointment"] as const,
  };

  const handleDownload = async (paymentId: string) => {
    try {
      const blob = await downloadReceipt(paymentId).unwrap();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `receipt-${paymentId}.txt`;
      anchor.click();
      URL.revokeObjectURL(url);
      toast.success("Receipt download started");
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : undefined;
      toast.error(message ?? "Unable to download receipt right now");
    }
  };

  const renderStatusBadge = (status: string) => (
    <Badge className={statusStyles[status] ?? "bg-slate-100 text-slate-600"}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );

  const isLoading = isUserLoading || isBillingLoading || isFetching;
  const hasPayments = payments.length > 0;

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-sky-100/50 py-12">
      <div className="mx-auto w-11/12 max-w-6xl space-y-8">
        <header className="overflow-hidden rounded-[34px] border border-white/70 bg-white/90 p-10 shadow-[0_40px_80px_-60px_rgba(14,165,233,0.35)] backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-sky-600">
                <Sparkles className="h-4 w-4" />
                Billing Center
              </span>
              <h1 className="text-4xl font-black text-slate-900 sm:text-5xl">
                All payments, one tidy ledger
              </h1>
              <p className="text-base text-slate-600">
                Track invoices, spot outstanding balances, and download official receipts whenever you need them. Filters make it easy to drill into the details.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 rounded-3xl border border-sky-100 bg-sky-50/70 px-6 py-5 text-sm text-sky-700 shadow-inner">
              <span className="text-xs uppercase tracking-[0.3em] text-sky-500">
                Signed in as
              </span>
              <p className="text-lg font-semibold text-sky-700">{user?.name ?? "Guest"}</p>
              <p className="text-xs text-sky-500">{user?.email ?? "—"}</p>
              <Badge variant="outline" className="border-sky-200 text-sky-600">
                {user?.role ?? "patient"}
              </Badge>
            </div>
          </div>
        </header>

        <section className="rounded-[30px] border border-white/70 bg-white/95 p-6 shadow-lg backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Filter ledger</h2>
              <p className="text-sm text-slate-500">Fine-tune the table below to surface the exact transactions you need.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.status.map((status) => (
                <Button
                  key={status}
                  size="sm"
                  variant={statusFilter === status ? "default" : "outline"}
                  onClick={() => setStatusFilter(status)}
                  disabled={isFetching}
                  className="rounded-full"
                >
                  {status === "all"
                    ? "All statuses"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
              {filters.type.map((type) => (
                <Button
                  key={type}
                  size="sm"
                  variant={typeFilter === type ? "default" : "outline"}
                  onClick={() => setTypeFilter(type)}
                  disabled={isFetching}
                  className="rounded-full"
                >
                  {type === "all" ? "All services" : typeLabels[type] ?? type}
                </Button>
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setStatusFilter("all");
                  setTypeFilter("all");
                  refetch();
                }}
                disabled={isFetching}
                className="rounded-full"
              >
                Refresh
              </Button>
            </div>
          </div>
        </section>

        {isLoading && (
          <div className="flex items-center gap-3 rounded-3xl border border-sky-100 bg-white/80 px-5 py-4 text-sm text-sky-600 shadow-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Fetching billing data…
          </div>
        )}

        {!isLoading && !hasPayments && (
          <div className="rounded-[32px] border border-dashed border-sky-200 bg-white/80 p-12 text-center shadow-inner">
            <h2 className="text-2xl font-semibold text-slate-900">Your ledger is clear</h2>
            <p className="mt-3 text-sm text-slate-600">
              We couldn’t find any transactions that match these filters. Try adjusting them or explore services to generate a new invoice.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button asChild className="rounded-full bg-sky-600 px-6 text-sm font-semibold text-white hover:bg-sky-700">
                <Link href="/services">Browse services</Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setStatusFilter("all");
                  setTypeFilter("all");
                  refetch();
                }}
                className="rounded-full border-sky-200 text-sky-600 hover:border-sky-300"
              >
                Reset filters
              </Button>
            </div>
          </div>
        )}

        {summary && (
          <section className="grid gap-4 md:grid-cols-3">
            <Card className="border border-white/70 bg-white/95 shadow-lg backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
                <div>
                  <CardTitle className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                    Total paid
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Successful invoices settled
                  </CardDescription>
                </div>
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-3xl font-bold text-slate-900">৳{formatAmount(summary.paidAmount)}</p>
                <p className="text-xs text-slate-500">{summary.paidCount} payment(s) completed</p>
              </CardContent>
            </Card>

            <Card className="border border-white/70 bg-white/95 shadow-lg backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
                <div>
                  <CardTitle className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                    Outstanding
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Amount awaiting payment
                  </CardDescription>
                </div>
                <CreditCard className="h-5 w-5 text-amber-600" />
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-3xl font-bold text-slate-900">৳{formatAmount(summary.pendingAmount)}</p>
                <p className="text-xs text-slate-500">{summary.pendingCount} invoice(s) open</p>
              </CardContent>
            </Card>

            <Card className="border border-white/70 bg-white/95 shadow-lg backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
                <div>
                  <CardTitle className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                    Failed charges
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Attempts that need review
                  </CardDescription>
                </div>
                <AlertCircle className="h-5 w-5 text-rose-600" />
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-3xl font-bold text-slate-900">৳{formatAmount(summary.failedAmount)}</p>
                <p className="text-xs text-slate-500">{summary.failedCount} payment(s) failed</p>
              </CardContent>
            </Card>
          </section>
        )}

        {hasPayments && (
          <Card className="border border-white/70 bg-white/95 shadow-lg backdrop-blur">
            <CardHeader className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900">Recent transactions</CardTitle>
                <CardDescription className="text-sm text-slate-500">
                  Receipts, clinics, pharmacy orders, and membership packages in one timeline.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500">
                <PiggyBank className="h-4 w-4 text-slate-400" />
                Updated just now
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50/60 text-left text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                      <th className="py-3 pr-4">Date</th>
                      <th className="py-3 pr-4">Description</th>
                      <th className="py-3 pr-4">Type</th>
                      <th className="py-3 pr-4 text-right">Amount</th>
                      <th className="py-3 pr-4">Status</th>
                      <th className="py-3 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => {
                      const createdAt = payment.paidAt ?? payment.createdAt;
                      const firstItem = payment.items[0];
                      const additionalCount = payment.items.length - 1;

                      return (
                        <tr
                          key={payment._id}
                          className="border-b last:border-b-0 transition hover:bg-slate-50"
                        >
                          <td className="whitespace-nowrap py-4 pr-4 text-sm text-slate-700">
                            {formatDateTime(createdAt)}
                          </td>
                          <td className="py-4 pr-4 text-sm text-slate-800">
                            <p className="font-semibold text-slate-900">
                              {firstItem?.title ?? "Payment"}
                            </p>
                            {additionalCount > 0 && (
                              <p className="text-xs text-slate-500">
                                + {additionalCount} additional item(s)
                              </p>
                            )}
                            {payment.reference && (
                              <p className="mt-1 text-xs text-slate-400">
                                Ref: {payment.reference}
                              </p>
                            )}
                          </td>
                          <td className="py-4 pr-4 text-sm text-slate-700">
                            <div className="flex flex-wrap gap-1">
                              {payment.items.map((item, index) => (
                                <Badge
                                  key={`${payment._id}-${index}`}
                                  variant="outline"
                                  className="capitalize"
                                >
                                  {typeLabels[item.type] ?? item.type}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 pr-4 text-right text-sm font-semibold text-slate-900">
                            ৳{formatAmount(payment.amount)}
                          </td>
                          <td className="py-4 pr-4">
                            {renderStatusBadge(payment.status)}
                          </td>
                          <td className="py-4 pr-4">
                            <div className="flex flex-wrap gap-2">
                              {payment.status === "paid" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDownload(payment._id)}
                                  disabled={isDownloading}
                                  className="rounded-full"
                                >
                                  {isDownloading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : (
                                    <FileDown className="mr-2 h-4 w-4" />
                                  )}
                                  Receipt
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default BillingPage;
