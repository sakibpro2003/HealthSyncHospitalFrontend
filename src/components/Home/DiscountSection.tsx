import Link from "next/link";
import { ArrowRight, Clock3, ShieldCheck, Stethoscope } from "lucide-react";

const DiscountSection = () => {
  return (
    <section className="mx-auto mt-10 w-full px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[2.25rem] border border-white/60 bg-gradient-to-br from-violet-700 via-indigo-600 to-purple-700 shadow-2xl ring-1 ring-violet-200/40">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.12),transparent_32%),radial-gradient(circle_at_15%_70%,rgba(109,40,217,0.2),transparent_30%)]"
          aria-hidden
        />
        <div className="absolute -right-16 -top-10 h-56 w-56 rounded-full bg-white/20 blur-3xl" aria-hidden />
        <div className="absolute -left-12 bottom-0 h-48 w-48 rounded-full bg-violet-400/25 blur-3xl" aria-hidden />

        <div className="relative mx-auto grid w-full items-center gap-10 px-8 py-14 text-white md:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-12 lg:py-16">
          <div className="space-y-5 text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] ring-1 ring-white/20">
              <Clock3 className="size-4" />
              Limited Time
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black leading-tight md:text-4xl">
                Save 25% on annual wellness packages
              </h3>
              <p className="max-w-2xl text-sm text-white/85 md:text-base">
                Lock in comprehensive diagnostics, personalised care coaching, and priority booking for less.
                Crafted for proactive patients who want hospital-grade care with concierge-level access.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {[
                { icon: Stethoscope, label: "Annual diagnostics bundle" },
                { icon: ShieldCheck, label: "Priority booking & support" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold ring-1 ring-white/20 backdrop-blur"
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-white/20 text-violet-50 ring-1 ring-white/10">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-white/95">{label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/medicine"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-violet-700 shadow-lg shadow-violet-400/25 transition hover:-translate-y-0.5 hover:bg-violet-50"
              >
                Activate offer
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/departmentalDoctors"
                className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                View packages
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 -top-10 h-32 w-32 rounded-full bg-white/15 blur-3xl" aria-hidden />
            <div className="relative overflow-hidden rounded-3xl bg-white/10 p-6 shadow-2xl shadow-indigo-900/30 ring-1 ring-white/20 backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">Annual plan</p>
                  <p className="text-5xl font-black text-white">25% off</p>
                  <p className="text-sm text-white/70">Lock pricing before the offer ends.</p>
                </div>
                <div className="rounded-2xl bg-white/15 px-4 py-3 text-right text-sm font-semibold text-white ring-1 ring-white/20">
                  <p>Ends soon</p>
                  <p className="text-xs font-normal text-white/80">Limited redemptions</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/20">
                  <p>Comprehensive labs</p>
                  <p className="text-xs font-normal text-white/75">CBC, lipid panel, cardiac, metabolic</p>
                </div>
                <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/20">
                  <p>Personalised coaching</p>
                  <p className="text-xs font-normal text-white/75">Monthly follow-ups with clinicians</p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-sm text-white ring-1 ring-white/20">
                <div>
                  <p className="font-semibold">Next available slot</p>
                  <p className="text-xs text-white/75">Book in under 5 minutes</p>
                </div>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                  Today
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscountSection;
