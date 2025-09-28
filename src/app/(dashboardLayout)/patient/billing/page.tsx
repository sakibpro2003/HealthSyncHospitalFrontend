"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  useDownloadReceiptMutation,
  useGetPaymentsByUserQuery,
} from "@/redux/features/payment/paymentApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CreditCard,
  TrendingUp,
  AlertCircle,
  FileDown,
} from "lucide-react";

interface AuthedUser {
  userId?: string;
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
}

const statusBadges: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-rose-100 text-rose-700",
};

const typeLabels: Record<string, string> = {
  product: "Pharmacy",
  package: "Health Package",
  appointment: "Appointment",
};

const BillingPage = () => {
  const [user, setUser] = useState<AuthedUser | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

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

  const effectiveUserId = useMemo(
    () => user?.userId ?? user?._id ?? "",
    [user]
  );

  const params = useMemo(() => {
    const queries: Record<string, string> = {};
    if (statusFilter !== "all") {
      queries.status = statusFilter;
    }
    if (typeFilter !== "all") {
      queries.type = typeFilter;
    }
    return queries;
  }, [statusFilter, typeFilter]);

  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useGetPaymentsByUserQuery(
    { userId: effectiveUserId, params },
    { skip: !effectiveUserId }
  );

  const [downloadReceipt, { isLoading: isDownloading }] =
    useDownloadReceiptMutation();

  const payments = data?.payments ?? [];
  const summary = data?.summary;

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
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.data?.message || "Unable to download receipt right now"
      );
    }
  };

  const renderStatusBadge = (status: string) => (
    <Badge className={statusBadges[status] ?? "bg-slate-100 text-slate-600"}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );

  return (
    <div className="p-6 bg-gradient-to-tr from-sky-50 via-white to-blue-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            Billing & Receipts
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review all your paid invoices, upcoming charges, and download
            receipts for your records.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all", "paid", "pending", "failed"] as const).map((status) => (
            <Button
              key={status}
              size="sm"
              variant={statusFilter === status ? "default" : "outline"}
              onClick={() => setStatusFilter(status)}
              disabled={isFetching}
            >
              {status === "all"
                ? "All"
                : status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
          {(["all", "product", "package", "appointment"] as const).map(
            (type) => (
              <Button
                key={type}
                size="sm"
                variant={typeFilter === type ? "default" : "outline"}
                onClick={() => setTypeFilter(type)}
                disabled={isFetching}
              >
                {type === "all"
                  ? "All Services"
                  : typeLabels[type] ?? type}
              </Button>
            )
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setStatusFilter("all");
              setTypeFilter("all");
              refetch();
            }}
            disabled={isFetching}
          >
            Refresh
          </Button>
        </div>
      </div>

      {(isLoading || isFetching) && (
        <div className="flex items-center gap-2 text-gray-500 mb-4">
          <Loader2 className="animate-spin w-5 h-5" /> Fetching billing data...
        </div>
      )}

      {summary && (
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Paid
              </CardTitle>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-gray-900">
                ৳{summary.paidAmount.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                {summary.paidCount} successful payment(s)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Outstanding
              </CardTitle>
              <CreditCard className="w-5 h-5 text-amber-600" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-gray-900">
                ৳{summary.pendingAmount.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                {summary.pendingCount} pending bill(s)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Failed Charges
              </CardTitle>
              <AlertCircle className="w-5 h-5 text-rose-600" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-gray-900">
                ৳{summary.failedAmount.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                {summary.failedCount} attempt(s) require attention
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="bg-white/90 border border-slate-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No transactions found for the selected filters.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2">Date</th>
                    <th className="py-2">Description</th>
                    <th className="py-2">Type</th>
                    <th className="py-2 text-right">Amount</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => {
                    const createdAt = payment.paidAt ?? payment.createdAt;
                    const displayDate = createdAt
                      ? new Date(createdAt).toLocaleString()
                      : "--";
                    const firstItem = payment.items[0];
                    const additionalCount = payment.items.length - 1;
                    return (
                      <tr
                        key={payment._id}
                        className="border-b last:border-b-0 hover:bg-slate-50"
                      >
                        <td className="py-3 text-gray-700">{displayDate}</td>
                        <td className="py-3 text-gray-700">
                          <div className="font-medium text-gray-800">
                            {firstItem?.title ?? "Payment"}
                          </div>
                          {additionalCount > 0 && (
                            <div className="text-xs text-gray-500">
                              + {additionalCount} additional item(s)
                            </div>
                          )}
                        </td>
                        <td className="py-3 text-gray-600">
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
                        <td className="py-3 text-right font-semibold text-gray-900">
                          ৳{payment.amount.toFixed(2)}
                        </td>
                        <td className="py-3">
                          {renderStatusBadge(payment.status)}
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            {payment.status === "paid" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownload(payment._id)}
                                disabled={isDownloading}
                              >
                                <FileDown className="w-4 h-4 mr-1" /> Receipt
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingPage;
