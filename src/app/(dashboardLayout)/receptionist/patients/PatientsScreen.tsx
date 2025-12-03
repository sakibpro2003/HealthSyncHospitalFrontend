"use client";

import Loader from "@/components/shared/Loader";
import Paginate from "@/components/shared/Paginate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  IPatient,
  useGetAllPatientQuery,
} from "@/redux/features/patient/patientApi";
import {
  ClipboardList,
  RefreshCcw,
  Search,
  UserPlus,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

type GenderFilter = "all" | "female" | "male" | "other";

const genderFilters: { label: string; value: GenderFilter }[] = [
  { label: "All patients", value: "all" },
  { label: "Female", value: "female" },
  { label: "Male", value: "male" },
  { label: "Other", value: "other" },
];

type PatientsScreenProps = {
  baseSegment?: string;
};

const PatientsContent = ({ baseSegment = "receptionist" }: PatientsScreenProps) => {
  const searchParams = useSearchParams();
  const pageParam = Number(searchParams.get("page"));
  const currentPage = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const basePath = `/${baseSegment}`;

  const form = useForm<{ search: string }>({
    defaultValues: { search: "" },
  });
  const searchValue = form.watch("search", "");
  const searchTerm = searchValue.trim();

  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetAllPatientQuery({
    page: currentPage,
    limit: 10,
    searchTerm: searchTerm || undefined,
  });
  const patients = useMemo(() => data?.result ?? [], [data?.result]);
  const meta = data?.meta;
  const totalPage = Number(meta?.totalPage ?? 0);

  const normalizeGender = (value?: string | null) =>
    (value ?? "").toLowerCase();

  const filteredPatients = useMemo(() => {
    if (genderFilter === "all") {
      return patients;
    }
    if (genderFilter === "other") {
      return patients.filter((patient) => {
        const gender = normalizeGender(patient.gender);
        return gender && gender !== "male" && gender !== "female";
      });
    }
    return patients.filter(
      (patient) => normalizeGender(patient.gender) === genderFilter,
    );
  }, [genderFilter, patients]);

  const stats = useMemo(() => {
    const totalRecords = meta?.total ?? patients.length;
    const male = patients.filter(
      (patient) => normalizeGender(patient.gender) === "male",
    ).length;
    const female = patients.filter(
      (patient) => normalizeGender(patient.gender) === "female",
    ).length;
    const other = patients.filter((patient) => {
      const gender = normalizeGender(patient.gender);
      return gender && !["male", "female"].includes(gender);
    }).length;
    const uniqueBloodGroups = new Set(
      patients
        .map((patient) => patient.bloodGroup?.toUpperCase())
        .filter((group): group is string => Boolean(group)),
    ).size;

    return { totalRecords, male, female, other, uniqueBloodGroups };
  }, [meta?.total, patients]);

  if (isLoading) {
    return <Loader fullScreen={false} label="Loading patients" />;
  }

  if (error) {
    return (
      <Card className="mx-auto mt-10 max-w-3xl border-red-200 bg-red-50/40">
        <CardHeader>
          <CardTitle className="text-xl text-red-900">
            Unable to load patient records
          </CardTitle>
          <CardDescription className="text-red-700">
            The patients service did not respond. Retry or register patients
            manually for now.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Button onClick={() => refetch()}>
            <RefreshCcw className="h-4 w-4" /> Try again
          </Button>
          <Link href={`${basePath}/patient-register`}>
            <Button variant="outline">Register patient</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const showEmptyState = filteredPatients.length === 0;

  return (
    <div className="space-y-8 pb-12">
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-emerald-50 p-6 shadow-sm lg:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <Badge className="w-fit bg-emerald-100 text-emerald-700">
              {baseSegment === "admin" ? "Admin / Patient desk" : "Reception / Patient desk"}
            </Badge>
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                Patients & arrivals overview
              </h1>
              <p className="mt-2 text-base text-slate-600">
                Monitor active registrations, keep blood group coverage in
                check, and jump into patient profiles for faster triage.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={`${basePath}/patient-register`}>
                <Button size="lg" className="gap-2 rounded-full">
                  <UserPlus className="h-4 w-4" />
                  Register patient
                </Button>
              </Link>
              <Button
                type="button"
                variant="outline"
                className="gap-2 rounded-full"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                <RefreshCcw className="h-4 w-4" />
                {isFetching ? "Refreshing..." : "Sync records"}
              </Button>
            </div>
          </div>

          <div className="grid flex-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/70 bg-white/80 p-4 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total records
              </p>
              <p className="text-3xl font-semibold text-slate-900">
                {stats.totalRecords.toLocaleString()}
              </p>
              <p className="text-sm text-slate-500">Across all departments</p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/80 p-4 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Blood groups on file
              </p>
              <p className="text-3xl font-semibold text-slate-900">
                {stats.uniqueBloodGroups}
              </p>
              <p className="text-sm text-slate-500">
                Ensures transfusion readiness
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/80 p-4 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Female patients
              </p>
              <p className="text-2xl font-semibold text-slate-900">
                {stats.female}
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/80 p-4 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Other gender identities
              </p>
              <p className="text-2xl font-semibold text-slate-900">
                {stats.other}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="space-y-4 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                {...form.register("search")}
                type="search"
                placeholder="Search by name, email, or phone"
                className="pl-11"
              />
            </div>

            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCcw className="h-4 w-4" />
              {isFetching ? "Refreshing..." : "Refresh"}
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {genderFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setGenderFilter(filter.value)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition",
                  genderFilter === filter.value
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300",
                )}
              >
                {filter.label}
              </button>
            ))}

            <Badge
              variant="outline"
              className="ml-auto inline-flex items-center gap-2 text-xs font-semibold text-slate-500"
            >
              <ClipboardList className="h-3.5 w-3.5" />
              Page {currentPage} / {Math.max(totalPage, 1)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[220px]">Patient</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Blood group</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {showEmptyState ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-12 text-center text-slate-500"
                    >
                      No patients match the selected filters. Try adjusting the
                      search or gender filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map((patient: IPatient) => (
                    <TableRow key={patient._id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-semibold text-slate-900">
                            {patient.name || "Unnamed patient"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {patient._id}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm text-slate-900">
                            {patient.email || "-"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {patient.phone || "No phone"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-semibold">
                          {patient.bloodGroup || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-sm">
                            <UserRound className="h-4 w-4 text-slate-400" />
                            {patient.gender || "-"}
                          </div>
                      </TableCell>
                      <TableCell className="max-w-[220px] text-sm text-slate-600">
                        {patient.address || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`${basePath}/patients/${patient._id}`}>
                          <Button variant="ghost" size="sm" className="text-emerald-600">
                            View profile
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="border-t border-slate-100 px-4 py-4">
            <Paginate currentPage={currentPage} totalPage={totalPage} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const PatientsScreen = ({ baseSegment = "receptionist" }: PatientsScreenProps) => (
  <Suspense fallback={<Loader />}>
    <PatientsContent baseSegment={baseSegment} />
  </Suspense>
);

export default PatientsScreen;
