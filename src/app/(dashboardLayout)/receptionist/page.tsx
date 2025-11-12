"use client";

import Loader from "@/components/shared/Loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IPatient,
  useGetAllPatientQuery,
} from "@/redux/features/patient/patientApi";
import { cn } from "@/lib/utils";
import {
  Activity,
  ArrowUpRight,
  CalendarClock,
  Plus,
  RefreshCcw,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

type MonthBucket = {
  label: string;
  key: string;
  count: number;
};

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const ReceptionistPatientInsightsPage = () => {
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetAllPatientQuery({
    page: 1,
    limit: 100,
    searchTerm: "",
  });

  const patients = data?.result ?? [];
  const totalPatients = data?.meta?.total ?? patients.length;

  const normalizeDate = (value?: string | Date | null) => {
    if (!value) return undefined;
    const date =
      typeof value === "string" || value instanceof Date
        ? new Date(value)
        : undefined;
    return Number.isNaN(date?.getTime() ?? NaN) ? undefined : date;
  };

  const monthlyBuckets: MonthBucket[] = useMemo(() => {
    const formatter = new Intl.DateTimeFormat("en-US", { month: "short" });
    const now = new Date();
    const buckets: MonthBucket[] = Array.from({ length: 6 }).map((_, index) => {
      const monthDate = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (5 - index), 1, 0, 0, 0),
      );
      return {
        key: `${monthDate.getUTCFullYear()}-${monthDate.getUTCMonth()}`,
        label: formatter.format(monthDate),
        count: 0,
      };
    });

    const bucketMap = new Map<string, MonthBucket>(
      buckets.map((bucket) => [bucket.key, bucket]),
    );

    patients.forEach((patient) => {
      const timestamp =
        normalizeDate(patient.createdAt) ?? normalizeDate(patient.updatedAt);
      if (!timestamp) return;
      const key = `${timestamp.getUTCFullYear()}-${timestamp.getUTCMonth()}`;
      const bucket = bucketMap.get(key);
      if (bucket) {
        bucket.count += 1;
      }
    });

    return buckets;
  }, [patients]);

  const monthlyValues = monthlyBuckets.map((bucket) => bucket.count);
  const maxMonthlyValue =
    monthlyValues.length > 0 ? Math.max(...monthlyValues, 1) : 1;
  const sparklinePoints = monthlyValues
    .map((value, index) => {
      const x =
        monthlyValues.length > 1
          ? (index / (monthlyValues.length - 1)) * 100
          : 0;
      const y = 100 - (value / maxMonthlyValue) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  const genderStats = useMemo(() => {
    const male = patients.filter(
      (patient) => patient.gender?.toLowerCase() === "male",
    ).length;
    const female = patients.filter(
      (patient) => patient.gender?.toLowerCase() === "female",
    ).length;
    const other = patients.length - male - female;
    const total = Math.max(male + female + other, 1);
    return {
      male,
      female,
      other,
      femalePercent: Math.round((female / total) * 100),
      malePercent: Math.round((male / total) * 100),
    };
  }, [patients]);

  const bloodGroupStats = useMemo(() => {
    const counts = BLOOD_GROUPS.map((group) => ({
      group,
      count: patients.filter((patient) => patient.bloodGroup === group).length,
    }));
    const total = Math.max(
      counts.reduce((sum, current) => sum + current.count, 0),
      1,
    );
    return counts.map((entry) => ({
      ...entry,
      percent: Math.round((entry.count / total) * 100),
    }));
  }, [patients]);

  const recentPatients = useMemo(() => {
    return [...patients]
      .map((patient) => ({
        ...patient,
        created:
          normalizeDate(patient.createdAt) ??
          normalizeDate(patient.updatedAt) ??
          new Date(),
      }))
      .sort((a, b) => b.created.getTime() - a.created.getTime())
      .slice(0, 5);
  }, [patients]);

  if (isLoading) {
    return (
      <div className="p-10">
        <Loader fullScreen={false} label="Loading patient insights" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10">
        <Card className="border-rose-100 bg-rose-50/60">
          <CardHeader>
            <CardTitle className="text-rose-900">
              Unable to load patient summary
            </CardTitle>
            <CardDescription className="text-rose-700">
              The analytics endpoint is unavailable right now. Try refreshing or
              check your network connection.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={() => refetch()}>
              <RefreshCcw className="h-4 w-4" />
              Retry
            </Button>
            <Link href="/receptionist/patient-register">
              <Button variant="outline">Go to patient register</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const monthGrowth = monthlyBuckets[monthlyBuckets.length - 1]?.count ?? 0;
  const previousMonth = monthlyBuckets[monthlyBuckets.length - 2]?.count ?? 0;
  const trendDelta =
    previousMonth === 0
      ? monthGrowth > 0
        ? 100
        : 0
      : Math.round(((monthGrowth - previousMonth) / previousMonth) * 100);

  const averagePerDay = useMemo(() => {
    const timestamps = patients
      .map((patient) => normalizeDate(patient.createdAt))
      .filter((date): date is Date => Boolean(date));
    if (!timestamps.length) return 0;
    const earliest = timestamps.reduce(
      (min, current) => (current < min ? current : min),
      timestamps[0],
    );
    const differenceInDays = Math.max(
      1,
      Math.ceil(
        (Date.now() - earliest.getTime()) / (1000 * 60 * 60 * 24),
      ),
    );
    return Math.round(totalPatients / differenceInDays);
  }, [patients, totalPatients]);

  const highlightCards = [
    {
      label: "Total registered",
      value: totalPatients.toLocaleString(),
      icon: UsersRound,
      badge: "All time",
    },
    {
      label: "New this month",
      value: monthGrowth.toLocaleString(),
      icon: Plus,
      badge: `${trendDelta >= 0 ? "+" : ""}${trendDelta}% vs last month`,
      badgeTone: trendDelta >= 0 ? "positive" : "neutral",
    },
    {
      label: "Avg. additions / day",
      value: averagePerDay.toLocaleString(),
      icon: CalendarClock,
      badge: "Based on registration history",
    },
  ];

  return (
    <div className="space-y-8 px-4 pb-12 pt-6 lg:px-10">
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-emerald-50 to-white shadow-sm">
        <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_1fr] lg:p-10">
          <div className="space-y-6">
            <Badge className="w-fit bg-emerald-100 text-emerald-700">
              Reception / Patients
            </Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                Patient Intake Monitor
              </h1>
              <p className="text-base text-slate-600">
                Track the flow of new registrations, monitor blood group
                coverage, and keep every department aligned on patient intake.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/receptionist/patient-register">
                <Button size="lg" className="rounded-full">
                  <Plus className="h-4 w-4" />
                  Register patient
                </Button>
              </Link>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                <RefreshCcw className="h-4 w-4" />
                {isFetching ? "Syncing..." : "Refresh data"}
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {highlightCards.map((card) => (
                <Card
                  key={card.label}
                  className="border-white/80 bg-white/90 shadow-sm"
                >
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        {card.label}
                      </span>
                      <card.icon className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="text-3xl font-semibold text-slate-900">
                      {card.value}
                    </p>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
                        card.badgeTone === "positive"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600",
                      )}
                    >
                      {card.badge}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="border-white/70 bg-white/90 shadow-sm">
            <CardHeader className="space-y-3">
              <CardTitle className="flex items-center justify-between text-base font-semibold">
                Monthly additions
                <Badge variant="secondary" className="text-xs font-semibold">
                  Last 6 months
                </Badge>
              </CardTitle>
              <CardDescription>
                Recent intake trend based on registration timestamps.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col justify-between gap-4">
              <div className="h-40 w-full">
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="h-full w-full"
                >
                  <polyline
                    fill="none"
                    stroke="url(#sparklineGradient)"
                    strokeWidth="2"
                    points={sparklinePoints || "0,100 100,100"}
                  />
                  <linearGradient
                    id="sparklineGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </svg>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-emerald-50/70 p-3 text-sm text-emerald-700">
                <TrendingUp className="h-4 w-4" />
                {trendDelta >= 0 ? (
                  <span>
                    Up by <strong>{trendDelta}%</strong> compared to last month.
                  </span>
                ) : (
                  <span>
                    Down by <strong>{Math.abs(trendDelta)}%</strong> vs last
                    month.
                  </span>
                )}
              </div>
              <div className="flex flex-wrap justify-between text-sm text-slate-500">
                {monthlyBuckets.map((bucket) => (
                  <div key={bucket.key} className="text-center">
                    <p className="font-semibold text-slate-900">
                      {bucket.count}
                    </p>
                    <p>{bucket.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Blood group coverage
              <Badge variant="outline" className="text-xs">
                Inventory alignment
              </Badge>
            </CardTitle>
            <CardDescription>
              Quickly see which blood groups dominate current patient records.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {bloodGroupStats.map((group) => (
              <div key={group.group} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">
                    {group.group}
                  </span>
                  <span className="text-slate-500">
                    {group.count} patients · {group.percent}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                    style={{ width: `${group.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Gender mix</CardTitle>
            <CardDescription>
              Balance of male / female registrations for the selected window.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative mx-auto flex h-48 w-48 items-center justify-center">
              <svg viewBox="0 0 36 36" className="h-full w-full">
                <path
                  className="text-slate-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  strokeDasharray={`${genderStats.femalePercent}, 100`}
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <p className="text-xs uppercase text-slate-500">Female</p>
                <p className="text-3xl font-semibold text-slate-900">
                  {genderStats.femalePercent}%
                </p>
              </div>
            </div>
            <div className="grid gap-4 text-sm">
              <div className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-2 font-semibold text-emerald-700">
                <span>Female</span>
                <span>{genderStats.female}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-2 font-semibold text-slate-600">
                <span>Male</span>
                <span>{genderStats.male}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-2 font-semibold text-slate-600">
                <span>Other / undisclosed</span>
                <span>{genderStats.other}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Recent patient additions
              <Badge variant="outline" className="text-xs">
                Latest 5 records
              </Badge>
            </CardTitle>
            <CardDescription>
              Quick glance at the most recent registrations so you can follow up
              or edit records fast.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPatients.length === 0 ? (
              <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center text-slate-500">
                No patient records found. Start by registering your first one.
              </p>
            ) : (
              recentPatients.map((patient) => (
                <div
                  key={patient._id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {patient.name || "Unnamed patient"}
                    </p>
                    <p className="text-sm text-slate-500">
                      {patient.email || patient.phone || "No contact info"}
                    </p>
                  </div>
                  <div className="text-right text-sm text-slate-500">
                    <p>{patient.gender ?? "—"}</p>
                    <p>
                      {patient.created.toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <Link
                    href={`/receptionist/patients/${patient._id}`}
                    className="text-sm font-semibold text-emerald-600"
                  >
                    View record
                    <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" />
                  </Link>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Operational checklist
              <Badge variant="secondary" className="text-xs">
                Daily habits
              </Badge>
            </CardTitle>
            <CardDescription>
              Keep patient intake aligned with the hospital&rsquo;s quality bar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "Validate government ID or insurance data before submission.",
              "Confirm allergy & medication notes if a record already exists.",
              "Attach referral or case documents to speed up diagnosis.",
              "Flag blood group discrepancies for the lab coordinator.",
              "Notify assigned doctor once the patient enters the facility.",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3 text-sm text-slate-600"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <Activity className="h-4 w-4 text-emerald-500" />
                </div>
                <p>{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default ReceptionistPatientInsightsPage;
