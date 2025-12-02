"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Clock3,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

const slides = [
  {
    id: 1,
    eyebrow: "Digital-first Healthcare",
    title: "Seamless hospital care for every patient journey",
    description:
      "Coordinate appointments, manage wards, and keep families informed with a single intuitive platform tailored for modern hospitals.",
    highlight: "Trusted by 120+ leading healthcare providers",
    ctaLabel: "Book a consultation",
    secondaryLabel: "Explore departments",
    features: ["Smart scheduling", "AI-assisted triage", "Real-time dashboards"],
    visual: {
      label: "Operations control",
      caption: "Smart coordination across clinics",
      gradient: "from-violet-600/70 via-indigo-500/65 to-sky-500/70",
    },
    image: "/hero-doctor.jpg",
  },
  {
    id: 2,
    eyebrow: "Empowered Care Teams",
    title: "Give your staff the tools they deserve",
    description:
      "Automate paperwork, keep clinicians aligned, and respond faster with collaborative workflows built around your teams.",
    highlight: "Up to 35% faster response times",
    ctaLabel: "See how it works",
    secondaryLabel: "Meet our doctors",
    features: ["Unified patient history", "Role-based access", "Secure messaging"],
    visual: {
      label: "Care collaboration",
      caption: "Clinicians stay in sync",
      gradient: "from-emerald-500/70 via-blue-500/65 to-violet-600/60",
    },
    image: "/hero-doctor.jpg",
  },
  {
    id: 3,
    eyebrow: "Future-ready Platform",
    title: "Scale securely without compromising care",
    description:
      "From diagnostics to discharge, tailor HealthSync to your infrastructure and stay compliant with global healthcare standards.",
    highlight: "ISO 27001 security & GDPR ready",
    ctaLabel: "Start a free trial",
    secondaryLabel: "View success stories",
    features: ["Cloud or on-premise", "24/7 monitoring", "Advanced analytics"],
    visual: {
      label: "Platform security",
      caption: "Compliance baked into every workflow",
      gradient: "from-sky-600/70 via-indigo-500/70 to-slate-900/70",
    },
    image: "/hero-doctor.jpg",
  },
  {
    id: 4,
    eyebrow: "Patient-first Experiences",
    title: "Delight patients with proactive communication",
    description:
      "Automated reminders, multilingual portals, and personalised follow-ups keep patients confident and connected throughout their care.",
    highlight: "98% patient satisfaction score",
    ctaLabel: "Chat with us",
    secondaryLabel: "Patient resources",
    features: ["Personalised reminders", "Family updates", "Seamless billing"],
    visual: {
      label: "Experience design",
      caption: "Patient updates in real time",
      gradient: "from-rose-500/70 via-orange-500/65 to-amber-400/70",
    },
    image: "/hero-doctor.jpg",
  },
  {
    id: 5,
    eyebrow: "Insights at your fingertips",
    title: "Turn hospital data into decisive action",
    description:
      "Visualise performance, forecast demand, and unlock operational intelligence that keeps every department in harmony.",
    highlight: "85% admins report better visibility",
    ctaLabel: "View analytics",
    secondaryLabel: "Download brochure",
    features: ["Custom dashboards", "Predictive alerts", "KPI tracking"],
    visual: {
      label: "Intelligence hub",
      caption: "Predictive analytics, ready to go",
      gradient: "from-blue-600/70 via-cyan-500/60 to-teal-500/70",
    },
    image: "/hero-doctor.jpg",
  },
  {
    id: 6,
    eyebrow: "Trusted Partner",
    title: "Your digital transformation, guided end to end",
    description:
      "From onboarding to optimisation, our specialists deliver white-glove support so you can focus on the moments that matter most for patient care.",
    highlight: "Dedicated success manager for every client",
    ctaLabel: "Speak to an expert",
    secondaryLabel: "Implementation roadmap",
    features: ["Hands-on onboarding", "Training academy", "24/7 priority support"],
    visual: {
      label: "Expert partnership",
      caption: "Dedicated success specialists",
      gradient: "from-purple-500/70 via-violet-500/60 to-fuchsia-500/60",
    },
    image: "/hero-doctor.jpg",
  },
  {
    id: 7,
    eyebrow: "Trusted Partner",
    title: "Your digital transformation, guided end to end",
    description:
      "From onboarding to optimisation, our specialists deliver white-glove support so clinical teams stay focused on patient care.",
    highlight: "Dedicated success manager for every client",
    ctaLabel: "Speak to an expert",
    secondaryLabel: "Implementation roadmap",
    features: ["Hands-on onboarding", "Training academy", "24/7 priority support"],
    visual: {
      label: "Momentum",
      caption: "Keep teams aligned at scale",
      gradient: "from-indigo-600/70 via-violet-600/70 to-sky-600/70",
    },
    image: "/hero-doctor.jpg",
  },
];

