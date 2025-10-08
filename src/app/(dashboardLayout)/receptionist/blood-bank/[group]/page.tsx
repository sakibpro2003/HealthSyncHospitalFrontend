"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { useGetBloodInventoryHistoryQuery } from "@/redux/features/bloodBank/bloodBankApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const formatChange = (change: number) =>
  `${change > 0 ? "+" : ""}${change} units`;

const HistoryEntryCard = ({
  entry,
}: {
  entry: {
    change: number;
    balanceAfter: number;
    type: string;
    note?: string;
    actorName?: string;
    actorRole?: string;
    createdAt?: string;
  };
}) => (
  <div className="rounded-2xl border border-slate-200/60 bg-white/90 p-4 shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <Badge variant={entry.change < 0 ? "destructive" : "secondary"}>
        {entry.type.replace("-", " ")}
      </Badge>
      <span className="text-xs text-slate-500">
        {entry.createdAt ? new Date(entry.createdAt).toLocaleString() : "--"}
      </span>
    </div>
    <p className="mt-3 text-lg font-semibold text-slate-900">
      {formatChange(entry.change)}
    </p>
    <p className="text-xs text-slate-500">
      Balance after change: <strong>{entry.balanceAfter}</strong> units
    </p>
    {entry.note && (
      <p className="mt-2 text-sm text-slate-600">{entry.note}</p>
    )}
    {(entry.actorName || entry.actorRole) && (
      <p className="mt-2 text-xs text-slate-500">
        {entry.actorName} {entry.actorRole ? `(${entry.actorRole})` : ""}
      </p>
    )}
  </div>
);

const ReceptionistBloodGroupHistoryPage = () => {
  const params = useParams<{ group: string }>();
  const bloodGroup = useMemo(() => params.group?.toUpperCase() ?? "", [params]);

  const { data = [], isLoading, isError } = useGetBloodInventoryHistoryQuery(
    bloodGroup,
  );

  const history = data.find((item) => item.bloodGroup === bloodGroup)?.history ?? [];
  const currentBalance = data.find((item) => item.bloodGroup === bloodGroup)?.unitsAvailable ?? 0;

  return (
    <div className="space-y-8 p-6">
      <Link
        href="/receptionist/blood-bank"
        className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Back to blood inventory
      </Link>

      <Card className="border border-slate-200/70 shadow-sm">
        <CardHeader>
          <CardTitle>
            Blood group {bloodGroup || "Unknown"} &mdash; history & balance
          </CardTitle>
          <p className="text-sm text-slate-500">
            Review every adjustment, donation, and fulfillment recorded for this
            blood group. Use this to audit requests and plan upcoming campaigns.
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-slate-500">Loading history...</p>
          ) : isError ? (
            <p className="text-sm text-red-500">
              Unable to load history. Please try again later.
            </p>
          ) : history.length === 0 ? (
            <p className="text-sm text-slate-500">
              No history records for this blood group yet. Current balance:
              {" "}
              <strong>{currentBalance}</strong> units.
            </p>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {history
                .slice()
                .reverse()
                .map((entry, index) => (
                  <HistoryEntryCard key={`${entry.createdAt}-${index}`} entry={entry} />
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReceptionistBloodGroupHistoryPage;
