"use client";

import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarClock,
  Droplet,
  Droplets,
  HeartPulse,
  Loader2,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useClientUser } from "@/hooks/useClientUser";
import {
  useCreateBloodRequestMutation,
  useGetBloodRequestsQuery,
  useGetInventorySummaryQuery,
} from "@/redux/features/bloodBank/bloodBankApi";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
] as const;

const STATUS_BADGE_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  approved: "default",
  fulfilled: "secondary",
  rejected: "destructive",
  cancelled: "outline",
};

type BloodRequestPriority = (typeof PRIORITIES)[number]["value"];
type BloodGroup = (typeof BLOOD_GROUPS)[number];

type BloodRequest = {
  _id: string;
  bloodGroup: BloodGroup;
  unitsRequested: number;
  priority: BloodRequestPriority;
  status: string;
  neededOn?: string;
  updatedAt?: string;
  notes?: string;
  reason?: string;
};

type InventorySummary = Record<string, number>;

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
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : format(date, "dd MMM yyyy, HH:mm");
};

const PatientBloodRequestsPage = () => {
  const { user, isLoading: isUserLoading } = useClientUser();
  const patientEmail = user?.email;

  const [form, setForm] = useState<RequestFormState>(initialFormState);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: inventoryData, isLoading: isInventoryLoading } = useGetInventorySummaryQuery();

  const {
    data: rawRequests,
    isLoading: isRequestsLoading,
    isFetching,
    refetch,
  } = useGetBloodRequestsQuery(patientEmail ? { requesterEmail: patientEmail } : undefined, {
    skip: !patientEmail,
  });

  const [createRequest, { isLoading: isSubmitting }] = useCreateBloodRequestMutation();

  const requests = useMemo<BloodRequest[]>(() => {
    return Array.isArray(rawRequests) ? (rawRequests as BloodRequest[]) : [];
  }, [rawRequests]);

  const inventory = useMemo<InventorySummary>(() => {
    return (inventoryData as InventorySummary | undefined) ?? {};
  }, [inventoryData]);

  const stats = useMemo(() => {
    const totalUnits = requests.reduce((sum, request) => sum + Number(request.unitsRequested ?? 0), 0);
    const pending = requests.filter((request) => request.status === "pending").length;
    const fulfilled = requests.filter((request) => request.status === "fulfilled" || request.status === "approved").length;

    return [
      {
        label: "Total units requested",
        value: totalUnits.toString(),
        tone: "bg-rose-100 text-rose-600",
        description: "Across all of your submissions",
        icon: Droplets,
      },
      {
        label: "Pending approvals",
        value: pending.toString(),
        tone: "bg-amber-100 text-amber-600",
        description: "Requests awaiting staff confirmation",
        icon: CalendarClock,
      },
      {
        label: "Fulfilled requests",
        value: fulfilled.toString(),
        tone: "bg-emerald-100 text-emerald-600",
        description: "Blood already arranged for you",
        icon: ShieldCheck,
      },
    ];
  }, [requests]);

  const handleChange = (field: keyof RequestFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!patientEmail) {
      toast.error("Please log in before submitting a request");
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
        requesterName: user?.name ?? "Patient",
        requesterEmail: patientEmail,
        requesterPhone: form.requesterPhone.trim() || undefined,
      }).unwrap();

      toast.success("Blood request submitted");
      setForm(initialFormState);
      setIsFormOpen(false);
      await refetch();
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : undefined;
      toast.error(message ?? "Unable to submit request right now");
    }
  };

  const isLoading = isUserLoading || isRequestsLoading;
  const hasRequests = requests.length > 0;

  return (
    <section className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-sky-100/60 py-12">
      <div className="mx-auto w-11/12 max-w-6xl space-y-10">
        <header className="overflow-hidden rounded-[34px] border border-white/70 bg-white/90 p-10 shadow-[0_40px_80px_-60px_rgba(236,72,153,0.35)] backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-rose-600">
                Blood Support Hub
              </span>
              <h1 className="text-4xl font-black text-slate-900 sm:text-5xl">
                Get the right blood, right on time
              </h1>
              <p className="text-base text-slate-600">
                Submit urgent blood requests, track approvals, and monitor inventory so you always know what’s available for your care.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 rounded-3xl border border-rose-100 bg-rose-50/80 px-6 py-5 text-sm text-rose-700 shadow-inner">
              <span className="text-xs uppercase tracking-[0.3em] text-rose-500">
                Signed in as
              </span>
              <p className="text-lg font-semibold text-rose-700">{user?.name ?? "Guest"}</p>
              <p className="text-xs text-rose-500">{user?.email ?? "—"}</p>
              <Badge variant="outline" className="border-rose-200 text-rose-600">
                {user?.role ?? "patient"}
              </Badge>
              <Button
                className="mt-2 rounded-full bg-rose-600 px-6 text-sm font-semibold text-white hover:bg-rose-700"
                onClick={() => setIsFormOpen(true)}
                disabled={!patientEmail}
              >
                Request blood
              </Button>
              {!patientEmail && (
                <p className="text-xs text-rose-400">Log in to submit a blood request.</p>
              )}
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {stats.map(({ label, value, description, tone, icon: Icon }) => (
            <article
              key={label}
              className="rounded-3xl border border-white/70 bg-white/95 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl ${tone}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
              <p className="mt-2 text-sm text-slate-500">{description}</p>
            </article>
          ))}
        </section>

        <Card className="border border-white/70 bg-white/95 shadow-lg backdrop-blur">
          <CardHeader className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900">Inventory snapshot</CardTitle>
              <CardDescription className="text-sm text-slate-500">
                Live view of our blood bank by group. Units update in real time as donations arrive and requests are fulfilled.
              </CardDescription>
            </div>
            <Badge className="rounded-full bg-slate-800/90 px-4 py-1 text-xs font-semibold text-white">
              Updated {isInventoryLoading ? "just now" : "moments ago"}
            </Badge>
          </CardHeader>
          <CardContent>
            {isInventoryLoading ? (
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                {BLOOD_GROUPS.map((group) => (
                  <div key={`inventory-skeleton-${group}`} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                ))}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                {BLOOD_GROUPS.map((group) => (
                  <div
                    key={group}
                    className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <p className="text-xs uppercase tracking-[0.4em] text-rose-500">{group}</p>
                    <p className="mt-3 text-3xl font-bold text-slate-900">{inventory[group] ?? 0}</p>
                    <p className="text-xs text-slate-500">Units available</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-white/70 bg-white/95 shadow-lg backdrop-blur">
          <CardHeader className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900">Request history</CardTitle>
              <CardDescription className="text-sm text-slate-500">
                Track approvals, fulfilment updates, and notes from our transfusion team.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500">
              <Droplet className="h-4 w-4 text-slate-400" />
              {isFetching ? "Refreshing…" : `${requests.length} request(s)`}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading requests…
              </div>
            ) : !hasRequests ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center text-sm text-slate-500">
                No blood requests yet. Use the button above to submit your first request.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      <TableHead>Blood group</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Needed on</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request._id} className="align-top">
                        <TableCell className="font-semibold text-slate-900">{request.bloodGroup}</TableCell>
                        <TableCell>{request.unitsRequested}</TableCell>
                        <TableCell className="capitalize">{request.priority}</TableCell>
                        <TableCell>
                          <Badge variant={STATUS_BADGE_VARIANT[request.status] ?? "outline"}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(request.neededOn)}</TableCell>
                        <TableCell>{formatDate(request.updatedAt)}</TableCell>
                        <TableCell className="max-w-xs text-sm text-slate-600">
                          {request.notes || request.reason || "—"}
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

      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent side="right" className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold text-slate-900">Submit a blood request</SheetTitle>
          </SheetHeader>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label>Blood group</Label>
              <Select value={form.bloodGroup} onValueChange={(value) => handleChange("bloodGroup", value)}>
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

            <div className="grid gap-2">
              <Label>Units needed</Label>
              <Input
                type="number"
                min={1}
                value={form.unitsRequested}
                onChange={(event) => handleChange("unitsRequested", event.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={(value) => handleChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
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

            <div className="grid gap-2">
              <Label>Needed on</Label>
              <Input
                type="datetime-local"
                value={form.neededOn}
                onChange={(event) => handleChange("neededOn", event.target.value)}
              />
              <p className="text-xs text-slate-500">
                Choose the latest acceptable transfusion time.
              </p>
            </div>

            <div className="grid gap-2">
              <Label>Reason / clinical notes</Label>
              <Textarea
                rows={4}
                placeholder="Provide any clinical context, diagnosis, or transfusion notes"
                value={form.reason}
                onChange={(event) => handleChange("reason", event.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Contact number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  className="pl-9"
                  placeholder="Emergency contact or bedside number"
                  value={form.requesterPhone}
                  onChange={(event) => handleChange("requesterPhone", event.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 rounded-2xl border border-rose-100 bg-rose-50/70 p-4 text-xs text-rose-600">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4" />
                <p>
                  Our transfusion team will contact you using the provided number. Keep your phone handy to confirm availability and transfusion logistics.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <HeartPulse className="h-4 w-4" />
                <p>URGENT requests should also be escalated via the ward nurse or hotline.</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isSubmitting || !patientEmail}>
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                  </span>
                ) : (
                  "Submit request"
                )}
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default PatientBloodRequestsPage;
