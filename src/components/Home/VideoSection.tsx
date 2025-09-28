"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Clock, PlayCircle, ShieldCheck, Users } from "lucide-react";

interface VideoSectionProps {
  title?: string;
  videoUrl: string; // Use proper embed link
}

const VideoSection: React.FC<VideoSectionProps> = ({
  title = "Watch Our Introduction",
  videoUrl,
}) => {
  return (
    <section className="relative isolate mx-auto w-11/12 max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full flex-col overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-white via-violet-50/70 to-white/60 shadow-2xl ring-1 ring-slate-200/60">
        <div className="relative flex flex-col gap-10 px-6 py-10 md:flex-row md:items-center md:px-12 md:py-14">
          <div className="absolute -left-16 top-12 hidden h-36 w-36 rounded-full bg-violet-200/60 blur-3xl md:block" aria-hidden />
          <div className="absolute -right-10 bottom-6 hidden h-48 w-48 rounded-full bg-sky-200/50 blur-3xl md:block" aria-hidden />

          <div className="relative z-10 flex-1 space-y-6 text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-violet-600">
              <PlayCircle className="size-4" />
              Intro Video
            </span>

            <h2 className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {title}
            </h2>

            <p className="max-w-xl text-base text-slate-600 sm:text-lg">
              Take a guided tour through HealthSync Hospital. Discover how our
              digital ecosystem connects departments, empowers clinicians, and
              keeps every patient journey transparent from admission to
              discharge.
            </p>

            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 font-medium shadow-sm">
                <Clock className="size-4 text-violet-500" />
                4 minute overview
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 font-medium shadow-sm">
                <Users className="size-4 text-violet-500" />
                Collaborative workflows
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 font-medium shadow-sm">
                <ShieldCheck className="size-4 text-violet-500" />
                Enterprise grade security
              </span>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button className="rounded-full bg-violet-600 px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-700">
                Watch Full Demo
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-slate-300 px-6 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400 hover:bg-white"
              >
                Download Brochure
              </Button>
            </div>
          </div>

          <div className="relative z-10 flex-1">
            <div className="relative mx-auto aspect-video w-full max-w-xl overflow-hidden rounded-[1.75rem] border border-white/70 shadow-xl">
              <iframe
                className="size-full"
                src={videoUrl}
                title="Introduction video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-white/5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
