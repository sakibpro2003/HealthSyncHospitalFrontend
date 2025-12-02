
"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, ArrowRight } from "lucide-react";

type GalleryItem = {
  id: string;
  src: string;
  title: string;
  description: string;
  category: string;
};

const MyGallery = () => {
  const galleryItems = useMemo<GalleryItem[]>(
    () => [
      {
        id: "surgery-suite",
        src: "https://kothiyahospital.com/wp-content/uploads/MANSUKHBHAI-VISIT-1.jpg",
        title: "Hybrid Operating Suite",
        description:
          "State-of-the-art operating theatre equipped with real-time imaging and robotic assistance for complex procedures.",
        category: "Surgery",
      },
      {
        id: "patient-lounge",
        src: "https://kothiyahospital.com/wp-content/uploads/MANSUKHBHAI-VISIT2.jpg",
        title: "Family Hospitality Lounge",
        description:
          "Warm, welcoming lounge where families can relax, connect with care teams, and monitor loved ones’ progress.",
        category: "Experience",
      },
      {
        id: "consultation",
        src: "https://kothiyahospital.com/wp-content/uploads/RAMESH-OZA-Copy.jpg",
        title: "Consultation Pods",
        description:
          "Private consultation rooms designed for multidisciplinary teams to collaborate with patients in comfort.",
        category: "Clinics",
      },
      {
        id: "pharmacy",
        src: "https://img.freepik.com/free-photo/interior-pharmacy-store_23-2149512243.jpg",
        title: "Integrated Pharmacy",
        description:
          "Digitally connected pharmacy ensures quick dispensing, medication counselling, and doorstep delivery coordination.",
        category: "Pharmacy",
      },
      {
        id: "rehab",
        src: "https://img.freepik.com/free-photo/medical-workers-checking-knee-injury_23-2149202954.jpg",
        title: "Rehabilitation Studio",
        description:
          "Therapists guide patients through personalised rehabilitation programs supported by motion tracking.",
        category: "Therapy",
      },
      {
        id: "diagnostics",
        src: "https://img.freepik.com/free-photo/modern-medical-equipment-lab_23-2149349444.jpg",
        title: "Diagnostic Hub",
        description:
          "Advanced diagnostics suite integrating MRI, CT, and lab services for rapid, coordinated reporting.",
        category: "Diagnostics",
      },
    ],
    [],
  );

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeItem = activeIndex !== null ? galleryItems[activeIndex] : null;

  return (
    <section className="relative isolate mx-auto mt-20 w-full overflow-hidden rounded-[2.5rem] border border-white/15 bg-gradient-to-br from-white/95 via-white/85 to-violet-50/80 px-4 py-16 shadow-[0_40px_90px_-45px_rgba(79,70,229,0.25)] backdrop-blur sm:px-6 lg:px-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(124,58,237,0.12),transparent_32%),radial-gradient(circle_at_82%_8%,rgba(59,130,246,0.1),transparent_30%),radial-gradient(circle_at_20%_82%,rgba(99,102,241,0.1),transparent_30%)]" />
      <div className="absolute -top-10 right-10 h-48 w-48 rounded-full bg-violet-200/50 blur-3xl" aria-hidden />
      <div className="absolute -bottom-12 left-12 h-56 w-56 rounded-full bg-indigo-200/50 blur-3xl" aria-hidden />

      <div className="relative z-10 flex flex-col gap-10">
        <div className="flex flex-col gap-6 text-slate-900 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4 text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-violet-700 ring-1 ring-violet-200/70">
              Inside HealthSync
            </span>
            <h3 className="text-3xl font-black leading-tight sm:text-4xl">
              A glimpse into our hospital ecosystem
            </h3>
            <p className="max-w-2xl text-base text-slate-600">
              Explore the spaces where compassionate care meets cutting-edge technology. Each capture highlights the teams and tools shaping healthier outcomes every day.
            </p>
          </div>
          <Button className="w-fit rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:brightness-110">
            View virtual tour
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group relative overflow-hidden rounded-[1.5rem] border border-white/60 bg-gradient-to-b from-white/95 via-white to-violet-50/70 shadow-lg ring-1 ring-violet-100/70 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:ring-violet-200"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <div className="absolute inset-0 z-10 flex items-start justify-between px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em]">
                  <span className="rounded-full bg-white/85 px-3 py-1 text-violet-700 ring-1 ring-violet-200/70">
                    {item.category}
                  </span>
                  <span className="rounded-full bg-slate-900/85 px-3 py-1 text-white shadow-md shadow-violet-200/40">
                    Signature
                  </span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  className="size-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-violet-900/20 via-transparent to-white/20" />
              </div>
              <div className="flex flex-col gap-2 px-6 py-5 text-left text-slate-900">
                <h4 className="text-lg font-semibold">{item.title}</h4>
                <p className="text-sm text-slate-600 line-clamp-3">{item.description}</p>
                <span className="inline-flex items-center gap-2 pt-2 text-sm font-semibold text-violet-600">
                  View details <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-violet-600/25 backdrop-blur">
          <div className="relative mx-4 flex max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/30 bg-gradient-to-br from-white via-white to-violet-50/80 shadow-2xl shadow-violet-200/40 ring-1 ring-violet-100/70 md:flex-row">
            <div className="relative w-full md:w-1/2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeItem.src}
                alt={activeItem.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-900/20 via-transparent to-white/10" />
            </div>
            <div className="flex flex-1 flex-col gap-4 p-8 text-slate-900">
              <span className="w-fit rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-violet-700 ring-1 ring-violet-200/70">
                {activeItem.category}
              </span>
              <h4 className="text-2xl font-bold">{activeItem.title}</h4>
              <p className="text-base text-slate-600">{activeItem.description}</p>
              <div className="mt-auto">
                <Button
                  onClick={() => setActiveIndex(null)}
                  className="rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
                >
                  Close preview
                </Button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full border border-white/40 bg-white/90 text-slate-700 shadow-md backdrop-blur hover:scale-105"
              aria-label="Close gallery preview"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyGallery;
