"use client";

import Link from "next/link";
import {
  Baby,
  Bone,
  Brain,
  Droplets,
  HeartPulse,
  MessageCircleHeart,
  Radiation,
  Ribbon,
  SmilePlus,
  Stethoscope,
  Sun,
  Ambulance,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { useEffect, useMemo, useRef } from "react";

const departments = [
  { name: "Cardiology", slug: "Cardiology" },
  { name: "Neurology", slug: "Neurology" },
  { name: "Orthopedics", slug: "Orthopedics" },
  { name: "Pediatrics", slug: "Pediatrics" },
  { name: "Dermatology", slug: "Dermatology" },
  { name: "General Medicine", slug: "General" },
  { name: "Radiology", slug: "Radiology" },
  { name: "Psychiatry", slug: "Psychiatry" },
  { name: "Emergency Care", slug: "Emergency" },
  { name: "Dental", slug: "Dental" },
  { name: "Oncology", slug: "Oncology" },
  { name: "Urology", slug: "Urology" },
];

const departmentIcons: Record<string, LucideIcon> = {
  Cardiology: HeartPulse,
  Neurology: Brain,
  Orthopedics: Bone,
  Pediatrics: Baby,
  Dermatology: Sun,
  "General Medicine": Stethoscope,
  Radiology: Radiation,
  Psychiatry: MessageCircleHeart,
  "Emergency Care": Ambulance,
  Dental: SmilePlus,
  Oncology: Ribbon,
  Urology: Droplets,
};

const DepartmentButtons = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const items = useMemo(() => departments, []);

  useEffect(() => {
    const section = sectionRef.current;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!section || prefersReducedMotion) {
      return;
    }

    const cards = cardRefs.current;
    // Prime initial states to avoid flashes before animating.
    headingRef.current?.style.setProperty("opacity", "0");
    cards.forEach((card) => {
      if (card) {
        card.style.opacity = "0";
        card.style.transform = "translateY(18px) scale(0.98)";
      }
    });

    const animateIn = () => {
      headingRef.current?.animate(
        [
          { opacity: 0, transform: "translateY(14px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 600, easing: "cubic-bezier(0.33, 1, 0.68, 1)", fill: "forwards" },
      );

      cards.forEach((card, index) => {
        if (!card) return;
        card.animate(
          [
            { opacity: 0, transform: "translateY(18px) scale(0.98)" },
            { opacity: 1, transform: "translateY(0) scale(1)" },
          ],
          {
            duration: 650,
            delay: 100 + index * 60,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards",
          },
        );
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateIn();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.35 },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative mx-auto mt-16 w-full overflow-hidden rounded-[2.5rem] border border-white/15 bg-linear-to-br from-white/95 via-white/80 to-violet-50/80 px-6 py-14 shadow-[0_35px_80px_-40px_rgba(79,70,229,0.35)] backdrop-blur sm:px-10"
      >
        <div
          className="hs-floating-blob absolute -left-24 top-0 h-40 w-40 rounded-full bg-violet-200/60 blur-3xl"
          aria-hidden
        />
        <div
          className="hs-floating-blob absolute -right-24 bottom-0 h-48 w-48 rounded-full bg-sky-200/50 blur-3xl"
          aria-hidden
        />
        <div
          className="hs-gradient-ring pointer-events-none absolute inset-4 rounded-[2rem] border border-white/30"
          aria-hidden
        />

        <div
          ref={headingRef}
          className="relative mx-auto flex w-full flex-col items-center gap-3 px-2 text-center sm:px-6 lg:px-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-violet-500">
            Our specialists
          </p>
          <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
            Find the right doctor
          </h2>
          <p className="max-w-3xl text-sm text-slate-600 sm:text-base">
            Search by department and connect with leading consultants across the HealthSync network. Every profile includes availability windows, digital records, and patient satisfaction insights.
          </p>
        </div>

        <div className="relative mx-auto mt-10 grid w-full gap-4 px-2 sm:grid-cols-2 md:grid-cols-3 lg:px-8 xl:grid-cols-4">
          {items.map((dept, idx) => {
            const Icon =
              departmentIcons[dept.name] ?? departmentIcons["General Medicine"];

            return (
              <Link
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                key={dept.slug}
                href={`/departmentalDoctors/${dept.slug}`}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "group relative h-auto justify-start rounded-2xl border border-white/50 bg-white/80 p-5 text-left shadow-lg shadow-violet-200/50 transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl"
                )}
              >
                <span className="hs-card-shimmer" aria-hidden />
                <span className="absolute inset-x-5 bottom-5 h-[3px] rounded-full bg-gradient-to-r from-violet-500/80 to-indigo-500/80 opacity-0 transition group-hover:opacity-100" />
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-base font-semibold text-slate-900">
                      {dept.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Consult top specialists
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <style jsx global>{`
        @keyframes hs-float {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.02); }
          100% { transform: translateY(0px) scale(1); }
        }
        @keyframes hs-glow {
          0% { opacity: 0.35; }
          50% { opacity: 0.7; }
          100% { opacity: 0.35; }
        }
        @keyframes hs-shimmer {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(220%); }
        }

        .hs-floating-blob {
          animation: hs-float 12s ease-in-out infinite;
        }
        .hs-gradient-ring {
          background: radial-gradient(120% 120% at 50% 30%, rgba(99, 102, 241, 0.08), transparent),
            linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0));
          mask-image: radial-gradient(80% 80% at 50% 50%, black, transparent 75%);
          animation: hs-glow 10s ease-in-out infinite;
        }
        .hs-card-shimmer {
          position: absolute;
          inset: 1px;
          border-radius: 1rem;
          overflow: hidden;
          pointer-events: none;
        }
        .hs-card-shimmer::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent, rgba(99, 102, 241, 0.12), transparent);
          transform: translateX(-120%);
          transition: opacity 0.3s ease;
        }
        a.group:hover .hs-card-shimmer::after,
        a.group:focus-visible .hs-card-shimmer::after {
          animation: hs-shimmer 1.25s ease;
        }
      `}</style>
    </>
  );
};

export default DepartmentButtons;
