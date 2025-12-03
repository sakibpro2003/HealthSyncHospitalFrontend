"use client";

import PackageCard from "@/components/Home/PackageCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeartPulse, ShieldCheck, Sparkles } from "lucide-react";

const HealthPackagesPage = () => {
  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(168,85,247,0.2),transparent_40%),radial-gradient(circle_at_82%_12%,rgba(79,70,229,0.22),transparent_38%),radial-gradient(circle_at_50%_80%,rgba(124,58,237,0.15),transparent_40%)]" />
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div className="relative z-10 space-y-4 text-white lg:w-3/5">
            <Badge className="w-fit rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-purple-50">
              Preventive care
            </Badge>
            <div className="space-y-3">
              <h1 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                Health checkup packages built for your lifestyle
              </h1>
              <p className="max-w-3xl text-base text-purple-100/80 sm:text-lg">
                Compare packages, see exactly what&apos;s included, and lock in ongoing care with transparent pricing. All plans are connected to HealthSync so you can track results and follow-ups.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-purple-100/90">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                <Sparkles className="h-4 w-4 text-purple-200" />
                Evidence-based screenings
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                <HeartPulse className="h-4 w-4 text-purple-200" />
                Ongoing vitals monitoring
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                <ShieldCheck className="h-4 w-4 text-purple-200" />
                Transparent pricing
              </span>
            </div>
          </div>

          <div className="relative z-10 w-full max-w-sm self-stretch overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-2xl shadow-purple-900/40 backdrop-blur">
            <p className="text-sm font-semibold text-purple-100/90">
              Not sure which plan fits?
            </p>
            <p className="mt-2 text-base text-purple-50/85">
              Start with a quick health profile and we&apos;ll suggest the best checkup for your needs.
            </p>
            <div className="mt-4 grid gap-2 text-sm text-purple-100/85">
              <span className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2">
                General wellness • Lifestyle screening
              </span>
              <span className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2">
                Executive checkup • Cardiac focus
              </span>
              <span className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2">
                Women&apos;s health • Diabetes care
              </span>
            </div>
            <Button className="mt-5 w-full rounded-full bg-white text-sm font-semibold text-violet-800 shadow-lg shadow-purple-500/25 transition hover:-translate-y-0.5 hover:bg-purple-50">
              Get a recommendation
            </Button>
          </div>
        </div>
      </section>

      <PackageCard />
    </main>
  );
};

export default HealthPackagesPage;
