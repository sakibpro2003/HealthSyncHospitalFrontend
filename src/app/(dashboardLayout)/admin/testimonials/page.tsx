"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loader from "@/components/shared/Loader";
import {
  TestimonialStatus,
  useGetTestimonialsQuery,
  useUpdateTestimonialStatusMutation,
} from "@/redux/features/testimonial/testimonialApi";
import { CheckCircle2, XCircle, Clock3, Sparkles } from "lucide-react";

const STATUS_BADGES: Record<TestimonialStatus, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-rose-50 text-rose-700 ring-rose-200",
};

const extractErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as { data?: { message?: unknown } }).data?.message === "string"
  ) {
    return (error as { data: { message: string } }).data.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

const formatDate = (value?: string) => {
  if (!value) return "--";
  try {
    return format(new Date(value), "dd MMM yyyy, HH:mm");
  } catch {
    return "--";
  }
};

const AdminTestimonialsPage = () => {
  const [filters, setFilters] = useState({ status: "pending", search: "" });

  const query = useMemo(() => {
    const params: Record<string, string | number> = { limit: 50 };
    if (filters.status !== "all") params.status = filters.status;
    if (filters.search) params.searchTerm = filters.search;
    return params;
  }, [filters]);

  const { data, isLoading, isError, refetch } = useGetTestimonialsQuery(query);
  const testimonials = data?.result ?? [];

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateTestimonialStatusMutation();

  const handleStatusChange = async (
    id: string,
    status: TestimonialStatus
  ) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success(`Testimonial ${status}`);
      refetch();
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error, "Failed to update status"));
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-emerald-700 ring-1 ring-emerald-200">
            <Sparkles className="h-4 w-4" />
            Patient voices
          </p>
          <h1 className="text-2xl font-bold text-slate-900">Testimonial approval</h1>
          <p className="text-sm text-slate-600">
            Review what patients share and choose what appears on the homepage.
          </p>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm sm:flex-row sm:items-center sm:gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger id="status" className="w-full min-w-[160px]">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Name, email or keywords"
              value={filters.search}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, search: event.target.value }))
              }
              className="min-w-[240px]"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => setFilters({ status: "pending", search: "" })}
          >
            Reset
          </Button>
        </div>
      </div>

      <Card className="border border-slate-200/80 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Submissions</CardTitle>
            <p className="text-sm text-slate-600">{testimonials.length} item(s)</p>
          </div>
          <Badge className="rounded-full bg-violet-100 text-violet-700 ring-1 ring-violet-200">
            Homepage ready after approval
          </Badge>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loader fullScreen={false} label="Loading testimonials" />
          ) : isError ? (
            <p className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              Unable to load testimonials right now.
            </p>
          ) : testimonials.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
              No testimonials match the current filters.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testimonials.map((testimonial) => (
                    <TableRow key={testimonial._id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-slate-900">
                            {testimonial.patientName ?? "Unknown"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {testimonial.patientEmail ?? "-"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[320px] text-sm text-slate-700">
                        {testimonial.content}
                      </TableCell>
                      <TableCell>
                        <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                          <Sparkles className="h-4 w-4" />
                          {testimonial.rating ?? 5}/5
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${STATUS_BADGES[testimonial.status]}`}
                        >
                          {testimonial.status.charAt(0).toUpperCase() + testimonial.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {formatDate(testimonial.createdAt ?? testimonial.updatedAt)}
                      </TableCell>
                      <TableCell className="space-x-2 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isUpdating || testimonial.status === "approved"}
                          onClick={() => handleStatusChange(testimonial._id, "approved")}
                        >
                          <CheckCircle2 className="mr-1 h-4 w-4" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-rose-700 hover:text-rose-800"
                          disabled={isUpdating || testimonial.status === "rejected"}
                          onClick={() => handleStatusChange(testimonial._id, "rejected")}
                        >
                          <XCircle className="mr-1 h-4 w-4" /> Reject
                        </Button>
                        {testimonial.status !== "pending" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled={isUpdating}
                            onClick={() => handleStatusChange(testimonial._id, "pending")}
                          >
                            <Clock3 className="mr-1 h-4 w-4" /> Mark pending
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTestimonialsPage;
