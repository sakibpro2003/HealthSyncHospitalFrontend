"use client";

import { useCallback, useMemo, useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  Clock,
  Loader2,
  RefreshCcw,
  Users,
} from "lucide-react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  useGetDoctorAppointmentsQuery,
  useCompleteAppointmentMutation,
  type DoctorAppointment,
} from "@/redux/features/doctor/doctorDashboardApi";
import { useCreatePrescriptionMutation } from "@/redux/features/prescription/prescriptionApi";

const statusColor: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  scheduled: "secondary",
  completed: "default",
  cancelled: "destructive",
};

const statusLabel: Record<string, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
};

const defaultPrescriptionForm = {
  diagnosis: "",
  complaints: "",
  medications: "",
  advice: "",
  followUpDate: "",
  notes: "",
};

const parseDateTime = (date?: string, time?: string) => {
  if (!date) {
    return null;
  }

  const normalizedTime = time?.length === 5 ? `${time}:00` : time ?? "00:00:00";
  const candidate = new Date(`${date}T${normalizedTime}`);

  return Number.isNaN(candidate.getTime()) ? null : candidate;
};

const formatDate = (date?: string, time?: string) => {
  const parsed = parseDateTime(date, time);
  return parsed ? format(parsed, "MMM d, yyyy") : "-";
};

const formatTime = (date?: string, time?: string) => {
  const parsed = parseDateTime(date, time);
  return parsed ? format(parsed, "hh:mm a") : "-";
};

