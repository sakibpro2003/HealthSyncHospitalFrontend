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
    <section className="relative isolate px-4 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-white to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_12%,rgba(109,40,217,0.12),transparent_30%),radial-gradient(circle_at_88%_8%,rgba(124,58,237,0.12),transparent_25%),radial-gradient(circle_at_50%_90%,rgba(99,102,241,0.12),transparent_28%)]" />

      <div className="mx-auto mt-8 w-full max-w-[1180px]">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950 text-white shadow-[0_18px_60px_rgba(0,0,0,0.42)] ring-1 ring-purple-400/15">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0e0a1f] via-slate-950 to-[#1b1238]" aria-hidden />
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(147,51,234,0.22),transparent_36%),radial-gradient(circle_at_82%_10%,rgba(99,102,241,0.18),transparent_32%),radial-gradient(circle_at_10%_78%,rgba(139,92,246,0.18),transparent_28%)]"
            aria-hidden
          />

          <div className="relative grid items-start gap-8 px-7 py-8 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-12">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-white text-purple-800 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] shadow-md shadow-purple-500/20">
                  <Sparkles className="size-4" />
                  {activeSlide.eyebrow}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-purple-50">
                  <BadgeCheck className="size-4 text-purple-200" />
                  24/7 hospital desk
                </span>
              </div>

              <div className="space-y-2.5">
                <h1 className="text-[32px] font-black leading-tight sm:text-4xl lg:text-[44px]">
                  {activeSlide.title}
                </h1>
                <p className="max-w-2xl text-[15px] text-purple-50/80 sm:text-base">
                  {activeSlide.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {activeSlide.tags.map((tag) => (
                  <span
                    key={`${activeSlide.id}-${tag}`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-purple-50"
                  >
                    <ShieldCheck className="size-4 text-purple-200" />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Button className="group rounded-full bg-white px-7 py-2 text-sm font-semibold text-purple-800 shadow-lg shadow-purple-500/20 transition hover:-translate-y-0.5 hover:bg-purple-50">
                  <span className="flex items-center gap-2">
                    {activeSlide.ctaPrimary}
                    <ArrowUpRight className="size-4 text-purple-700 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-white/25 bg-white/10 px-7 py-2 text-sm font-semibold text-white shadow-md shadow-purple-900/30 transition hover:-translate-y-0.5 hover:bg-white/15"
                >
                  {activeSlide.ctaSecondary}
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {activeSlide.metrics.map((metric) => (
                  <div
                    key={`${activeSlide.id}-${metric.label}`}
                    className="rounded-2xl border border-white/10 bg-white/5 p-3.5 shadow-inner shadow-purple-900/20"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-purple-100/70">
                      {metric.label}
                    </p>
                    <p className="mt-1 text-xl font-bold text-white">{metric.value}</p>
                    <p className="text-[11px] text-purple-50/70">{metric.detail}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-purple-50/85">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
                  <ShieldCheck className="size-4 text-purple-200" />
                  {activeSlide.highlight}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  <Clock3 className="size-4 text-purple-200" />
                  Next slot: {activeSlide.nextSlot}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  <PhoneCall className="size-4 text-purple-200" />
                  Hotline: {activeSlide.hotline}
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-[26px] border border-white/12 bg-white/5 backdrop-blur">
                <div className={`absolute inset-0 bg-gradient-to-br ${activeSlide.accent}`} aria-hidden />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/25 to-transparent" aria-hidden />
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
                    className="rounded-2xl border border-white/12 bg-white/5 p-4 text-white shadow-inner shadow-purple-900/25"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-purple-50/85">{kpi.label}</p>
                      <BedDouble className="size-4 text-purple-200" />
                    </div>
                    <p className="text-xl font-bold text-white">{kpi.value}</p>
                    <p className="text-xs text-purple-100/75">{kpi.detail}</p>
                  </div>
                ))}
                <div className="rounded-2xl border border-white/12 bg-gradient-to-br from-purple-500/30 via-purple-500/20 to-purple-500/10 p-4 text-white shadow-inner shadow-purple-900/25">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <HeartPulse className="size-4 text-white" />
                    Patient safety focus
                  </div>
                  <p className="mt-1 text-2xl font-bold text-white">4.8 / 5</p>
                  <p className="text-xs text-purple-100/80">Recent patient experience score</p>
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
                      ? "w-11 bg-purple-400 shadow-[0_0_18px_rgba(168,85,247,0.6)]"
                      : "w-6 bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="flex size-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white shadow-md backdrop-blur transition hover:-translate-y-0.5"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="flex size-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white shadow-md backdrop-blur transition hover:-translate-y-0.5"
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
