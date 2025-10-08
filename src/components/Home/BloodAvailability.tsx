"use client";

import { useMemo } from "react";
import { useGetInventorySummaryQuery } from "@/redux/features/bloodBank/bloodBankApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

const BLOOD_COLORS: Record<string, string> = {
  "A+": "from-rose-500/10 to-rose-500/5",
  "A-": "from-orange-500/10 to-orange-500/5",
  "B+": "from-amber-500/10 to-amber-500/5",
  "B-": "from-yellow-500/10 to-yellow-500/5",
  "AB+": "from-violet-500/10 to-violet-500/5",
  "AB-": "from-indigo-500/10 to-indigo-500/5",
  "O+": "from-emerald-500/10 to-emerald-500/5",
  "O-": "from-cyan-500/10 to-cyan-500/5",
};

const BloodAvailability = () => {
  const { data, isLoading, isError } = useGetInventorySummaryQuery();

  const summary = useMemo(() => data ?? {}, [data]);

  return (
    <section className="relative isolate mx-auto mt-20 w-full px-4 sm:px-6 lg:px-8">
      <Card className="overflow-hidden border border-rose-100/60 bg-gradient-to-br from-white via-white to-rose-50/40 shadow-[0_45px_90px_-55px_rgba(225,29,72,0.45)]">
        <CardHeader className="flex flex-col gap-2 text-center">
          <Badge variant="outline" className="mx-auto rounded-full border-rose-200 px-4 py-1 text-xs uppercase tracking-[0.35em] text-rose-500">
            Blood availability
          </Badge>
          <CardTitle className="text-3xl font-black text-slate-900 sm:text-4xl">
            Real-time stock across our blood bank
          </CardTitle>
          <p className="mx-auto max-w-2xl text-sm text-slate-500 sm:text-base">
            Track available units by blood group before submitting a request. Low
            inventory groups are highlighted so you can plan ahead or consider
            alternative donors.
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-sm text-slate-500">
              Checking blood inventory...
            </p>
          ) : isError ? (
            <p className="text-center text-sm text-red-500">
              Unable to load blood availability right now.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {BLOOD_GROUPS.map((group) => {
                const units = summary[group] ?? 0;
                const isLow = units <= 5;
                return (
                  <div
                    key={group}
                    className={`relative overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br ${BLOOD_COLORS[group] ?? "from-white to-white"} p-5 shadow-lg backdrop-blur`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
                        {group}
                      </span>
                      <Badge
                        variant={isLow ? "destructive" : "secondary"}
                        className="rounded-full px-3 text-xs"
                      >
                        {isLow ? "Low" : "Healthy"}
                      </Badge>
                    </div>
                    <p className="mt-4 text-4xl font-black text-slate-900">
                      {units}
                    </p>
                    <p className="text-xs text-slate-500">Units available</p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default BloodAvailability;
