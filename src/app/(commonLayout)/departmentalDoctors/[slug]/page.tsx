"use client";

import { useParams } from "next/navigation";
import { useGetAllDoctorQuery, type IDoctor } from "@/redux/features/doctor/doctorApi";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Stethoscope, GraduationCap, MapPin, Clock } from "lucide-react";

const DepartmentDoctorsPage = () => {
  const params = useParams();
  const slug = (params?.slug as string) ?? "Department";

  const { data, isLoading, error } = useGetAllDoctorQuery(slug);
  const doctors = data?.data?.result?.result;

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

  if (!Array.isArray(doctors) || doctors.length === 0) {
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
    <section className="bg-slate-50 pb-16 pt-10 dark:bg-slate-950">
      <div className="mx-auto w-11/12">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-blue-500">
            Specialists Directory
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
            {slug} Department
          </h1>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Meet the consultants who provide evidence-based care in the {slug.toLowerCase()} discipline.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {doctors.map((doctor: IDoctor) => {
            const education = Array.isArray(doctor.education)
              ? doctor.education.join(", ")
              : doctor.education;

            const availabilityDays = doctor.availability?.days?.join(", ");

            return (
              <article
                key={doctor._id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 opacity-0 transition group-hover:opacity-100" />
                <div className="flex flex-col gap-6 p-6">
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                      <Image
                        src={doctor.image || "/default-doctor.jpg"}
                        alt={doctor.name}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {doctor.name}
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-500/20 dark:text-blue-300">
                          {doctor.specialization}
                        </span>
                      </h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {doctor.department}
                      </p>
                      {availabilityDays && (
                        <p className="mt-2 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                          <Clock className="h-3.5 w-3.5" />
                          {availabilityDays} · {doctor.availability.from} - {doctor.availability.to}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                    {education && (
                      <p className="flex items-start gap-2">
                        <GraduationCap className="mt-0.5 h-4 w-4 text-blue-500" />
                        <span>{education}</span>
                      </p>
                    )}
                    {doctor.experience && (
                      <p className="flex items-start gap-2">
                        <Stethoscope className="mt-0.5 h-4 w-4 text-blue-500" />
                        <span>{doctor.experience}</span>
                      </p>
                    )}
                    {doctor.availability?.location && (
                      <p className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 text-blue-500" />
                        <span>{doctor.availability.location}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400">
                        Consultation Fee
                      </p>
                      <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        ৳{doctor.consultationFee?.toLocaleString() ?? "—"}
                      </p>
                    </div>
                    <Link href={`/doctor-details/${doctor._id}`}>
                      <Button className="rounded-full bg-blue-600 px-4 text-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                        View Profile
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
