"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGetInventorySummaryQuery } from "@/redux/features/bloodBank/bloodBankApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Droplets } from "lucide-react";
import Link from "next/link";

const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

const BloodAvailability = () => {
  const { data, isLoading, isError } = useGetInventorySummaryQuery();

  const summary = useMemo(() => data ?? {}, [data]);
  const groupDetails = useMemo(
    () =>
      BLOOD_GROUPS.map((group) => {
        const units = Number(summary[group] ?? 0);
        const status = units === 0 ? "Critical" : units <= 5 ? "Low" : "Healthy";

        const styles =
          status === "Healthy"
            ? {
                badge: "bg-violet-50 text-violet-700 ring-violet-200/60",
                meter: "bg-violet-500",
                note: "Adequate supply",
              }
            : status === "Low"
              ? {
                  badge: "bg-amber-50 text-amber-800 ring-amber-200/60",
                  meter: "bg-amber-500",
                  note: "Prioritise donations",
                }
              : {
                  badge: "bg-rose-50 text-rose-700 ring-rose-200/70",
                  meter: "bg-rose-500",
                  note: "Immediate need",
                };

        return { group, units, status, ...styles };
      }),
    [summary],
  );

  const metrics = useMemo(
    () => ({
      totalUnits: groupDetails.reduce((acc, item) => acc + item.units, 0),
      healthyGroups: groupDetails.filter((item) => item.status === "Healthy").length,
      lowGroups: groupDetails.filter((item) => item.status === "Low").length,
      criticalGroups: groupDetails.filter((item) => item.status === "Critical").length,
    }),
    [groupDetails],
  );

  const metricTiles = useMemo(
    () => [
      { label: "Total units", value: metrics.totalUnits },
      { label: "Healthy groups", value: metrics.healthyGroups },
      { label: "Low supply", value: metrics.lowGroups },
      { label: "Critical", value: metrics.criticalGroups },
    ],
    [metrics],
  );

  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const metricRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const header = headerRef.current;
    const activeMetricNodes = metricRefs.current.slice(0, metricTiles.length);
    const activeCardNodes = cardRefs.current.slice(0, groupDetails.length);

    if (prefersReducedMotion) {
      header?.style.removeProperty("opacity");
      header?.style.removeProperty("transform");
      activeMetricNodes.forEach((node) => {
        if (node) {
          node.style.removeProperty("opacity");
          node.style.removeProperty("transform");
          node.style.removeProperty("filter");
        }
      });
      activeCardNodes.forEach((node) => {
        if (node) {
          node.style.removeProperty("opacity");
          node.style.removeProperty("transform");
          node.style.removeProperty("filter");
        }
      });
      return;
    }

    header?.style.setProperty("opacity", "0");
    header?.style.setProperty("transform", "translateY(12px)");
    activeMetricNodes.forEach((node) => {
      if (node) {
        node.style.opacity = "0";
        node.style.transform = "translateY(14px)";
        node.style.filter = "blur(4px)";
      }
    });
    activeCardNodes.forEach((node) => {
      if (node) {
        node.style.opacity = "0";
        node.style.transform = "translateY(18px) scale(0.98)";
        node.style.filter = "blur(6px)";
      }
    });

    const animateIn = () => {
      header?.animate(
        [
          { opacity: 0, transform: "translateY(12px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 650, easing: "cubic-bezier(0.33, 1, 0.68, 1)", fill: "forwards" },
      );

      activeMetricNodes.forEach((node, idx) => {
        if (!node) return;
        node.animate(
          [
            { opacity: 0, transform: "translateY(14px)", filter: "blur(4px)" },
            { opacity: 1, transform: "translateY(0)", filter: "blur(0px)" },
          ],
          {
            duration: 520,
            delay: 80 + idx * 60,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards",
          },
        );
      });

      activeCardNodes.forEach((node, idx) => {
        if (!node) return;
        node.animate(
          [
            { opacity: 0, transform: "translateY(18px) scale(0.98)", filter: "blur(6px)" },
            { opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0px)" },
          ],
          {
            duration: 620,
            delay: 200 + idx * 70,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards",
          },
        );
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          animateIn();
          observer.disconnect();
        }
      },
      { threshold: 0.32 },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [groupDetails.length, metricTiles]);

  return (
    <section
      ref={sectionRef}
      className="relative text-purple-800 overflow-hidden rounded-[2.5rem] border border-white/70 bg-linear-to-br from-violet-800 via-indigo-700 to-purple-800 shadow-2xl ring-1 ring-violet-200/40"
    >
      <Card className="">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_34%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.14),transparent_32%),radial-gradient(circle_at_12%_75%,rgba(109,40,217,0.18),transparent_30%)]"
          aria-hidden
        />
        <div className="relative">
          <CardHeader ref={headerRef} className="flex flex-col gap-2 text-center">
            <Badge
              variant="outline"
              className="mx-auto inline-flex items-center gap-2 rounded-full border-white/50 bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em]  backdrop-blur"
            >
              <Droplets className="size-4" />
              Blood availability
            </Badge>
            <CardTitle className="text-3xl font-black  sm:text-4xl">
              Real-time stock across our blood bank
            </CardTitle>
            <p className="mx-auto max-w-2xl text-sm /85 sm:text-base">
              Track available units by blood group before submitting a request. Low inventory groups are highlighted so you can plan ahead or consider alternative donors.
            </p>
            <div className="mt-4 flex justify-center">
              <Link
                href="/patient/blood-requests"
                className="inline-flex items-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-violet-700 shadow-md transition hover:-translate-y-0.5 hover:bg-violet-50"
              >
                Request blood from your dashboard
              </Link>
            </div>
          </CardHeader>
        </div>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-sm /85">
              Checking blood inventory...
            </p>
          ) : isError ? (
            <p className="flex items-center justify-center gap-2 text-center text-sm text-amber-200">
              <AlertTriangle className="size-4" />
              Unable to load blood availability right now.
            </p>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {metricTiles.map(({ label, value }, idx) => (
                  <div
                    key={label}
                    ref={(el) => {
                      metricRefs.current[idx] = el;
                    }}
                    className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-left backdrop-blur"
                  >
                    <p className="text-xs uppercase tracking-[0.25em] /70">{label}</p>
                    <p className="text-2xl font-bold">{value}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {groupDetails.map(({ group, units, status, badge, meter, note }, index) => {
                  const isLow = status === "Low" || status === "Critical";
                  return (
                    <div
                      ref={(el) => {
                        cardRefs.current[index] = el;
                      }}
                      key={group}
                      className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-white/90 via-white to-violet-50/70 p-5 shadow-lg shadow-violet-900/15 ring-1 ring-violet-100/70 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="absolute right-4 top-3 h-12 w-12 rounded-full bg-violet-100/70 blur-3xl" aria-hidden />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-700">
                          {group}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${badge}`}
                        >
                          {status === "Critical" ? (
                            <AlertTriangle className="size-4" />
                          ) : (
                            <Droplets className="size-4" />
                          )}
                          {status}
                        </span>
                      </div>
                      <p className="mt-4 text-4xl font-black text-slate-900">{units}</p>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Units available
                      </p>

                      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200/80">
                        <div
                          className={`h-full rounded-full ${meter}`}
                          style={{
                            width: `${Math.min(100, Math.max(10, (units / 30) * 100))}%`,
                          }}
                        />
                      </div>
                      <p
                        className={`mt-3 text-xs font-semibold ${
                          isLow ? "text-amber-700" : "text-violet-700"
                        }`}
                      >
                        {note}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default BloodAvailability;
