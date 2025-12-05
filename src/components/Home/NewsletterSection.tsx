"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, CheckCircle2 } from "lucide-react";
import { useSubscribeMutation } from "@/redux/features/newsletter/newsletterApi";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [subscribe, { isLoading }] = useSubscribeMutation();

  const benefits = useMemo(
    () => [
      "Weekly wellness insights",
      "Early access to health events",
      "Personalised appointment alerts",
    ],
    [],
  );

  const handleSubscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!EMAIL_REGEX.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      await subscribe({ email }).unwrap();
      toast.success("Thank you for subscribing to HealthSync updates!");
      setEmail("");
    } catch (err: unknown) {
      const fallback = "Unable to subscribe right now. Please try again.";
      const parsedError = err as { data?: { message?: string } };
      toast.error(parsedError?.data?.message ?? fallback);
    }
  };

  return (
    <section className="relative isolate mx-auto mt-20 w-full overflow-hidden rounded-[2.5rem] border border-white/15 bg-linear-to-br from-white/95 via-white/85 to-indigo-50/80 px-4 py-16 shadow-[0_35px_80px_-40px_rgba(79,70,229,0.45)] backdrop-blur sm:px-6 lg:px-10">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(124,58,237,0.1),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.08),transparent_32%),radial-gradient(circle_at_10%_80%,rgba(99,102,241,0.08),transparent_30%)]"
        aria-hidden
      />
      <div className="absolute -right-28 top-0 h-60 w-60 rounded-full bg-violet-200/55 blur-3xl" aria-hidden />
      <div className="absolute -left-24 bottom-0 h-48 w-48 rounded-full bg-indigo-200/50 blur-3xl" aria-hidden />

      <div className="relative z-10 grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div className="flex flex-col gap-5">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-violet-100 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-violet-700 ring-1 ring-violet-200/80">
            <Mail className="size-4" />
            Stay in the loop
          </span>
          <h2 className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
            Subscribe to HealthSync updates and never miss a breakthrough
          </h2>
          <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
            Join a fast-growing community of patients, clinicians, and hospital leaders receiving curated updates on new services,
            preventative care tips, and platform enhancements.
          </p>

          <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="inline-flex items-center gap-3 rounded-2xl border border-violet-100 bg-white/90 px-4 py-3 shadow-sm"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200/60">
                  <CheckCircle2 className="size-5" />
                </span>
                <p className="font-semibold text-slate-900">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-violet-100/80 bg-white/90 p-6 shadow-lg shadow-violet-200/50 ring-1 ring-violet-50 backdrop-blur">
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-600">
                Weekly dispatch
              </p>
              <p className="text-lg font-semibold text-slate-900">
                Insights crafted by our medical experts and digital care team
              </p>
            </div>

            <form
              onSubmit={handleSubscribe}
              className="flex w-full flex-col gap-3"
            >
              <div className="relative flex-1">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-12 rounded-2xl border-violet-100 bg-white/95 pr-12 text-base text-slate-800 placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                  aria-label="Email address"
                  required
                />
                <Mail className="absolute right-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" aria-hidden />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 rounded-2xl bg-violet-600 px-6 text-sm font-semibold text-white shadow-md transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-80"
              >
                {isLoading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>

            <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200/70">
                Safe unsubscribe anytime
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200/70">
                No spam, just value
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
