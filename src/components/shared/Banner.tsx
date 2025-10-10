"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

import b1 from "../../assets/b1.png";
import b2 from "../../assets/b2.png";
import b3 from "../../assets/b3.png";
import b4 from "../../assets/b4.png";
import b5 from "../../assets/b5.png";
import b6 from "../../assets/b6.png";
import b7 from "../../assets/b7.png";

const slides = [
  {
    id: 1,
    image: b1,
    eyebrow: "Digital-first Healthcare",
    title: "Seamless hospital care for every patient journey",
    description:
      "Coordinate appointments, manage wards, and keep families informed with a single intuitive platform tailored for modern hospitals.",
    highlight: "Trusted by 120+ leading healthcare providers",
    ctaLabel: "Book a consultation",
    secondaryLabel: "Explore departments",
    features: ["Smart scheduling", "AI-assisted triage", "Real-time dashboards"],
  },
  {
    id: 2,
    image: b2,
    eyebrow: "Empowered Care Teams",
    title: "Give your staff the tools they deserve",
    description:
      "Automate paperwork, keep clinicians aligned, and respond faster with collaborative workflows built around your teams.",
    highlight: "Up to 35% faster response times",
    ctaLabel: "See how it works",
    secondaryLabel: "Meet our doctors",
    features: ["Unified patient history", "Role-based access", "Secure messaging"],
  },
  {
    id: 3,
    image: b3,
    eyebrow: "Future-ready Platform",
    title: "Scale securely without compromising care",
    description:
      "From diagnostics to discharge, tailor HealthSync to your infrastructure and stay compliant with global healthcare standards.",
    highlight: "ISO 27001 security & GDPR ready",
    ctaLabel: "Start a free trial",
    secondaryLabel: "View success stories",
    features: ["Cloud or on-premise", "24/7 monitoring", "Advanced analytics"],
  },
  {
    id: 4,
    image: b4,
    eyebrow: "Patient-first Experiences",
    title: "Delight patients with proactive communication",
    description:
      "Automated reminders, multilingual portals, and personalised follow-ups keep patients confident and connected throughout their care.",
    highlight: "98% patient satisfaction score",
    ctaLabel: "Chat with us",
    secondaryLabel: "Patient resources",
    features: ["Personalised reminders", "Family updates", "Seamless billing"],
  },
  {
    id: 5,
    image: b5,
    eyebrow: "Insights at your fingertips",
    title: "Turn hospital data into decisive action",
    description:
      "Visualise performance, forecast demand, and unlock operational intelligence that keeps every department in harmony.",
    highlight: "85% admins report better visibility",
    ctaLabel: "View analytics",
    secondaryLabel: "Download brochure",
    features: ["Custom dashboards", "Predictive alerts", "KPI tracking"],
  },
  {
    id: 6,
    image: b6,
    eyebrow: "Trusted Partner",
    title: "Your digital transformation, guided end to end",
    description:
      "From onboarding to optimisation, our specialists deliver white-glove support so you can focus on what matters most—patient care.",
    highlight: "Dedicated success manager for every client",
    ctaLabel: "Speak to an expert",
    secondaryLabel: "Implementation roadmap",
    features: ["Hands-on onboarding", "Training academy", "24/7 priority support"],
  },
  {
    id: 7,
    image: b7,
    eyebrow: "Trusted Partner",
    title: "Your digital transformation, guided end to end",
    description:
      "From onboarding to optimisation, our specialists deliver white-glove support so you can focus on what matters most—patient care.",
    highlight: "Dedicated success manager for every client",
    ctaLabel: "Speak to an expert",
    secondaryLabel: "Implementation roadmap",
    features: ["Hands-on onboarding", "Training academy", "24/7 priority support"],
  },
];

const AUTO_ROTATE_MS = 6500;

const Banner = () => {
  const [current, setCurrent] = useState(0);

  const totalSlides = slides.length;

  const nextSlide = () =>
    setCurrent((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));

  useEffect(() => {
    const timer = window.setInterval(nextSlide, AUTO_ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [totalSlides]);

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
            <div className="relative mx-auto aspect-[4/3] w-full max-w-[18rem] sm:max-w-sm lg:max-w-md overflow-hidden rounded-3xl shadow-xl">
              <Image
                src={activeSlide.image}
                alt={activeSlide.title}
                fill
                priority
                sizes="(min-width: 1280px) 420px, (min-width: 768px) 320px, 70vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/20 via-transparent to-white/10" />
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
