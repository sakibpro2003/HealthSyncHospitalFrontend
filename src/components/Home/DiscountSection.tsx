import Link from "next/link";
import { ArrowRight, Clock3, ShieldCheck, Stethoscope } from "lucide-react";

const DiscountSection = () => {
  return (
      <div className="relative w-full overflow-hidden rounded-[2.25rem] border border-violet-100 bg-linear-to-br from-white via-white to-violet-50 shadow-2xl ring-1 ring-violet-100/70">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.08),transparent_32%),radial-gradient(circle_at_15%_70%,rgba(99,102,241,0.1),transparent_30%)]"
          aria-hidden
        />
        <div className="absolute -right-16 -top-10 h-56 w-56 rounded-full bg-violet-200/40 blur-3xl" aria-hidden />
        <div className="absolute -left-12 bottom-0 h-48 w-48 rounded-full bg-sky-200/35 blur-3xl" aria-hidden />

        <div className="relative mx-auto grid w-full items-center gap-10 px-8 py-14 text-slate-900 md:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-12 lg:py-16">
          <div className="space-y-5 text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-violet-700 ring-1 ring-violet-200">
              <Clock3 className="size-4" />
              Limited Time
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black leading-tight text-slate-900 md:text-4xl">
                Save 25% on annual wellness packages
              </h3>
              <p className="max-w-2xl text-sm text-slate-600 md:text-base">
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
                  className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-800 ring-1 ring-violet-100 shadow-sm"
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-violet-100 text-violet-700 ring-1 ring-violet-200/70">
                    <Icon className="size-5" />
                  </span>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/medicine"
                className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-300/30 transition hover:-translate-y-0.5 hover:bg-violet-700"
              >
                Activate offer
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/departmentalDoctors"
                className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-6 py-3 text-sm font-semibold text-violet-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-violet-50"
              >
                View packages
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 -top-10 h-32 w-32 rounded-full bg-violet-100/60 blur-3xl" aria-hidden />
            <div className="relative overflow-hidden rounded-3xl bg-white/90 p-6 shadow-2xl shadow-violet-200/60 ring-1 ring-violet-100 backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Annual plan</p>
                  <p className="text-5xl font-black text-slate-900">25% off</p>
                  <p className="text-sm text-slate-600">Lock pricing before the offer ends.</p>
                </div>
                <div className="rounded-2xl bg-violet-50 px-4 py-3 text-right text-sm font-semibold text-violet-700 ring-1 ring-violet-100">
                  <p>Ends soon</p>
                  <p className="text-xs font-normal text-violet-600">Limited redemptions</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-violet-50 px-4 py-3 text-sm font-semibold text-slate-800 ring-1 ring-violet-100">
                  <p>Comprehensive labs</p>
                  <p className="text-xs font-normal text-slate-600">CBC, lipid panel, cardiac, metabolic</p>
                </div>
                <div className="rounded-2xl bg-violet-50 px-4 py-3 text-sm font-semibold text-slate-800 ring-1 ring-violet-100">
                  <p>Personalised coaching</p>
                  <p className="text-xs font-normal text-slate-600">Monthly follow-ups with clinicians</p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-2xl bg-violet-50 px-4 py-3 text-sm text-slate-800 ring-1 ring-violet-100">
                <div>
                  <p className="font-semibold">Next available slot</p>
                  <p className="text-xs text-slate-600">Book in under 5 minutes</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-violet-700 ring-1 ring-violet-100">
                  Today
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default DiscountSection;
