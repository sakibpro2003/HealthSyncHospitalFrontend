"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useCreateBloodRequestMutation,
  useGetBloodRequestsQuery,
  useGetInventorySummaryQuery,
} from "@/redux/features/bloodBank/bloodBankApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
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

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

const STATUS_BADGE: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  approved: "default",
  fulfilled: "secondary",
  rejected: "destructive",
  cancelled: "outline",
};

type RequestFormState = {
  bloodGroup: string;
  unitsRequested: string;
  priority: string;
  neededOn: string;
  reason: string;
  requesterPhone: string;
};

const initialFormState: RequestFormState = {
  bloodGroup: "",
  unitsRequested: "1",
  priority: "medium",
  neededOn: "",
  reason: "",
  requesterPhone: "",
};

const formatDate = (value?: string) => {
  if (!value) return "--";
  try {
    return format(new Date(value), "dd MMM yyyy, HH:mm");
  } catch (error) {
    return "--";
  }
};

const PatientBloodRequestsPage = () => {
  const [form, setForm] = useState<RequestFormState>(initialFormState);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) return;
        const data = await res.json();
        setUser(data.user ?? null);
      } catch (error) {
        console.error("Failed to load user", error);
      }
    };
    fetchUser();
  }, []);

  const summaryQuery = useGetInventorySummaryQuery();

  const {
    data: requests = [],
    refetch,
    isLoading: isLoadingRequests,
  } = useGetBloodRequestsQuery(
    user?.email ? { requesterEmail: user.email } : undefined,
    {
      skip: !user?.email,
    }
  );

  const [createRequest, { isLoading: isSubmitting }] =
    useCreateBloodRequestMutation();

  const availableUnits = useMemo(() => {
    const result: Record<string, number> = summaryQuery.data ?? {};
    return result;
  }, [summaryQuery.data]);

  const handleChange = (
    field: keyof RequestFormState,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user?.email) {
      toast.error("You must be logged in to request blood");
      return;
    }
    if (!form.bloodGroup) {
      toast.error("Select a blood group");
      return;
    }
    const units = Number(form.unitsRequested);
    if (!Number.isFinite(units) || units <= 0) {
      toast.error("Units must be greater than 0");
      return;
    }

    try {
      await createRequest({
        bloodGroup: form.bloodGroup,
        unitsRequested: units,
        priority: form.priority,
        neededOn: form.neededOn || undefined,
        reason: form.reason.trim() || undefined,
        requesterName: user.name ?? "Patient",
        requesterEmail: user.email,
        requesterPhone: form.requesterPhone.trim() || undefined,
      }).unwrap();
      toast.success("Blood request submitted");
      setForm(initialFormState);
      await refetch();
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Unable to submit request");
    }
  };

  return (
    <div className="space-y-8 p-6">
      <Card className="border border-emerald-200/60 shadow-sm">
        <CardHeader>
          <CardTitle>Available Blood Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          {summaryQuery.isLoading ? (
            <p className="text-sm text-slate-500">Loading inventory...</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {BLOOD_GROUPS.map((group) => (
                <div
                  key={group}
                  className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-center shadow-sm"
                >
                  <p className="text-xs uppercase tracking-[0.4em] text-violet-500">
                    {group}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {availableUnits[group] ?? 0}
                  </p>
                  <p className="text-xs text-slate-500">Units available</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border border-slate-200/70 shadow-sm">
        <CardHeader>
          <CardTitle>Request Blood</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>Blood Group</Label>
              <Select
                value={form.bloodGroup}
                onValueChange={(value) => handleChange("bloodGroup", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {BLOOD_GROUPS.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Units Needed</Label>
              <Input
                type="number"
                min={1}
                value={form.unitsRequested}
                onChange={(event) => handleChange("unitsRequested", event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(value) => handleChange("priority", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Needed On</Label>
              <Input
                type="datetime-local"
                value={form.neededOn}
                onChange={(event) => handleChange("neededOn", event.target.value)}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Reason / Notes</Label>
              <Input
                value={form.reason}
                onChange={(event) => handleChange("reason", event.target.value)}
                placeholder="Describe why the blood is needed"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Contact Number</Label>
              <Input
                value={form.requesterPhone}
                onChange={(event) => handleChange("requesterPhone", event.target.value)}
                placeholder="Phone number"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit" disabled={isSubmitting || !user?.email}>
                Submit request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border border-slate-200/70 shadow-sm">
        <CardHeader>
          <CardTitle>Your Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingRequests ? (
            <p className="text-sm text-slate-500">Loading requests...</p>
          ) : !requests || requests.length === 0 ? (
            <p className="text-sm text-slate-500">
              You have not submitted any blood requests yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Needed On</TableHead>
                    <TableHead>Updated At</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell>{request.bloodGroup}</TableCell>
                      <TableCell>{request.unitsRequested}</TableCell>
                      <TableCell className="capitalize">{request.priority}</TableCell>
                      <TableCell>
                        <Badge variant={STATUS_BADGE[request.status] ?? "outline"}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(request.neededOn)}</TableCell>
                      <TableCell>{formatDate(request.updatedAt)}</TableCell>
                      <TableCell className="max-w-xs text-sm text-slate-600">
                        {request.notes || request.reason || "--"}
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

export default PatientBloodRequestsPage;
