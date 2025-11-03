"use client";

import { useMemo } from "react";
import { Download, FileText, Loader2, RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useClientUser } from "@/hooks/useClientUser";
import { useGetPatientPrescriptionsQuery } from "@/redux/features/prescription/prescriptionApi";

const PatientPrescriptionsPage = () => {
  const { user, isLoading: isUserLoading } = useClientUser();

  const patientId = useMemo(
    () => user?.userId ?? user?._id ?? null,
    [user?.userId, user?._id]
  );

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetPatientPrescriptionsQuery(patientId as string, {
    skip: !patientId,
  });

  const prescriptions = data?.data ?? [];

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1";

  const handleDownload = (prescriptionId: string) => {
    if (!prescriptionId) {
      toast.error("Prescription is not available for download.");
      return;
    }
    const url = `${apiBaseUrl}/prescriptions/${prescriptionId}/download`;
    window.open(url, "_blank");
  };

  if (isUserLoading || (isLoading && !patientId)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-violet-600" />
        <span className="text-sm text-slate-600">
          Loading your profile informationâ€¦
        </span>
      </div>
    );
  }

  if (!patientId) {
    return (
      <section className="px-6 py-10">
        <Card className="mx-auto max-w-2xl border border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">
              Unable to load prescriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              We couldn&apos;t identify your patient account. Please log in
              again or contact support if the issue persists.
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-slate-600">
          We ran into an issue while loading your prescriptions. Please try
          again.
        </p>
        <Button
          variant="outline"
          onClick={() => refetch()}
          className="gap-2"
          disabled={isFetching}
        >
          <RefreshCcw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Retry
        </Button>
      </section>
    );
  }

  return (
    <section className="space-y-8 px-6 py-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">
          Prescriptions
        </h1>
        <p className="max-w-2xl text-sm text-slate-500">
          Review the prescriptions issued by your doctors and download them for
          your records or pharmacy visits.
        </p>
      </header>

      {prescriptions.length === 0 ? (
        <Card className="border border-slate-200">
          <CardContent className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
            <FileText className="h-10 w-10 text-slate-400" />
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                No prescriptions yet
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Once your doctor issues a prescription, it will appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {prescriptions.map((item) => (
            <Card
              key={item._id}
              className="border border-slate-200 shadow-sm transition hover:border-violet-200"
            >
              <CardHeader className="flex flex-row items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base text-slate-900">
                    {item.diagnosis ?? "Prescription"}
                  </CardTitle>
                  <p className="text-sm text-slate-500">
                    Issued on{" "}
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "â€”"}
                  </p>
                </div>
                <Badge variant="outline" className="text-violet-600">
                  {item.doctor?.name ?? "Doctor"}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <div>
                  <span className="font-medium text-slate-500">
                    Follow-up:
                  </span>{" "}
                  {item.followUpDate
                    ? new Date(item.followUpDate).toLocaleDateString()
                    : "Not scheduled"}
                </div>
                {item.complaints && (
                  <p>
                    <span className="font-medium text-slate-500">
                      Complaints:
                    </span>{" "}
                    {item.complaints}
                  </p>
                )}
                {item.medications && item.medications.length > 0 && (
                  <div>
                    <span className="font-medium text-slate-500">
                      Medications
                    </span>
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {item.medications.map((med, index) => (
                        <li key={index}>{med}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {item.advice && (
                  <p>
                    <span className="font-medium text-slate-500">Advice:</span>{" "}
                    {item.advice}
                  </p>
                )}
                {item.notes && (
                  <p>
                    <span className="font-medium text-slate-500">Notes:</span>{" "}
                    {item.notes}
                  </p>
                )}
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Appointment date:{" "}
                    {item.appointment?.appointmentDate
                      ? new Date(
                          item.appointment.appointmentDate
                        ).toLocaleDateString()
                      : "â€”"}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    onClick={() => handleDownload(item._id)}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default PatientPrescriptionsPage;
