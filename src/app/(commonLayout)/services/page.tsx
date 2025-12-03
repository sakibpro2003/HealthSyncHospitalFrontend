"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Ambulance,
  ArrowRight,
  Baby,
  Bed,
  Brain,
  HeartPulse,
  Microscope,
  ShieldCheck,
  Stethoscope,
  Syringe,
} from "lucide-react";

const coreServices = [
  {
    title: "Emergency & Critical Response",
    description:
      "Round-the-clock triage, fully equipped ICUs, and rapid ambulance coordination across the city.",
    icon: Ambulance,
    tag: "24/7",
  },
  {
    title: "Cardiology & Heart Wellness",
    description:
      "Advanced cath labs, minimally invasive surgery, and long-term cardiac rehabilitation under one roof.",
    icon: HeartPulse,
    tag: "Heart Centre",
  },
  {
    title: "Maternal & Child Health",
    description:
      "Dedicated labour suites, neonatal intensive care, and growth clinics supporting every life stage.",
    icon: Baby,
    tag: "Family Care",
  },
  {
    title: "Neuro & Spine Institute",
    description:
      "Comprehensive diagnostics, interventional neurology, and post-operative neuro-rehabilitation.",
    icon: Brain,
    tag: "Advanced",
  },
  {
    title: "Precision Diagnostics",
    description:
      "Digital pathology, 3T MRI, and molecular labs delivering reports with clinician-to-patient explainers.",
    icon: Microscope,
    tag: "Next-gen Labs",
  },
  {
    title: "Preventive Care & Vaccination",
    description:
      "Annual wellness plans, lifestyle coaching, and community immunisation drives curated by experts.",
    icon: Syringe,
    tag: "Wellness",
  },
];

const carePathways = [
  {
    title: "Acute Care Pathway",
    summary: "Stabilise, treat, and transfer with ICU-level monitoring in under 15 minutes from arrival.",
    highlights: [
      "Smart ER command centre",
      "Dedicated trauma surgeons",
      "Seamless inpatient transition",
    ],
  },
  {
    title: "Surgical Excellence",
    summary: "Personalised surgical roadmaps with enhanced recovery protocols and virtual follow-up.",
    highlights: [
      "Minimally invasive suites",
      "3D printed surgical guides",
      "Pain navigation clinics",
    ],
  },
  {
    title: "Recovery & Rehabilitation",
    summary: "Outcomes-driven physiotherapy, occupational therapy, and home care orchestration.",
    highlights: [
      "Motion-tracking rehab studio",
      "Patient concierge",
      "At-home nursing network",
    ],
  },
];

export default function ServicesPage() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(168,85,247,0.2),transparent_40%),radial-gradient(circle_at_82%_12%,rgba(79,70,229,0.22),transparent_38%),radial-gradient(circle_at_50%_80%,rgba(124,58,237,0.15),transparent_40%)]" />
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div className="relative z-10 space-y-4 text-white lg:w-3/5">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-purple-50">
              <ShieldCheck className="size-4" />
              Integrated care
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                Hospitals, doctors, and packages aligned in one continuum
              </h1>
              <p className="max-w-3xl text-base text-purple-100/80 sm:text-lg">
                Explore specialties, meet the consultants behind them, and pair your journey with the right health checkup packages—seamlessly connected through HealthSync.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-violet-800 shadow-lg shadow-purple-500/20 transition hover:-translate-y-0.5 hover:bg-purple-50">
                Browse doctors
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-white/30 bg-white/10 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                View health packages
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-purple-100/90">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                <Bed className="h-4 w-4 text-purple-200" />
                20+ centres of excellence
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                <Stethoscope className="h-4 w-4 text-purple-200" />
                350+ consultants
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                <Activity className="h-4 w-4 text-purple-200" />
                98% satisfaction
              </span>
            </div>
          </div>

          <div className="relative z-10 w-full max-w-md self-stretch overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-2xl shadow-purple-900/40 backdrop-blur">
            <p className="text-sm font-semibold text-purple-100/90">Quick links</p>
            <div className="mt-3 grid gap-3 text-sm text-purple-50/90">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3">
                Specialist directory → connect to <span className="font-semibold">/doctors</span>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3">
                Health checkup bundles → explore <span className="font-semibold">/health-packages</span>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3">
                Care pathways → pick a service below
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl space-y-6 px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Clinical specialties</h2>
            <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
              Explore the high-impact specialties that anchor our hospital. Each programme is supported by dedicated care navigators, digital records, and outcome dashboards your clinicians can share with you in real time.
            </p>
          </div>
          <Button variant="outline" className="rounded-full border-slate-300 px-5 text-sm font-semibold text-slate-700 hover:border-violet-400 hover:bg-white">
            Download service brochure
          </Button>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {coreServices.map(({ title, description, icon: Icon, tag }) => (
            <Card key={title} className="group relative overflow-hidden rounded-3xl border border-white/50 bg-white/80 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
              <CardContent className="relative flex h-full flex-col gap-4 p-6">
                <span className="absolute right-4 top-4 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-violet-600">
                  {tag}
                </span>
                <span className="flex size-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                  <Icon className="size-6" />
                </span>
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                <p className="text-sm text-slate-600">{description}</p>
                <Button
                  variant="ghost"
                  className="mt-auto w-fit rounded-full px-0 text-sm font-semibold text-violet-600 hover:bg-transparent"
                >
                  Learn more
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Care pathways tailored to outcomes</h2>
            <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
              Every admission receives a personalised pathway designed by interdisciplinary teams. These snapshots show how we orchestrate care beyond the hospital walls.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {carePathways.map(({ title, summary, highlights }) => (
            <div
              key={title}
              className="flex h-full flex-col justify-between rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-lg backdrop-blur"
            >
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-500">Signature pathway</p>
                <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
                <p className="text-sm text-slate-600">{summary}</p>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 size-2 rounded-full bg-violet-500" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/20 bg-gradient-to-r from-violet-600 via-violet-500 to-purple-500 px-8 py-12 text-white shadow-[0_30px_70px_-45px_rgba(91,33,182,0.65)] sm:px-12 md:px-16">
        <div className="absolute -left-16 top-1/2 hidden h-56 w-56 -translate-y-1/2 rounded-full bg-white/20 blur-3xl md:block" aria-hidden />
        <div className="relative flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-violet-100">24/7 Coordination Desk</p>
            <h2 className="text-3xl font-black leading-tight">Need immediate guidance for yourself or a loved one?</h2>
            <p className="text-sm text-violet-100 sm:text-base">
              Our care navigators can arrange doctor consults, second opinions, or emergency transfers within minutes.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-violet-600 shadow-md transition hover:bg-violet-100">
              Call the command centre
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-white/70 px-6 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Schedule a visit
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
