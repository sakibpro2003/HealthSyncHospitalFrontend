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
    <section className="relative isolate w-full px-4 py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-200 via-violet-100 to-white" aria-hidden />
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/95 via-white/80 to-violet-50/80 px-6 py-10 shadow-[0_40px_80px_-40px_rgba(30,41,59,0.55)] backdrop-blur md:px-16 md:py-16">
        <div className="relative">
          <div className="absolute -left-20 top-0 h-40 w-40 rounded-full bg-violet-200/60 blur-3xl" aria-hidden />
          <div className="absolute -right-12 bottom-6 h-48 w-48 rounded-full bg-sky-200/50 blur-3xl" aria-hidden />

          <div className="relative z-10 flex flex-col gap-10 text-center md:text-left">
            <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-violet-700">
                <Mail className="size-4" />
                Stay in the loop
              </span>
              <p className="text-sm text-slate-500 md:mt-1">
                Insights crafted by our medical experts and digital care team
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl lg:text-[2.9rem]">
                Subscribe to HealthSync updates and never miss a breakthrough
              </h2>
              <p className="mx-auto max-w-3xl text-base text-slate-600 sm:text-lg md:mx-0">
                Join a fast-growing community of patients, clinicians, and hospital leaders receiving curated updates on new services,
                preventative care tips, and platform enhancements.
              </p>
            </div>

            <form
              onSubmit={handleSubscribe}
              className="mx-auto flex w-full flex-col gap-4 rounded-2xl bg-white/80 p-4 shadow-lg backdrop-blur md:mx-0 md:flex-row md:items-center"
            >
              <div className="relative flex-1">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-12 rounded-xl border-slate-200 bg-white/90 pr-12 text-base text-slate-800 placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                  aria-label="Email address"
                  required
                />
                <Mail className="absolute right-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" aria-hidden />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 rounded-xl bg-violet-600 px-6 text-sm font-semibold text-white shadow-md transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-80"
              >
                {isLoading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>

            <ul className="flex flex-col gap-3 text-sm text-slate-600 md:flex-row md:flex-wrap md:gap-5">
              {benefits.map((benefit) => (
                <li key={benefit} className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-4 py-2 shadow-sm">
                  <CheckCircle2 className="size-4 text-violet-500" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
