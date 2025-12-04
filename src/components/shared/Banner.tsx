"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Clock3,
  HeartPulse,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";

type SlideMetric = {
  label: string;
  value: string;
  detail: string;
};

type Slide = {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  highlight: string;
  ctaPrimary: string;
  ctaSecondary: string;
  tags: string[];
  metrics: SlideMetric[];
  spotlight: {
    label: string;
    value: string;
    detail: string;
  };
    kpis: SlideMetric[];
    nextSlot: string;
    hotline: string;
    accent: string;
    image: string;
};

const slides: Slide[] = [
  {
    id: 1,
    eyebrow: "HealthSync Command",
    title: "Run a calm, connected hospital command center",
    description:
      "Coordinate beds, clinicians, and patient updates in one place. HealthSync keeps your teams aligned so patients move smoothly from triage to discharge.",
    highlight: "ISO 27001-ready • HIPAA-aware workflows",
    ctaPrimary: "Book an appointment",
    ctaSecondary: "Explore departments",
    tags: ["Smart triage", "Live capacity", "Family updates"],
    metrics: [
      { label: "Bed readiness", value: "92%", detail: "Updated live across wards" },
      { label: "ER triage time", value: "4m", detail: "Median response to intake" },
      { label: "No-show drop", value: "-28%", detail: "Automated reminders" },
    ],
    spotlight: {
      label: "Critical care board",
      value: "Under 5 min response",
      detail: "Triage stream monitored",
    },
    kpis: [
      { label: "Inpatient occupancy", value: "78%", detail: "Balanced load" },
      { label: "Telehealth queue", value: "6 patients", detail: "Routing now" },
    ],
    nextSlot: "Today • 11:30 AM",
    hotline: "+880 9638-000-111",
    accent: "from-violet-500/35 via-purple-500/25 to-indigo-500/25",
    image: "/hero-doctor.jpg",
  },
  {
    id: 2,
    eyebrow: "Care Team Alignment",
    title: "Give clinicians clarity before every round",
    description:
      "Unify notes, vitals, and consults. HealthSync ensures the right specialists, equipment, and consent are ready before the patient arrives.",
    highlight: "Role-based access • Audit-ready logs",
    ctaPrimary: "View care pathways",
    ctaSecondary: "Meet our specialists",
    tags: ["Unified history", "Mobile updates", "Escalation guardrails"],
    metrics: [
      { label: "Handover accuracy", value: "99.2%", detail: "Structured templates" },
      { label: "Rounds completed", value: "48", detail: "Past 24 hours" },
      { label: "Delayed consults", value: "2", detail: "Flagged for today" },
    ],
    spotlight: {
      label: "Rounds briefing",
      value: "All teams synced",
      detail: "No missing labs",
    },
    kpis: [
      { label: "Lab turnaround", value: "37 min", detail: "Median today" },
      { label: "Clinician coverage", value: "98%", detail: "Shifts staffed" },
    ],
    nextSlot: "Today • 02:15 PM",
    hotline: "+880 9638-000-222",
    accent: "from-indigo-500/35 via-violet-500/30 to-purple-500/25",
    image: "/hero-doctor.jpg",
  },
  {
    id: 3,
    eyebrow: "Patient-First Operations",
    title: "Proactive communication that keeps families confident",
    description:
      "Multilingual reminders, follow-ups, and billing transparency—all on the channels patients prefer. Delight them while reducing inbound calls.",
    highlight: "NPS 4.8 • 98% satisfaction",
    ctaPrimary: "Start a virtual consult",
    ctaSecondary: "Download brochure",
    tags: ["Patient concierge", "Billing clarity", "Recovery coaching"],
    metrics: [
      { label: "Follow-up completion", value: "88%", detail: "Within 72 hours" },
      { label: "Missed calls", value: "-41%", detail: "Automated updates" },
      { label: "Billing disputes", value: "1.2%", detail: "Transparent steps" },
    ],
    spotlight: {
      label: "Experience desk",
      value: "Live multilingual support",
      detail: "SMS • WhatsApp • Email",
    },
    kpis: [
      { label: "Discharge ready", value: "34 patients", detail: "Paperwork queued" },
      { label: "Remote coaching", value: "62 active", detail: "Recovery plans" },
    ],
    nextSlot: "Today • 04:00 PM",
    hotline: "+880 9638-000-333",
    accent: "from-purple-500/35 via-fuchsia-500/30 to-indigo-500/20",
    image: "/hero-doctor.jpg",
  },
];

const AUTO_ROTATE_MS = 7000;

