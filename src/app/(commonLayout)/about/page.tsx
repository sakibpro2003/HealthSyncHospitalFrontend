"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Award,
  HeartPulse,
  Hospital,
  LineChart,
  Sparkles,
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
    <main className="relative mx-auto w-full space-y-16 py-16">
      <section className="relative overflow-hidden rounded-[2.75rem] bg-gradient-to-br from-white via-violet-50/70 to-white px-8 py-16 shadow-[0_40px_80px_-50px_rgba(79,70,229,0.35)] sm:px-12 md:px-16">
        <div className="absolute -left-28 top-0 h-48 w-48 rounded-full bg-violet-200/60 blur-3xl" aria-hidden />
        <div className="absolute -right-32 bottom-0 h-64 w-64 rounded-full bg-sky-200/55 blur-3xl" aria-hidden />
        <div className="relative grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-violet-700">
              <Sparkles className="size-4" />
              Since 1995
            </span>
            <h1 className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
              We are HealthSync Hospital — advancing care for every generation
            </h1>
            <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
              What started as a community initiative now supports more than 1.2 million patient journeys every year. Multidisciplinary teams, smart technology, and human kindness unite to deliver outcomes that families can trust.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button className="rounded-full bg-violet-600 px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-700">
                Meet our leadership
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-slate-300 px-6 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400 hover:bg-white"
              >
                Download impact report
              </Button>
            </div>
          </div>

          <div className="grid gap-4 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur lg:p-8">
            <div className="flex items-center gap-4">
              <Hospital className="size-10 rounded-full bg-violet-100 p-2 text-violet-600" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-500">Capacity</p>
                <p className="text-lg font-semibold text-slate-900">500+ smart beds across 12 towers</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Users className="size-10 rounded-full bg-violet-100 p-2 text-violet-600" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-500">Team</p>
                <p className="text-lg font-semibold text-slate-900">200+ consultants, 800 nursing superheroes</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <HeartPulse className="size-10 rounded-full bg-violet-100 p-2 text-violet-600" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-500">Care delivered</p>
                <p className="text-lg font-semibold text-slate-900">1.2M+ lives touched with 98% satisfaction</p>
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
