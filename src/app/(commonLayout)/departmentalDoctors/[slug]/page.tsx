
"use client";

import { useParams } from "next/navigation";
import { normaliseDoctorResult, useGetAllDoctorQuery, type IDoctor } from "@/redux/features/doctor/doctorApi";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clock, GraduationCap, MapPin, Stethoscope } from "lucide-react";
const DepartmentDoctorsPage = () => {
  const params = useParams();
  const rawSlug = params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug ?? "Department";

  const { data, isLoading, error } = useGetAllDoctorQuery({
    department: slug,
    limit: 100,
  });
  const doctors: IDoctor[] = normaliseDoctorResult(data?.data?.result);

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-11/12 items-center justify-center">
        <p className="text-sm text-slate-500">Loading specialists…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-11/12 items-center justify-center">
        <p className="text-sm text-red-500">We’re unable to load doctors for this department right now.</p>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-11/12 flex-col items-center justify-center gap-2 text-center">
        <Stethoscope className="h-10 w-10 text-slate-400" />
        <h3 className="text-lg font-semibold text-slate-700">No doctors found</h3>
        <p className="max-w-sm text-sm text-slate-500">
          We’re expanding our roster—please check back soon or explore another department.
        </p>
      </div>
    );
  }

  return (
    <section className="relative bg-gradient-to-br from-white via-violet-50/70 to-white pb-20 pt-12">
      <div className="absolute -top-16 left-0 h-48 w-48 rounded-full bg-violet-200/60 blur-3xl" aria-hidden />
      <div className="absolute -bottom-20 right-6 h-56 w-56 rounded-full bg-sky-200/50 blur-3xl" aria-hidden />

      <div className="relative mx-auto w-full">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-violet-500">
            Specialists directory
          </p>
          <h1 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
            {slug} department
          </h1>
          <p className="mt-4 max-w-3xl text-sm text-slate-600 sm:mx-auto sm:text-base">
            Meet the consultants who deliver evidence-led care in the {slug.toLowerCase()} discipline. Each profile highlights training, availability, and consultation fees at a glance.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {doctors?.map((doctor: IDoctor) => {
            const education = Array.isArray(doctor.education)
              ? doctor.education.join(", ")
              : doctor.education;

            const availabilityDays = doctor.availability?.days?.join(", ");

            return (
              <article
                key={doctor._id}
                className="group relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/85 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-2xl"
              >
                <div className="absolute inset-x-6 top-0 h-[3px] rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 opacity-0 transition group-hover:opacity-100" />
                <div className="flex flex-col gap-6 p-6">
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-white/60 bg-violet-100">
                      <Image
                        src={doctor.image || "/default-doctor.jpg"}
                        alt={doctor.name}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                        {doctor.name}
                        <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-600">
                          {doctor.specialization}
                        </span>
                      </h3>
                      <p className="mt-1 truncate text-sm text-slate-500">{doctor.department}</p>
                      {availabilityDays && (
                        <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="h-3.5 w-3.5 text-violet-500" />
                          {availabilityDays} · {doctor.availability?.from ?? "—"} – {doctor.availability?.to ?? "—"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-slate-600">
                    {education && (
                      <p className="flex items-start gap-2">
                        <GraduationCap className="mt-0.5 h-4 w-4 text-violet-500" />
                        <span>{education}</span>
                      </p>
                    )}
                    {doctor.experience && (
                      <p className="flex items-start gap-2">
                        <Stethoscope className="mt-0.5 h-4 w-4 text-violet-500" />
                        <span>{doctor.experience}</span>
                      </p>
                    )}
                    {doctor.availability?.location && (
                      <p className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 text-violet-500" />
                        <span>{doctor.availability.location}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Consultation fee</p>
                      <p className="text-lg font-semibold text-slate-900">
                        ৳{doctor.consultationFee?.toLocaleString() ?? "—"}
                      </p>
                    </div>
                    <Link href={`/doctor-details/${doctor._id}`}>
                      <Button className="rounded-full bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-700">
                        View profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DepartmentDoctorsPage;
