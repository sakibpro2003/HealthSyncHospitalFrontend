"use client";

import { useMemo, useState } from "react";
import {
  useGetBloodRequestsQuery,
  useUpdateBloodRequestStatusMutation,
} from "@/redux/features/bloodBank/bloodBankApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { format } from "date-fns";

const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

const STATUS_COLORS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  approved: "default",
  rejected: "destructive",
  fulfilled: "secondary",
  cancelled: "outline",
};

const PRIORITY_COPY: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

const formatDate = (value?: string) => {
  if (!value) return "--";
  try {
    return format(new Date(value), "dd MMM yyyy, HH:mm");
  } catch (error) {
    return "--";
  }
};

const AdminBloodRequestsPage = () => {
  const [filters, setFilters] = useState({
    status: "all",
    bloodGroup: "all",
    search: "",
  });
  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};
    if (filters.status !== "all") params.status = filters.status;
    if (filters.bloodGroup !== "all") params.bloodGroup = filters.bloodGroup;
    if (filters.search) {
      if (filters.search.includes("@")) {
        params.requesterEmail = filters.search;
      } else {
        params.requesterPhone = filters.search;
      }
    }
    return params;
  }, [filters]);

  const { data: requests = [], isLoading, refetch } =
    useGetBloodRequestsQuery(queryParams);

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateBloodRequestStatusMutation();

  const groupedRequests = useMemo(() => {
    return requests.reduce<Record<string, typeof requests>>((acc, request) => {
      acc[request.status] = acc[request.status] || [];
      acc[request.status].push(request);
      return acc;
    }, {});
  }, [requests]);

  const handleStatusChange = async (
    id: string,
    status: "approved" | "rejected" | "fulfilled" | "cancelled",
  ) => {
    try {
      await updateStatus({ id, data: { status } }).unwrap();
      toast.success(`Request ${status}`);
      await refetch();
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Failed to update request");
    }
  };

  return (
    <div className="space-y-8 p-6">
      <Card className="border border-slate-200/70 shadow-sm">
        <CardHeader>
          <CardTitle>Filter Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Select
                value={filters.bloodGroup}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, bloodGroup: value }))
                }
              >
                <SelectTrigger id="bloodGroup">
                  <SelectValue placeholder="All groups" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {BLOOD_GROUPS.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Email or phone"
                value={filters.search}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, search: event.target.value }))
                }
              />
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFilters({ status: "all", bloodGroup: "all", search: "" });
                }}
              >
                Reset filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading requests...</p>
      ) : requests.length === 0 ? (
        <Card className="border border-dashed border-slate-300 bg-white/80 shadow-none">
          <CardContent className="py-12 text-center text-slate-500">
            No blood requests match the filters.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {Object.entries(groupedRequests).map(([status, items]) => (
            <Card key={status} className="border border-slate-200/60 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold capitalize">
                  {status} ({items.length})
                </CardTitle>
                <Badge variant={STATUS_COLORS[status] ?? "outline"}>
                  {status}
                </Badge>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Requester</TableHead>
                      <TableHead>Blood Group</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Needed</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((request) => (
                      <TableRow key={request._id}>
                        <TableCell>
                          <div className="flex flex-col text-sm">
                            <span className="font-medium text-slate-800">
                              {request.requesterName}
                            </span>
                            <span className="text-xs text-slate-500">
                              {request.requesterEmail || request.requesterPhone || "--"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{request.bloodGroup}</TableCell>
                        <TableCell>{request.unitsRequested}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {PRIORITY_COPY[request.priority] ?? request.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(request.neededOn)}</TableCell>
                        <TableCell className="max-w-xs text-sm text-slate-600">
                          {request.reason || "--"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={STATUS_COLORS[request.status] ?? "outline"}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="space-x-2 whitespace-nowrap">
                          {request.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                disabled={isUpdating}
                                onClick={() => handleStatusChange(request._id, "approved")}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={isUpdating}
                                onClick={() => handleStatusChange(request._id, "rejected")}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {request.status === "approved" && (
                            <Button
                              size="sm"
                              disabled={isUpdating}
                              onClick={() => handleStatusChange(request._id, "fulfilled")}
                            >
                              Mark fulfilled
                            </Button>
                          )}
                          {request.status === "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isUpdating}
                              onClick={() => handleStatusChange(request._id, "cancelled")}
                            >
                              Cancel
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBloodRequestsPage;
