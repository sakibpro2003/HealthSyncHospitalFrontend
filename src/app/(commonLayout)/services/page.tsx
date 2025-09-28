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
    <main className="relative mx-auto w-11/12 max-w-7xl space-y-16 py-16">
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white via-violet-50/60 to-white px-8 py-16 shadow-[0_40px_80px_-50px_rgba(79,70,229,0.35)] sm:px-12 md:px-16">
        <div className="absolute -left-24 top-10 h-40 w-40 rounded-full bg-violet-200/60 blur-3xl" aria-hidden />
        <div className="absolute -right-28 bottom-0 h-56 w-56 rounded-full bg-sky-200/50 blur-3xl" aria-hidden />

        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="space-y-6 text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-violet-700">
              <ShieldCheck className="size-4" />
              Our promise
            </span>
            <h1 className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Integrated care for every stage of the patient journey
            </h1>
            <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
              HealthSync Hospital blends clinical excellence with digital innovation. From urgent response to long-term recovery, our multidisciplinary teams choreograph every detail so patients and families can focus on healing.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button className="rounded-full bg-violet-600 px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-700">
                Explore specialties
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-slate-300 px-6 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400 hover:bg-white"
              >
                Request a callback
              </Button>
            </div>
          </div>

          <div className="grid gap-4 rounded-3xl border border-white/60 bg-white/75 p-6 shadow-xl backdrop-blur lg:p-8">
            <div className="flex items-center gap-4">
              <Bed className="size-10 rounded-full bg-violet-100 p-2 text-violet-600" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">
                  Centres of excellence
                </p>
                <p className="text-lg font-semibold text-slate-900">20+ specialised institutes</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Stethoscope className="size-10 rounded-full bg-violet-100 p-2 text-violet-600" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">
                  Clinicians on duty
                </p>
                <p className="text-lg font-semibold text-slate-900">350 consultants & Fellows</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Activity className="size-10 rounded-full bg-violet-100 p-2 text-violet-600" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">
                  Patient satisfaction
                </p>
                <p className="text-lg font-semibold text-slate-900">98% discharge happiness index</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
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
