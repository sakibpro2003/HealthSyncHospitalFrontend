"use client";

import Link from "next/link";
import {
  Baby,
  Bone,
  Brain,
  Droplets,
  HeartPulse,
  MessageCircleHeart,
  Radiation,
  Ribbon,
  SmilePlus,
  Stethoscope,
  Sun,
  Ambulance,
  type LucideIcon,
} from "lucide-react";
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

const departmentIcons: Record<string, LucideIcon> = {
  Cardiology: HeartPulse,
  Neurology: Brain,
  Orthopedics: Bone,
  Pediatrics: Baby,
  Dermatology: Sun,
  "General Medicine": Stethoscope,
  Radiology: Radiation,
  Psychiatry: MessageCircleHeart,
  "Emergency Care": Ambulance,
  Dental: SmilePlus,
  Oncology: Ribbon,
  Urology: Droplets,
};

const DepartmentButtons = () => {
  return (
    <section className="relative mx-auto mt-16 w-full overflow-hidden rounded-[2.5rem] border border-white/15 bg-linear-to-br from-white/95 via-white/80 to-violet-50/80 px-6 py-14 shadow-[0_35px_80px_-40px_rgba(79,70,229,0.35)] backdrop-blur sm:px-10">
      <div className="absolute -left-24 top-0 h-40 w-40 rounded-full bg-violet-200/60 blur-3xl" aria-hidden />
      <div className="absolute -right-24 bottom-0 h-48 w-48 rounded-full bg-sky-200/50 blur-3xl" aria-hidden />

      <div className="relative mx-auto flex w-full flex-col items-center gap-3 px-2 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-violet-500">
          Our specialists
        </p>
        <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
          Find the right doctor
        </h2>
        <p className="max-w-3xl text-sm text-slate-600 sm:text-base">
          Search by department and connect with leading consultants across the HealthSync network. Every profile includes availability windows, digital records, and patient satisfaction insights.
        </p>
      </div>

      <div className="relative mx-auto mt-10 grid w-full gap-4 px-2 sm:grid-cols-2 md:grid-cols-3 lg:px-8 xl:grid-cols-4">
        {departments.map((dept) => {
          const Icon =
            departmentIcons[dept.name] ?? departmentIcons["General Medicine"];

          return (
            <Link
              key={dept.slug}
              href={`/departmentalDoctors/${dept.slug}`}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "group relative h-auto justify-start rounded-2xl border border-white/50 bg-white/80 p-5 text-left shadow-lg transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl"
              )}
            >
              <span className="absolute inset-x-5 bottom-5 h-[3px] rounded-full bg-gradient-to-r from-violet-500/80 to-indigo-500/80 opacity-0 transition group-hover:opacity-100" />
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    {dept.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    Consult top specialists
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default DepartmentButtons;
