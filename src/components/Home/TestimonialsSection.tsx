"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetApprovedTestimonialsQuery } from "@/redux/features/testimonial/testimonialApi";
import { Quote, Star, Sparkles } from "lucide-react";

const formatDisplayDate = (value?: string) => {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
};

const TestimonialsSection = () => {
  const {
    data = [],
    isLoading,
    isError,
  } = useGetApprovedTestimonialsQuery({ limit: 8 });

  const testimonials = useMemo(() => data ?? [], [data]);

  return (
    <section className="relative isolate mx-auto mt-20 w-full max-w-6xl overflow-hidden rounded-[2.5rem] border border-white/50 bg-gradient-to-br from-white via-white to-indigo-50/70 px-4 py-12 shadow-[0_35px_90px_-50px_rgba(79,70,229,0.5)] sm:px-8 lg:px-12">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(124,58,237,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.08),transparent_30%),radial-gradient(circle_at_20%_80%,rgba(99,102,241,0.08),transparent_32%)]"
        aria-hidden
      />
      <div className="absolute -left-28 top-6 h-56 w-56 rounded-full bg-violet-200/40 blur-3xl" aria-hidden />
      <div className="absolute -right-24 bottom-4 h-48 w-48 rounded-full bg-sky-200/40 blur-3xl" aria-hidden />

      <div className="relative z-10 flex flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Badge className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-indigo-700 ring-1 ring-indigo-200/70">
              <Quote className="h-4 w-4" />
              Patient stories
            </Badge>
            <h2 className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
              Voices from the HealthSync community
            </h2>
            <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
              Every testimonial is verified by our admin team so only genuine experiences appear on the homepage.
            </p>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl border border-indigo-100 bg-white/90 px-4 py-4 text-sm text-slate-700 shadow-sm sm:max-w-xs">
            <div className="inline-flex items-center gap-2 text-indigo-700">
              <Sparkles className="h-4 w-4" />
              <span className="font-semibold">Share yours</span>
            </div>
            <p className="text-sm text-slate-600">
              Head to your patient dashboard to write a few words and inspire others.
            </p>
            <Button asChild className="rounded-full bg-indigo-600 text-white shadow-md hover:bg-indigo-700">
              <Link href="/patient">Write your story</Link>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-slate-600">Collecting recent testimonials...</p>
        ) : isError ? (
          <p className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            Unable to load testimonials at the moment.
          </p>
        ) : testimonials.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
            Approved testimonials will appear here once your admin team publishes them.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {testimonials.map((testimonial) => {
              const rating = Math.max(1, Math.round(testimonial.rating ?? 5));
              return (
                <article
                  key={testimonial._id}
                  className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-white/95 p-5 shadow-lg ring-1 ring-indigo-100/70 backdrop-blur"
                >
                  <div className="absolute right-4 top-4 flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={`${testimonial._id}-star-${index}`}
                        className="h-4 w-4"
                        fill={index < rating ? "#f59e0b" : "none"}
                        strokeWidth={index < rating ? 1.5 : 2}
                      />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700">
                    {testimonial.content}
                  </p>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {testimonial.patientName ?? "HealthSync patient"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDisplayDate(testimonial.updatedAt ?? testimonial.createdAt)}
                      </p>
                    </div>
                    <Badge className="rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                      Verified patient
                    </Badge>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
