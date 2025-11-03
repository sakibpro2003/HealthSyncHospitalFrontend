"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

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
  },
];

const AUTO_ROTATE_MS = 6500;

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
    <section className="relative isolate mx-auto mt-12 w-full px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-white/95 via-white/85 to-violet-50/80 shadow-2xl">
        <div className="relative flex flex-col gap-10 px-6 py-10 backdrop-blur md:flex-row md:items-center md:px-12 md:py-14">
          <div className="absolute -left-20 top-10 h-36 w-36 rounded-full bg-violet-200/70 blur-3xl" aria-hidden />
          <div className="absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-sky-200/60 blur-3xl" aria-hidden />

          <div className="relative z-10 flex-1 space-y-6 text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1 text-sm font-semibold uppercase tracking-[0.35em] text-violet-700">
              <Sparkles className="size-4 text-violet-500" />
              {activeSlide.eyebrow}
            </span>

            <h1 className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {activeSlide.title}
            </h1>

            <p className="max-w-xl text-base text-slate-600 sm:text-lg">
              {activeSlide.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="rounded-full bg-slate-900/10 px-3 py-2 font-semibold text-slate-900">
                {activeSlide.highlight}
              </span>
              {activeSlide.features.map((feature) => (
                <span
                  key={`${activeSlide.id}-${feature}`}
                  className="rounded-full bg-white px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-500 shadow-sm"
                >
                  {feature}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button className="rounded-full bg-violet-600 px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-700">
                {activeSlide.ctaLabel}
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-slate-300 px-6 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400 hover:bg-white"
              >
                {activeSlide.secondaryLabel}
              </Button>
            </div>
          </div>

          <div className="relative z-10 flex-1">
            <div
              className={`relative mx-auto aspect-[4/3] w-full max-w-[18rem] overflow-hidden rounded-3xl border border-white/20 shadow-xl sm:max-w-sm lg:max-w-md`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${activeSlide.visual.gradient}`}
              />
              <div className="absolute -left-16 top-12 h-36 w-36 rounded-full bg-white/25 blur-3xl" aria-hidden />
              <div className="absolute -right-14 bottom-10 h-48 w-48 rounded-full bg-white/15 blur-2xl" aria-hidden />
              <div className="relative flex h-full flex-col items-center justify-center gap-4 px-8 text-center text-white">
                <span className="rounded-full border border-white/40 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/90">
                  {activeSlide.visual.label}
                </span>
                <p className="max-w-xs text-sm font-medium text-white/80">
                  {activeSlide.visual.caption}
                </p>
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
                    ? "w-12 bg-violet-600 shadow-[0_0_12px_rgba(124,58,237,0.65)]"
                    : "w-6 bg-slate-300/70 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>

          <div className="absolute right-6 top-6 flex items-center gap-2">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="flex size-10 items-center justify-center rounded-full border border-white/60 bg-white/80 text-slate-700 shadow-md backdrop-blur transition hover:scale-105"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="flex size-10 items-center justify-center rounded-full border border-white/60 bg-white/80 text-slate-700 shadow-md backdrop-blur transition hover:scale-105"
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
