
"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, X, ArrowRight } from "lucide-react";

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
          "Digitally connected pharmacy ensures quick dispensing, medication counselling, and remote prescription fulfilment.",
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
    <section className="relative isolate mx-auto mt-20 w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/95 via-white/80 to-violet-50/80 px-4 py-16 shadow-[0_35px_80px_-40px_rgba(30,41,59,0.55)] backdrop-blur sm:px-6 lg:px-10">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-200 via-violet-100 to-white" aria-hidden />
      <div className="absolute -top-16 right-0 h-56 w-56 rounded-full bg-violet-200/60 blur-3xl" aria-hidden />
      <div className="absolute -bottom-16 left-4 h-48 w-48 rounded-full bg-sky-200/50 blur-3xl" aria-hidden />

      <div className="relative z-10 flex flex-col gap-10">
        <div className="flex flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-violet-700">
              <Sparkles className="size-4" />
              Inside HealthSync
            </span>
            <h3 className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
              A glimpse into our hospital ecosystem
            </h3>
            <p className="max-w-2xl text-base text-slate-600">
              Explore the spaces where compassionate care meets cutting-edge technology. Each capture highlights the teams and tools shaping healthier outcomes every day.
            </p>
          </div>
          <Button className="rounded-full bg-violet-600 px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-700">
            View virtual tour
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group relative overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/60 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  className="size-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-violet-700/15 via-transparent to-white/30" />
              </div>
              <div className="flex flex-col gap-2 px-6 py-5 text-left">
                <span className="w-fit rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-violet-700">
                  {item.category}
                </span>
                <h4 className="text-lg font-semibold text-slate-900">{item.title}</h4>
                <p className="text-sm text-slate-600">{item.description}</p>
                <span className="inline-flex items-center gap-2 pt-2 text-sm font-semibold text-violet-600">
                  View details <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-violet-400/25 backdrop-blur">
          <div className="relative mx-4 flex max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/40 bg-white/95 shadow-2xl md:flex-row">
            <div className="relative w-full md:w-1/2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeItem.src}
                alt={activeItem.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-900/15 via-transparent to-white/10" />
            </div>
            <div className="flex flex-1 flex-col gap-4 p-8">
              <span className="w-fit rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-violet-700">
                {activeItem.category}
              </span>
              <h4 className="text-2xl font-bold text-slate-900">{activeItem.title}</h4>
              <p className="text-base text-slate-600">{activeItem.description}</p>
              <div className="mt-auto">
                <Button
                  onClick={() => setActiveIndex(null)}
                  className="rounded-full bg-violet-600 px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-700"
                >
                  Close preview
                </Button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full border border-white/50 bg-white/80 text-slate-700 shadow-md backdrop-blur hover:scale-105"
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
