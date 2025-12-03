"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Paginate from "@/components/shared/Paginate";
import {
  extractDoctorMeta,
  normaliseDoctorResult,
  useGetAllDoctorQuery,
} from "@/redux/features/doctor/doctorApi";
import {
  CalendarClock,
  GraduationCap,
  MapPin,
  PhoneCall,
  Search,
  Sparkles,
  Stethoscope,
} from "lucide-react";

const DEFAULT_LIMIT = 9;

const DoctorsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = Number(searchParams.get("page"));
  const currentPage = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const searchTerm = searchParams.get("q")?.trim() ?? "";
  const departmentFilter = searchParams.get("department") ?? "";

  const { data, isLoading, isFetching, error } = useGetAllDoctorQuery({
    page: currentPage,
    limit: DEFAULT_LIMIT,
    searchTerm: searchTerm || undefined,
    department: departmentFilter || undefined,
  });
  const { data: allDeptData } = useGetAllDoctorQuery({
    page: 1,
    limit: 500,
  });

  const doctors = normaliseDoctorResult(data?.data?.result);
  const meta = extractDoctorMeta(data?.data?.result, data?.data?.meta);
  const totalPage = Number(meta?.totalPage ?? 0);

  const departments = useMemo(() => {
    const allDoctors = normaliseDoctorResult(allDeptData?.data?.result);
    const unique = new Set(
      allDoctors
        .map((doc) => doc.department)
        .filter((value): value is string => Boolean(value)),
    );
    return Array.from(unique);
  }, [allDeptData?.data?.result]);

  const updateQuery = (params: Record<string, string | null>) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === "") {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    });
    nextParams.set("page", "1");
    router.replace(`?${nextParams.toString()}`);
  };

  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(168,85,247,0.2),transparent_40%),radial-gradient(circle_at_82%_12%,rgba(79,70,229,0.22),transparent_38%),radial-gradient(circle_at_50%_80%,rgba(124,58,237,0.15),transparent_40%)]" />
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div className="relative z-10 space-y-4 text-white lg:w-3/5">
            <Badge className="w-fit rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-purple-50">
              Specialist network
            </Badge>
            <div className="space-y-3">
              <h1 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                Book trusted HealthSync doctors
              </h1>
              <p className="max-w-3xl text-base text-purple-100/80 sm:text-lg">
                Browse departments, filter specialists, and lock a slot that fits your schedule. Every profile lists training, availability, and consultation fee up front.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-purple-100/90">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                <Sparkles className="h-4 w-4 text-purple-200" />
                Board-certified consultants
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                <CalendarClock className="h-4 w-4 text-purple-200" />
                Live availability & fees
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                <PhoneCall className="h-4 w-4 text-purple-200" />
                Hotline: +880 9638-000-111
              </span>
            </div>
          </div>

          <div className="relative z-10 w-full max-w-md self-stretch overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-2xl shadow-purple-900/40 backdrop-blur">
            <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4">
              <Search className="h-5 w-5 text-purple-200" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">Search doctors</span>
                <span className="text-xs text-purple-100/80">
                  By name, department, or specialty
                </span>
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              <Input
                placeholder="e.g. Cardiology, Rahman, Neurology"
                defaultValue={searchTerm}
                onChange={(event) => updateQuery({ q: event.target.value })}
                className="h-11 rounded-2xl border-white/20 bg-white/90 text-slate-900 placeholder:text-slate-500 focus-visible:border-purple-400 focus-visible:ring-purple-200"
              />
              <div className="flex flex-wrap gap-2 text-xs text-purple-100/80">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">
                  Same-week slots
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">
                  Hybrid consultation
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">
                  Patient-first care
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-500">
              Specialists directory
            </p>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Find your doctor</h2>
            <p className="text-sm text-slate-600">
              {meta?.total?.toLocaleString() ?? doctors.length} doctors available
            </p>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-3">
            <div className="relative">
              <select
                value={departmentFilter}
                onChange={(event) =>
                  updateQuery({ department: event.target.value || null })
                }
                className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
              >
                <option value="">All departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <Button
              variant="outline"
              className="rounded-full border-violet-200 text-sm font-semibold text-violet-600 hover:bg-violet-50"
              onClick={() => updateQuery({ q: null, department: null })}
              disabled={!searchTerm && !departmentFilter}
            >
              Clear filters
            </Button>
          </div>
        </div>

        <div className="mt-8">
          {isLoading || isFetching ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <p className="text-sm text-slate-500">Loading doctors…</p>
            </div>
          ) : error ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <p className="text-sm text-red-500">
                We couldn’t load doctors right now. Please try again.
              </p>
            </div>
          ) : doctors.length === 0 ? (
            <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 text-center">
              <Stethoscope className="h-10 w-10 text-slate-400" />
              <h3 className="text-lg font-semibold text-slate-700">No doctors found</h3>
              <p className="max-w-sm text-sm text-slate-500">
                Adjust your search or department filter to discover more specialists.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {doctors.map((doctor) => {
                  const education = Array.isArray(doctor.education)
                    ? doctor.education.join(", ")
                    : doctor.education;
                  const availabilityDays = doctor.availability?.days?.join(", ");
                  return (
                    <Card
                      key={doctor._id}
                      className="group relative overflow-hidden border border-violet-100 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg"
                    >
                      <CardHeader className="flex flex-row items-start gap-3">
                        <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50">
                          <Image
                            src={doctor.image || "/default-doctor.jpg"}
                            alt={doctor.name}
                            fill
                            className="object-cover transition group-hover:scale-105"
                            sizes="64px"
                          />
                        </div>
                        <div className="space-y-1">
                          <Badge className="rounded-full bg-violet-100 px-3 text-xs font-semibold text-violet-800">
                            {doctor.specialization}
                          </Badge>
                          <CardTitle className="text-lg">{doctor.name}</CardTitle>
                          <p className="text-xs text-slate-500">
                            {doctor.department || "Department TBD"}
                          </p>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm text-slate-600">
                        {education && (
                          <p className="flex items-start gap-2">
                            <GraduationCap className="mt-0.5 h-4 w-4 text-violet-500" />
                            <span>{education}</span>
                          </p>
                        )}
                        {doctor.availability?.location && (
                          <p className="flex items-start gap-2">
                            <MapPin className="mt-0.5 h-4 w-4 text-violet-500" />
                            <span>{doctor.availability.location}</span>
                          </p>
                        )}
                        {availabilityDays && (
                          <p className="flex items-start gap-2">
                            <CalendarClock className="mt-0.5 h-4 w-4 text-violet-500" />
                            <span>
                              {availabilityDays} · {doctor.availability?.from ?? "—"} –{" "}
                              {doctor.availability?.to ?? "—"}
                            </span>
                          </p>
                        )}
                        <p className="rounded-2xl bg-violet-50 px-3 py-2 text-violet-700">
                          Fee: ৳{doctor.consultationFee?.toLocaleString() ?? "—"}
                        </p>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <Link href={`/doctor-details/${doctor._id}`}>
                            <Button className="rounded-full bg-violet-600 px-4 text-sm font-semibold text-white transition hover:bg-violet-700">
                              View profile
                            </Button>
                          </Link>
                          {doctor.phone && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                              <PhoneCall className="h-3.5 w-3.5 text-violet-500" />
                              {doctor.phone}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <div className="mt-8 flex items-center justify-center">
                <Paginate currentPage={currentPage} totalPage={totalPage} />
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

const DoctorsPage = () => (
  <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Loading doctors…</div>}>
    <DoctorsContent />
  </Suspense>
);

export default DoctorsPage;
