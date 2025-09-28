"use client";

import Link from "next/link";
import { Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

const departments = [
  { name: "Cardiology", slug: "Cardiology" },
  { name: "Neurology", slug: "Neurology" },
  { name: "Orthopedics", slug: "Orthopedics" },
  { name: "Pediatrics", slug: "Pediatrics" },
  { name: "Dermatology", slug: "Dermatology" },
  { name: "General Medicine", slug: "General" },
  { name: "Radiology", slug: "Radiology" },
  { name: "Psychiatry", slug: "Psychiatry" },
  { name: "Emergency Care", slug: "Emergency" },
  { name: "Dental", slug: "Dental" },
  { name: "Oncology", slug: "Oncology" },
  { name: "Urology", slug: "Urology" },
];

const DepartmentButtons = () => {
  return (
    <section className="mt-12">
      <div className="mx-auto flex w-11/12 flex-col items-center gap-3 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-500">
          Our Specialists
        </p>
        <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
          Find the Right Doctor
        </h2>
        <p className="max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Browse departments and connect with leading consultants across the
          HealthSync Hospital network.
        </p>
      </div>

      <div className="mx-auto mt-8 grid w-11/12 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {departments.map((dept) => (
          <Link
            key={dept.slug}
            href={`/departmentalDoctors/${dept.slug}`}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "group relative h-auto justify-start rounded-xl border border-slate-200 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md dark:border-slate-700 dark:hover:border-blue-500"
            )}
          >
            <span className="absolute inset-x-4 bottom-4 h-[3px] rounded-full bg-gradient-to-r from-blue-500/80 to-indigo-500/80 opacity-0 transition group-hover:opacity-100" />
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:bg-blue-500/20">
                <Stethoscope className="h-5 w-5" />
              </span>
              <div>
                <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {dept.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Consult top specialists
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default DepartmentButtons;
