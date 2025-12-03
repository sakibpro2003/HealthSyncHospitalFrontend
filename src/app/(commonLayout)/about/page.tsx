"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  HeartPulse,
  Hospital,
  LineChart,
  Target,
  Users,
} from "lucide-react";

const pillars = [
  {
    title: "Compassion",
    description: "Every interaction begins with empathy. We listen deeply and tailor care to each patient’s story.",
  },
  {
    title: "Innovation",
    description: "We invest in research, technology, and training so better outcomes happen sooner for our community.",
  },
  {
    title: "Accountability",
    description: "Transparent reporting, ethical practice, and measurable impact guide every decision we make.",
  },
];

const milestones = [
  {
    year: "1995",
    heading: "Community clinic to cornerstone hospital",
    copy: "Twenty dedicated clinicians transformed a two-storey clinic into a 120-bed hospital serving the greater Dhaka region.",
  },
  {
    year: "2008",
    heading: "Launch of digital radiology",
    copy: "We pioneered fully digital imaging and cross-department PACS sharing, accelerating diagnoses by 40%.",
  },
  {
    year: "2016",
    heading: "Centres of excellence",
    copy: "Dedicated institutes for cardio, neuro, and oncology care opened with international accreditation.",
  },
  {
    year: "2024",
    heading: "HealthSync platform rollout",
    copy: "Patients now control appointments, records, and telehealth from a single secure portal backed by AI triage.",
  },
];

const leaders = [
  {
    name: "Dr. Ayesha Rahman",
    role: "Chief Medical Officer",
    bio: "Cardiothoracic surgeon advocating data-driven quality metrics and compassionate bedside care.",
  },
  {
    name: "Dr. Tanvir Ahmed",
    role: "Director of Research",
    bio: "Oncology specialist leading precision medicine trials and international clinical collaborations.",
  },
  {
    name: "Dr. Nusrat Jahan",
    role: "Head of Patient Experience",
    bio: "Pediatrician focused on family engagement programmes and inclusive care policies.",
  },
];

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(168,85,247,0.2),transparent_40%),radial-gradient(circle_at_82%_12%,rgba(79,70,229,0.22),transparent_38%),radial-gradient(circle_at_50%_80%,rgba(124,58,237,0.15),transparent_40%)]" />
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div className="relative z-10 space-y-4 text-white lg:w-3/5">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-purple-50">
              Since 1995
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                HealthSync Hospital—care, data, and people working as one
              </h1>
              <p className="max-w-3xl text-base text-purple-100/80 sm:text-lg">
                From a community clinic to a digitally enabled hospital network, we align teams, technology, and compassion to deliver trusted outcomes for every generation.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-violet-800 shadow-lg shadow-purple-500/20 transition hover:-translate-y-0.5 hover:bg-purple-50">
                Meet our leadership
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
                <Hospital className="h-4 w-4 text-purple-200" />
                500+ smart beds
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                <Users className="h-4 w-4 text-purple-200" />
                200+ consultants
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                <HeartPulse className="h-4 w-4 text-purple-200" />
                1.2M+ lives, 98% satisfaction
              </span>
            </div>
          </div>

          <div className="relative z-10 w-full max-w-md self-stretch overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-2xl shadow-purple-900/40 backdrop-blur">
            <p className="text-sm font-semibold text-purple-100/90">
              Unified ecosystem
            </p>
            <div className="mt-4 grid gap-3 text-sm text-purple-50/90">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3">
                Doctors directory → <span className="font-semibold">/doctors</span>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3">
                Health checkup bundles → <span className="font-semibold">/health-packages</span>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3">
                Patient-first services → explore below
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {pillars.map(({ title, description }) => (
          <Card key={title} className="h-full rounded-3xl border border-white/60 bg-white/85 shadow-lg backdrop-blur">
            <CardContent className="space-y-3 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-500">Our pillar</p>
              <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
              <p className="text-sm text-slate-600">{description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-6">
        <header className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Our journey in milestones</h2>
          <p className="max-w-3xl text-sm text-slate-600 sm:text-base">
            Each chapter reflects the trust of our community and the relentless curiosity of our teams. Together we have evolved from bedside care to a digitally empowered hospital network.
          </p>
        </header>

        <ol className="relative space-y-8 border-l border-violet-200 pl-6">
          {milestones.map(({ year, heading, copy }) => (
            <li key={year} className="relative ml-4 space-y-2">
              <span className="absolute -left-[38px] top-1.5 flex size-7 items-center justify-center rounded-full border border-violet-300 bg-white text-xs font-semibold text-violet-600">
                {year}
              </span>
              <h3 className="text-lg font-semibold text-slate-900">{heading}</h3>
              <p className="text-sm text-slate-600">{copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Leadership who make it happen</h2>
            <p className="max-w-3xl text-sm text-slate-600 sm:text-base">
              A multidisciplinary leadership collective steers clinical excellence, technology adoption, and community outreach.
            </p>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {leaders.map(({ name, role, bio }) => (
            <Card key={name} className="h-full rounded-3xl border border-white/60 bg-white/85 shadow-lg backdrop-blur">
              <CardContent className="space-y-4 p-6">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-violet-200 to-violet-100" />
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
                  <p className="text-sm font-medium text-violet-600">{role}</p>
                </div>
                <p className="text-sm text-slate-600">{bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-[2.5rem] border border-white/15 bg-gradient-to-r from-violet-600 via-violet-500 to-purple-500 px-8 py-12 text-white shadow-[0_30px_70px_-45px_rgba(91,33,182,0.65)] sm:px-12 md:grid-cols-2 md:px-16">
        <div className="space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-violet-100">
            <Target className="size-4" />
            Our mission
          </p>
          <h2 className="text-3xl font-black leading-tight lg:text-4xl">Building the most trusted, outcomes-driven healthcare network in Bangladesh.</h2>
          <p className="text-sm text-violet-100 sm:text-base">
            We partner with communities, universities, and startups to bring next-generation care closer to home while upholding the warmth of personalised medicine.
          </p>
        </div>
        <div className="grid gap-4 rounded-3xl bg-white/15 p-6 shadow-inner backdrop-blur">
          <div className="flex items-center gap-3">
            <LineChart className="size-8 text-white" />
            <div>
              <p className="text-sm font-semibold text-violet-100">Sustainably growing impact</p>
              <p className="text-lg font-semibold">30% year-on-year increase in patient outcomes index</p>
            </div>
          </div>
          <Button className="mt-2 w-fit rounded-full bg-white px-5 py-2 text-sm font-semibold text-violet-600 shadow-md transition hover:bg-violet-100">
            Explore community initiatives
          </Button>
        </div>
      </section>
    </main>
  );
}