const AUTO_ROTATE_MS = 6500;
const featureIcons = [Stethoscope, ShieldCheck, HeartPulse];

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
    <section className="relative isolate mx-auto mt-12 w-full max-w-[85vw] px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white shadow-2xl ring-1 ring-slate-100">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-emerald-50" aria-hidden />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.12),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.12),transparent_35%),radial-gradient(circle_at_10%_70%,rgba(14,165,233,0.12),transparent_35%)]"
          aria-hidden
        />

        <div className="relative grid items-center gap-12 px-6 py-12 backdrop-blur md:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-14 lg:py-16">
          <div className="absolute -left-28 top-10 h-40 w-40 rounded-full bg-sky-100 blur-3xl" aria-hidden />
          <div className="absolute -right-20 bottom-6 h-52 w-52 rounded-full bg-emerald-100 blur-3xl" aria-hidden />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-700 shadow-sm ring-1 ring-slate-100">
                {activeSlide.eyebrow}
              </span>
              <span className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100/80 sm:inline-flex">
                <BadgeCheck className="size-4" />
                Verified care teams
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {activeSlide.title}
              </h1>
              <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
                {activeSlide.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-100">
                <ShieldCheck className="size-4 text-emerald-200" />
                {activeSlide.highlight}
              </span>
              {activeSlide.features.map((feature, index) => {
                const Icon = featureIcons[index % featureIcons.length];
                return (
                  <span
                    key={`${activeSlide.id}-${feature}`}
                    className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm ring-1 ring-slate-100"
                  >
                    <Icon className="size-4 text-sky-500" />
                    {feature}
                  </span>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button className="rounded-full bg-sky-600 px-7 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-100 transition hover:bg-sky-700">
                {activeSlide.ctaLabel}
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-slate-200 bg-white/70 px-7 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-white"
              >
                {activeSlide.secondaryLabel}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 sm:max-w-xl">
              <div className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 shadow-sm shadow-sky-50">
                <p className="text-sm font-semibold text-slate-900">4.8/5 patient satisfaction</p>
                <p className="text-xs text-slate-500">Feedback from 12k+ recent visits</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 shadow-sm shadow-emerald-50">
                <p className="text-sm font-semibold text-slate-900">25+ specialist departments</p>
                <p className="text-xs text-slate-500">Direct routing to the right doctor</p>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <div className="absolute -left-10 -top-12 h-48 w-48 rounded-full bg-white/60 blur-3xl" aria-hidden />
            <div className="absolute -right-16 bottom-0 h-60 w-60 rounded-full bg-sky-100 blur-3xl" aria-hidden />

            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-slate-900/80 shadow-2xl shadow-sky-100/60">
              <div className={`absolute inset-0 bg-gradient-to-tr ${activeSlide.visual.gradient}`} aria-hidden />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/35 via-slate-900/10 to-transparent" aria-hidden />
              <Image
                src={activeSlide.image}
                alt="HealthSync care team"
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1280px) 520px, (min-width: 1024px) 440px, 100vw"
              />

              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-md shadow-sky-100">
                <Stethoscope className="size-4 text-sky-600" />
                Board-certified doctors
              </div>

              <div className="absolute bottom-5 right-5 flex items-center gap-3 rounded-2xl bg-white/90 px-4 py-3 text-left text-slate-900 shadow-xl shadow-sky-100">
                <div className="flex size-10 items-center justify-center rounded-full bg-sky-50 text-sky-700">
                  <HeartPulse className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700">Response time</p>
                  <p className="text-sm text-slate-600">Under 5 min average</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/90 px-5 py-4 shadow-sm shadow-sky-50">
              <Clock3 className="size-6 text-sky-600" />
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-900">Same-day appointments</p>
                <p className="text-xs text-slate-500">We match you with the right specialist instantly.</p>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-3">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrent(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2.5 rounded-full transition ${
                  current === index
                    ? "w-12 bg-sky-600 shadow-[0_0_12px_rgba(14,165,233,0.45)]"
                    : "w-6 bg-slate-300/70 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>

          <div className="absolute right-6 top-6 flex items-center gap-2">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="flex size-10 items-center justify-center rounded-full border border-white/80 bg-white/90 text-slate-700 shadow-md backdrop-blur transition hover:scale-105"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="flex size-10 items-center justify-center rounded-full border border-white/80 bg-white/90 text-slate-700 shadow-md backdrop-blur transition hover:scale-105"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
