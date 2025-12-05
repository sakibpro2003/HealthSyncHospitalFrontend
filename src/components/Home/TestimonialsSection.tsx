"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useClientUser } from "@/hooks/useClientUser";
import {
  useGetApprovedTestimonialsQuery,
  useSubmitTestimonialMutation,
} from "@/redux/features/testimonial/testimonialApi";
import { Quote, Star, Sparkles } from "lucide-react";
import { toast } from "sonner";

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
  const [formState, setFormState] = useState({ content: "", rating: 5 });
  const { user } = useClientUser();

  const {
    data = [],
    isLoading,
    isError,
  } = useGetApprovedTestimonialsQuery({ limit: 8 });

  const [submitTestimonial, { isLoading: isSubmitting }] =
    useSubmitTestimonialMutation();

  const testimonials = useMemo(() => data ?? [], [data]);

  const featured = testimonials[0] ?? {
    patientName: "User 1",
    content: "The care team was attentive and explained every step.",
    updatedAt: "2025-12-04T00:00:00Z",
    rating: 5,
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.content.trim()) {
      toast.error("Please share a few words about your experience");
      return;
    }

    if (!user) {
      toast.error("Please log in as a patient to submit a testimonial");
      return;
    }

    try {
      await submitTestimonial({
        content: formState.content.trim(),
        rating: formState.rating,
        patientName: (user as { name?: string })?.name,
      }).unwrap();

      toast.success("Thanks! Your testimonial is awaiting approval.");
      setFormState({ content: "", rating: 5 });
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof (error as { data?: { message?: unknown } }).data?.message === "string"
      ) {
        toast.error((error as { data: { message: string } }).data.message);
        return;
      }

      toast.error("Unable to submit testimonial right now");
    }
  };

  return (
    <section className="relative isolate mx-auto mt-20 w-full overflow-hidden rounded-[2.5rem] border border-white/50 bg-gradient-to-br from-white via-white to-indigo-50/70 px-4 py-12 shadow-[0_35px_90px_-50px_rgba(79,70,229,0.5)] sm:px-6 lg:px-8">
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
              Write a few words right here and inspire others.
            </p>
            <Button asChild className="rounded-full bg-indigo-600 text-white shadow-md hover:bg-indigo-700">
              <Link href="#share-testimonial-home">Write your story</Link>
            </Button>
          </div>
        </div>

        <div
          id="share-testimonial-home"
          className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <article className="rounded-3xl border border-violet-100 bg-gradient-to-br from-white via-violet-50 to-white p-6 shadow-lg ring-1 ring-violet-100">
            <header className="flex items-start gap-3 text-violet-700">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 ring-1 ring-violet-200/70">
                <Quote className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-violet-600">Patient voice</p>
                <h3 className="text-xl font-semibold text-slate-900">Share your experience</h3>
                <p className="text-sm text-slate-600">
                  Tell us how your care went. We will review your words before publishing them on the homepage.
                </p>
              </div>
            </header>

            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="testimonial-message">Your testimonial</Label>
                <Textarea
                  id="testimonial-message"
                  rows={5}
                  placeholder="E.g., The care team was attentive and explained every step."
                  value={formState.content}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      content: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border border-violet-100 bg-white/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Rate your experience</p>
                  <p className="text-xs text-slate-500">Tap to select between 1 (poor) and 5 (excellent).</p>
                </div>
                <div className="flex items-center gap-1" role="group" aria-label="Select rating">
                  {[1, 2, 3, 4, 5].map((value) => {
                    const isActive = formState.rating >= value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setFormState((prev) => ({
                            ...prev,
                            rating: value,
                          }))
                        }
                        className={`rounded-full p-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 ${isActive ? "text-amber-500" : "text-slate-300 hover:text-amber-400"}`}
                        aria-label={`${value} star rating`}
                      >
                        <Star
                          className="h-5 w-5"
                          fill={isActive ? "#f59e0b" : "none"}
                          strokeWidth={isActive ? 1.5 : 2}
                        />
                      </button>
                    );
                  })}
                  <span className="ml-2 text-xs font-semibold text-amber-700">
                    {formState.rating}/5
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <Badge className="rounded-full bg-violet-100 text-violet-700 ring-1 ring-violet-200">
                  Reviewed by admin before publishing
                </Badge>
                <span>We aim to approve testimonials within one business day.</span>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Submitting..." : "Submit testimonial"}
              </Button>
            </form>
          </article>

          <article className="rounded-3xl border border-indigo-100 bg-white/90 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Featured voice</p>
                <h4 className="text-lg font-semibold text-slate-900">{featured.patientName ?? "HealthSync patient"}</h4>
              </div>
              <Badge className="rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">Verified patient</Badge>
            </div>
            <p className="mt-2 text-xs text-slate-500">{formatDisplayDate(featured.updatedAt)}</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-700">{featured.content}</p>
            <div className="mt-4 flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={`featured-${index}`}
                  className="h-4 w-4"
                  fill={index < Math.max(1, Math.round(featured.rating ?? 5)) ? "#f59e0b" : "none"}
                  strokeWidth={index < Math.max(1, Math.round(featured.rating ?? 5)) ? 1.5 : 2}
                />
              ))}
              <span className="ml-1 text-xs font-semibold text-amber-700">{Math.max(1, Math.round(featured.rating ?? 5))}/5</span>
            </div>
          </article>
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