const Banner = () => {
  const [current, setCurrent] = useState(0);

  const totalSlides = slides.length;

  const nextSlide = useCallback(
    () => setCurrent((prev) => (prev === totalSlides - 1 ? 0 : prev + 1)),
    [totalSlides],
  );
  const prevSlide = useCallback(
    () => setCurrent((prev) => (prev === 0 ? totalSlides - 1 : prev - 1)),
    [totalSlides],
  );

  useEffect(() => {
    const timer = window.setInterval(nextSlide, AUTO_ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [nextSlide]);

  const activeSlide = useMemo(() => slides[current], [current]);

  return (
    <section className="relative w-425 mx-auto isolate px-4 sm:px-6 lg:px-8">
      <div className="pointer-events-none radial-gradient(circle_at_85%_14%,rgba(129,140,248,0.12),transparent_38%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(139,92,246,0.12),transparent_40%)]" />

      <div className="mx-auto mt-8  w-full">
        <div className="relative overflow-hidden rounded-[28px] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50 text-slate-900 shadow-[0_18px_50px_-30px_rgba(109,40,217,0.35)]">
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(139,92,246,0.14),transparent_36%),radial-gradient(circle_at_78%_10%,rgba(129,140,248,0.12),transparent_32%)]"
            aria-hidden
          />

          <div className="relative grid items-start gap-8 px-7 py-8 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-12">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-violet-700 shadow-sm shadow-violet-200">
                  <Sparkles className="size-4" />
                  {activeSlide.eyebrow}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-1.5 text-[11px] font-semibold text-violet-700">
                  <BadgeCheck className="size-4 text-violet-600" />
                  24/7 hospital desk
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="text-[32px] font-black leading-tight sm:text-4xl lg:text-[42px]">
                  {activeSlide.title}
                </h1>
                <p className="max-w-2xl text-[15px] text-slate-600 sm:text-base">
                  {activeSlide.description}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {activeSlide.metrics.map((metric) => (
                  <div
                    key={`${activeSlide.id}-${metric.label}`}
                    className="rounded-2xl border border-violet-100 bg-white/90 p-3.5 shadow-sm"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-500">
                      {metric.label}
                    </p>
                    <p className="mt-1 text-xl font-bold text-slate-900">{metric.value}</p>
                    <p className="text-[11px] text-slate-500">{metric.detail}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Button className="group rounded-full bg-violet-600 px-7 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-400/40 transition hover:-translate-y-0.5 hover:bg-violet-700">
                  <span className="flex items-center gap-2">
                    {activeSlide.ctaPrimary}
                    <ArrowUpRight className="size-4 text-white transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-violet-200 bg-white px-7 py-2 text-sm font-semibold text-violet-700 shadow-md shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-50"
                >
                  {activeSlide.ctaSecondary}
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
                <span className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-1.5">
                  <ShieldCheck className="size-4 text-violet-500" />
                  {activeSlide.highlight}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-1.5">
                  <Clock3 className="size-4 text-violet-500" />
                  Next slot: {activeSlide.nextSlot}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-1.5">
                  <PhoneCall className="size-4 text-emerald-500" />
                  Hotline: {activeSlide.hotline}
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-[26px] border border-violet-100 bg-white/90 shadow-lg shadow-violet-200">
                <div className={`absolute inset-0 bg-gradient-to-br ${activeSlide.accent}`} aria-hidden />
                <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-white/20 to-transparent" aria-hidden />
                <Image
                  src={activeSlide.image}
                  alt="HealthSync care team"
                  fill
                  priority
                  className="object-cover"
                  sizes="(min-width: 1280px) 520px, (min-width: 1024px) 440px, 100vw"
                />

                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-purple-800 shadow-lg shadow-purple-500/20">
                  <Stethoscope className="size-4 text-purple-600" />
                  Live care board
                </div>

                <div className="absolute right-4 top-4 flex gap-2">
                  <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold text-purple-50">
                    Secure by design
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-100/90 px-3 py-1 text-xs font-semibold text-purple-800">
                    <Activity className="size-4" />
                    Live
                  </span>
                </div>

                <div className="absolute inset-x-4 bottom-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/92 p-4 text-slate-900 shadow-xl shadow-purple-900/25">
                    <p className="text-sm font-semibold text-slate-800">{activeSlide.spotlight.label}</p>
                    <p className="text-lg font-bold text-purple-700">{activeSlide.spotlight.value}</p>
                    <p className="text-xs text-slate-600">{activeSlide.spotlight.detail}</p>
                  </div>
                  <div className="rounded-2xl border border-white/40 bg-white/15 p-4 text-white shadow-lg shadow-purple-900/25">
                    <p className="text-sm font-semibold text-white/90">On-call triage</p>
                    <p className="text-lg font-bold text-white">Team Aurora</p>
                    <p className="text-xs text-purple-100/80">Nursing, ER, Respiratory</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {activeSlide.kpis.map((kpi) => (
                  <div
                    key={`${activeSlide.id}-${kpi.label}`}
                    className="rounded-2xl border border-violet-100 bg-white p-4 text-slate-900 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-violet-700">{kpi.label}</p>
                      <BedDouble className="size-4 text-violet-500" />
                    </div>
                    <p className="text-xl font-bold text-slate-900">{kpi.value}</p>
                    <p className="text-xs text-slate-500">{kpi.detail}</p>
                  </div>
                ))}
                <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-100 via-white to-indigo-50 p-4 text-slate-900 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <HeartPulse className="size-4 text-rose-500" />
                    Patient safety focus
                  </div>
                  <p className="mt-1 text-2xl font-bold text-violet-800">4.8 / 5</p>
                  <p className="text-xs text-slate-600">Recent patient experience score</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-between px-6 pb-5 sm:px-9">
            <div className="flex items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrent(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2.5 rounded-full transition ${
                    current === index
                      ? "w-11 bg-violet-500 shadow-[0_0_18px_rgba(109,40,217,0.4)]"
                      : "w-6 bg-violet-200/60 hover:bg-violet-300/80"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="flex size-10 items-center justify-center rounded-full border border-violet-200 bg-white text-violet-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-violet-50"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="flex size-10 items-center justify-center rounded-full border border-violet-200 bg-white text-violet-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-violet-50"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