const DoctorAppointmentsPage = () => {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetDoctorAppointmentsQuery();
  const [createPrescription, { isLoading: isSubmitting }] =
    useCreatePrescriptionMutation();
  const [completeAppointmentMutation] = useCompleteAppointmentMutation();
  const [prescriptionSheetOpen, setPrescriptionSheetOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<DoctorAppointment | null>(null);
  const [prescriptionForm, setPrescriptionForm] = useState(
    defaultPrescriptionForm
  );
  const [completingAppointmentId, setCompletingAppointmentId] = useState<
    string | null
  >(null);

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1";

  const handleOpenPrescription = useCallback(
    (appointment: DoctorAppointment) => {
      setSelectedAppointment(appointment);
      setPrescriptionForm(defaultPrescriptionForm);
      setPrescriptionSheetOpen(true);
    },
    []
  );

  const handleClosePrescription = useCallback(() => {
    setSelectedAppointment(null);
    setPrescriptionForm(defaultPrescriptionForm);
    setPrescriptionSheetOpen(false);
  }, []);

  const handlePrescriptionFieldChange = useCallback(
    (field: keyof typeof prescriptionForm, value: string) => {
      setPrescriptionForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleDownloadPrescription = useCallback(
    (prescriptionId: string) => {
      const url = `${apiBaseUrl}/prescriptions/${prescriptionId}/download`;
      window.open(url, "_blank");
    },
    [apiBaseUrl]
  );

  const handleCompleteAppointment = useCallback(
    async (appointment: DoctorAppointment) => {
      setCompletingAppointmentId(appointment._id);
      try {
        await completeAppointmentMutation(appointment._id).unwrap();
        toast.success("Appointment marked as completed.");
        if (!appointment.prescription) {
          handleOpenPrescription({
            ...appointment,
            status: "completed",
            prescription: null,
          });
        }
        await refetch();
      } catch (error) {
        console.error(error);
        toast.error("Failed to mark appointment as completed.");
      } finally {
        setCompletingAppointmentId(null);
      }
    },
    [completeAppointmentMutation, handleOpenPrescription, refetch]
  );

  const selectedAppointmentId = selectedAppointment?._id ?? null;

  const handleCreatePrescription = useCallback(async () => {
    if (!selectedAppointmentId) {
      toast.error("No appointment selected.");
      return;
    }

    const medications = prescriptionForm.medications
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    try {
      await createPrescription({
        appointment: selectedAppointmentId,
        diagnosis: prescriptionForm.diagnosis.trim() || undefined,
        complaints: prescriptionForm.complaints.trim() || undefined,
        medications,
        advice: prescriptionForm.advice.trim() || undefined,
        followUpDate: prescriptionForm.followUpDate || undefined,
        notes: prescriptionForm.notes.trim() || undefined,
      }).unwrap();

      toast.success("Prescription saved successfully.");
      handleClosePrescription();
      await refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save prescription. Please try again.");
    }
  }, [
    createPrescription,
    handleClosePrescription,
    prescriptionForm,
    refetch,
    selectedAppointmentId,
  ]);

  const appointmentsData = data?.data;

  const stats = appointmentsData?.stats;
  const summary = useMemo(
    () => ({
      total: stats?.total ?? 0,
      scheduled: stats?.scheduled ?? 0,
      completed: stats?.completed ?? 0,
      cancelled: stats?.cancelled ?? 0,
    }),
    [stats?.total, stats?.scheduled, stats?.completed, stats?.cancelled]
  );

  const upcomingRaw = appointmentsData?.upcoming;
  const historyRaw = appointmentsData?.history;

  const upcoming: DoctorAppointment[] = useMemo(
    () => upcomingRaw ?? [],
    [upcomingRaw]
  );
  const history: DoctorAppointment[] = useMemo(
    () => historyRaw ?? [],
    [historyRaw]
  );
  const nextAppointment: DoctorAppointment | null =
    appointmentsData?.nextAppointment ?? null;

  const upcomingWithMeta = useMemo(
    () =>
      upcoming.map((appointment) => {
        const prescriptionId = appointment.prescription?._id;
        return {
          appointment,
          prescriptionId,
          hasPrescription: Boolean(prescriptionId),
          formattedDate: formatDate(
            appointment.appointmentDate,
            appointment.appointmentTime
          ),
          formattedTime: formatTime(
            appointment.appointmentDate,
            appointment.appointmentTime
          ),
        };
      }),
    [upcoming]
  );

  const historyWithMeta = useMemo(
    () =>
      history.map((appointment) => {
        const prescriptionId = appointment.prescription?._id;
        return {
          appointment,
          prescriptionId,
          hasPrescription: Boolean(prescriptionId),
          formattedDate: formatDate(
            appointment.appointmentDate,
            appointment.appointmentTime
          ),
          formattedTime: formatTime(
            appointment.appointmentDate,
            appointment.appointmentTime
          ),
        };
      }),
    [history]
  );

  const overviewCards = useMemo(
    () => [
      {
        title: "Total patients",
        value: summary.total,
        icon: Users,
        description: "Overall appointments handled",
      },
      {
        title: "Upcoming",
        value: summary.scheduled,
        icon: CalendarDays,
        description: "Scheduled consultations on your calendar",
      },
      {
        title: "Completed",
        value: summary.completed,
        icon: ClipboardList,
        description: "Finished consultations recorded",
      },
      {
        title: "Cancelled",
        value: summary.cancelled,
        icon: Clock,
        description: "Cancellations or missed visits",
      },
    ],
    [summary]
  );

  const selectedPatient = selectedAppointment?.patient;
  const appointmentDateLabel = selectedAppointment
    ? formatDate(
        selectedAppointment.appointmentDate,
        selectedAppointment.appointmentTime
      )
    : null;
  const appointmentTimeLabel = selectedAppointment
    ? formatTime(
        selectedAppointment.appointmentDate,
        selectedAppointment.appointmentTime
      )
    : null;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-violet-600" />
        <span className="text-sm text-slate-600">
          Loading your appointment schedule…
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-slate-600">
          We ran into an issue while loading your appointments. Please try
          again.
        </p>
        <Button
          variant="outline"
          onClick={() => refetch()}
          className="gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <section className="space-y-8 px-6 py-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Your clinic schedule
          </h1>
          <p className="text-sm text-slate-500">
            Track upcoming visits, review completed consultations, and stay
            prepared for every patient.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          className="gap-2"
          disabled={isFetching}
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </Button>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((card) => (
          <Card key={card.title} className="border border-slate-200/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {card.title}
              </CardTitle>
              <card.icon className="h-5 w-5 text-violet-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">
                {card.value}
              </div>
              <p className="text-xs text-slate-500">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {nextAppointment && (
        <Card className="border border-violet-200 bg-violet-50/60 shadow-sm">
          <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base text-violet-800">
                Next appointment
              </CardTitle>
              <p className="text-sm text-violet-600">
                {nextAppointment.patient?.name ?? "Patient"} •{" "}
                {formatDate(
                  nextAppointment.appointmentDate,
                  nextAppointment.appointmentTime
                )}{" "}
                at{" "}
                {formatTime(
                  nextAppointment.appointmentDate,
                  nextAppointment.appointmentTime
                )}
              </p>
            </div>
            <Badge variant="secondary" className="bg-violet-600 text-white">
              {statusLabel[nextAppointment.status] ?? nextAppointment.status}
            </Badge>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-4 text-sm text-violet-700">
            <div>
              <span className="font-medium">Email:</span>{" "}
              {nextAppointment.patient?.email ?? "—"}
            </div>
            <div>
              <span className="font-medium">Phone:</span>{" "}
              {nextAppointment.patient?.phone ?? "—"}
            </div>
            {nextAppointment.reason && (
              <div>
                <span className="font-medium">Reason:</span>{" "}
                {nextAppointment.reason}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-slate-200/70 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg text-slate-900">
                Upcoming appointments
              </CardTitle>
              <p className="text-sm text-slate-500">
                The next patients scheduled with you.
              </p>
            </div>
            <Badge variant="outline" className="text-violet-600">
              {upcoming.length} scheduled
            </Badge>
          </CardHeader>
          <CardContent>
            {upcoming.length === 0 ? (
              <p className="text-sm text-slate-500">
                No upcoming appointments at the moment.
              </p>
            ) : (
              <div className="space-y-4">
                {upcomingWithMeta.map(
                  ({
                    appointment,
                    formattedDate,
                    formattedTime,
                    hasPrescription,
                    prescriptionId,
                  }) => (
                    <div
                      key={appointment._id}
                      className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-sm"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-base font-semibold text-slate-900">
                            {appointment.patient?.name ?? "Patient"}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {formattedDate} at {formattedTime}
                          </p>
                        </div>
                        <Badge
                          variant={
                            statusColor[appointment.status] ?? "secondary"
                          }
                        >
                          {statusLabel[appointment.status] ??
                            appointment.status}
                        </Badge>
                      </div>
                      <dl className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                        <div>
                          <dt className="font-medium text-slate-500">Email</dt>
                          <dd>{appointment.patient?.email ?? "—"}</dd>
                        </div>
                        <div>
                          <dt className="font-medium text-slate-500">Phone</dt>
                          <dd>{appointment.patient?.phone ?? "—"}</dd>
                        </div>
                        {appointment.reason && (
                          <div className="sm:col-span-2">
                            <dt className="font-medium text-slate-500">
                              Reason
                            </dt>
                            <dd>{appointment.reason}</dd>
                          </div>
                        )}
                      </dl>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleCompleteAppointment(appointment)}
                          disabled={
                            completingAppointmentId === appointment._id ||
                            appointment.status !== "scheduled"
                          }
                        >
                          {completingAppointmentId === appointment._id ? (
                            <span className="flex items-center gap-1">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Completing…
                            </span>
                          ) : (
                            "Mark complete"
                          )}
                        </Button>
                        {hasPrescription ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (prescriptionId) {
                                handleDownloadPrescription(prescriptionId);
                              }
                            }}
                          >
                            Download prescription
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() =>
                              handleOpenPrescription(appointment)
                            }
                            disabled={appointment.status !== "completed"}
                            title={
                              appointment.status !== "completed"
                                ? "Complete the appointment before writing a prescription."
                                : undefined
                            }
                          >
                            Add prescription
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-slate-200/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">
              Appointment history
            </CardTitle>
            <p className="text-sm text-slate-500">
              Recently completed or cancelled visits.
            </p>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {history.length === 0 ? (
              <p className="text-sm text-slate-500">
                You don&apos;t have any past appointments yet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap text-slate-600">
                      Patient
                    </TableHead>
                    <TableHead className="whitespace-nowrap text-slate-600">
                      Date
                    </TableHead>
                    <TableHead className="whitespace-nowrap text-slate-600">
                      Time
                    </TableHead>
                    <TableHead className="whitespace-nowrap text-slate-600">
                      Status
                    </TableHead>
                    <TableHead className="whitespace-nowrap text-slate-600">
                      Prescription
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyWithMeta.map(
                    ({
                      appointment,
                      formattedDate,
                      formattedTime,
                      hasPrescription,
                      prescriptionId,
                    }) => (
                      <TableRow key={appointment._id}>
                        <TableCell className="font-medium text-slate-900">
                          {appointment.patient?.name ?? "Patient"}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {formattedDate}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {formattedTime}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              statusColor[appointment.status] ?? "secondary"
                            }
                          >
                            {statusLabel[appointment.status] ??
                              appointment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {hasPrescription ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (prescriptionId) {
                                  handleDownloadPrescription(prescriptionId);
                                }
                              }}
                            >
                              Download
                            </Button>
                          ) : (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() =>
                                handleOpenPrescription(appointment)
                              }
                              disabled={appointment.status !== "completed"}
                              title={
                                appointment.status !== "completed"
                                  ? "Only completed appointments can receive prescriptions."
                                  : undefined
                              }
                            >
                              Add
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Sheet
        open={prescriptionSheetOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleClosePrescription();
          } else {
            setPrescriptionSheetOpen(true);
          }
        }}
      >
        <SheetContent className="flex max-w-xl flex-col">
          <SheetHeader>
            <SheetTitle>Create prescription</SheetTitle>
            <SheetDescription>
              Provide clinical notes and medicines for the selected appointment.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 flex-1 space-y-6 overflow-y-auto pr-1">
            {selectedAppointment && (
              <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Patient
                    </p>
                    <p className="text-xl font-semibold text-slate-900">
                      {selectedPatient?.name ?? "Patient"}
                    </p>
                    <div className="space-y-1 text-sm text-slate-600">
                      {selectedPatient?.email && <p>{selectedPatient.email}</p>}
                      {selectedPatient?.phone && <p>{selectedPatient.phone}</p>}
                      {selectedPatient?.address && (
                        <p className="text-xs text-slate-500">
                          {selectedPatient.address}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-3 text-sm text-slate-600 sm:items-end">
                    <div className="rounded-md bg-violet-50 px-3 py-2 text-left sm:text-right">
                      <p className="text-xs uppercase tracking-wide text-violet-600">
                        Appointment
                      </p>
                      <p className="font-medium text-slate-900">
                        {appointmentDateLabel ?? "-"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {appointmentTimeLabel ?? "-"}
                      </p>
                    </div>
                    {selectedAppointment.reason && (
                      <div className="max-w-[18rem] text-sm text-slate-600 sm:text-right">
                        <span className="font-medium text-slate-700">
                          Reason:
                        </span>{" "}
                        {selectedAppointment.reason}
                      </div>
                    )}
                    <Badge
                      variant={
                        statusColor[selectedAppointment.status] ?? "secondary"
                      }
                    >
                      {statusLabel[selectedAppointment.status] ??
                        selectedAppointment.status}
                    </Badge>
                  </div>
                </div>
              </section>
            )}

            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Clinical Summary
                  </p>
                  <Separator className="mt-3" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="prescription-diagnosis">Diagnosis</Label>
                    <Input
                      id="prescription-diagnosis"
                      value={prescriptionForm.diagnosis}
                      onChange={(event) =>
                        handlePrescriptionFieldChange(
                          "diagnosis",
                          event.target.value
                        )
                      }
                      placeholder="Primary diagnosis"
                    />
                    <p className="text-xs text-slate-500">
                      Primary assessment or clinical impression.
                    </p>
                  </div>
                  <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="prescription-complaints">
                      Presenting complaints
                    </Label>
                    <Textarea
                      id="prescription-complaints"
                      value={prescriptionForm.complaints}
                      onChange={(event) =>
                        handlePrescriptionFieldChange(
                          "complaints",
                          event.target.value
                        )
                      }
                      rows={3}
                      placeholder="Summarize the key symptoms"
                    />
                    <p className="text-xs text-slate-500">
                      Describe the concerns in the patient&apos;s own words where
                      possible.
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Treatment Plan
                  </p>
                  <Separator className="mt-3" />
                </div>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="prescription-medications">Medications</Label>
                    <Textarea
                      id="prescription-medications"
                      value={prescriptionForm.medications}
                      onChange={(event) =>
                        handlePrescriptionFieldChange(
                          "medications",
                          event.target.value
                        )
                      }
                      rows={4}
                      placeholder="One medicine per line with dosage and frequency"
                    />
                    <p className="text-xs text-slate-500">
                      Example: Paracetamol 500mg - take one tablet three times
                      daily after meals.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="prescription-advice">
                      Advice & instructions
                    </Label>
                    <Textarea
                      id="prescription-advice"
                      value={prescriptionForm.advice}
                      onChange={(event) =>
                        handlePrescriptionFieldChange(
                          "advice",
                          event.target.value
                        )
                      }
                      rows={3}
                      placeholder="Diet, lifestyle, or investigation guidance"
                    />
                    <p className="text-xs text-slate-500">
                      Provide clear next steps or precautions for the patient.
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Follow-up & Notes
                  </p>
                  <Separator className="mt-3" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="prescription-followup">Follow-up date</Label>
                    <Input
                      id="prescription-followup"
                      type="date"
                      value={prescriptionForm.followUpDate}
                      onChange={(event) =>
                        handlePrescriptionFieldChange(
                          "followUpDate",
                          event.target.value
                        )
                      }
                    />
                    <p className="text-xs text-slate-500">
                      Select the recommended review date.
                    </p>
                  </div>
                  <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="prescription-notes">Additional notes</Label>
                    <Textarea
                      id="prescription-notes"
                      value={prescriptionForm.notes}
                      onChange={(event) =>
                        handlePrescriptionFieldChange(
                          "notes",
                          event.target.value
                        )
                      }
                      rows={3}
                      placeholder="Internal reminders or observations"
                    />
                    <p className="text-xs text-slate-500">
                      Keep confidential remarks or reminders for your records.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <SheetFooter className="mt-6 flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClosePrescription}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreatePrescription}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save prescription"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default DoctorAppointmentsPage;
