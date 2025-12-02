"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  Clock,
  Loader2,
  MapPin,
  RefreshCcw,
  ShieldCheck,
  Stethoscope,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useClientUser } from "@/hooks/useClientUser";
import {
  useCancelAppointmentMutation,
  useGetAppointmentsByPatientQuery,
  useRescheduleAppointmentMutation,
} from "@/redux/features/appointment/appointmentApi";

type AppointmentStatus = "scheduled" | "completed" | "cancelled" | "no-show";

type AppointmentDoctor = {
  name?: string;
  specialization?: string;
  department?: string;
  image?: string;
  availability?: {
    days?: string[];
    from?: string;
    to?: string;
  };
  location?: string;
};

type Appointment = {
  _id: string;
  appointmentDate: string;
  appointmentTime: string;
  status: AppointmentStatus;
  reason?: string;
  doctor?: AppointmentDoctor;
};

type AppointmentResponse = {
  data?: Appointment[];
};

const BOOKING_START_MINUTE = 8 * 60; // 08:00
const BOOKING_END_MINUTE = 22 * 60; // 22:00

const minutesFromTime = (value: string) => {
  const [hourStr, minuteStr] = value.split(":");
  const hours = Number(hourStr);
  const minutes = Number(minuteStr);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return NaN;
  }

  return hours * 60 + minutes;
};

const combineDateAndTime = (dateISO: string, timeHHMM: string) => {
  const slot = new Date(dateISO);
  const [hours = 0, minutes = 0] = timeHHMM.split(":").map(Number);
  slot.setHours(hours, minutes, 0, 0);
  return slot;
};

const formatDisplaySlot = (dateISO: string, timeHHMM: string) => {
  const slot = combineDateAndTime(dateISO, timeHHMM);
  return {
    dateLabel: slot.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    timeLabel: slot.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

const downloadICS = (appointment: Appointment) => {
  const start = combineDateAndTime(appointment.appointmentDate, appointment.appointmentTime);
  const end = new Date(start.getTime() + 45 * 60 * 1000);

  const formatICSDate = (value: Date) =>
    value.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const summary = `Consultation with ${appointment.doctor?.name ?? "Doctor"}`;
  const description = appointment.reason
    ? appointment.reason
    : `Appointment with ${appointment.doctor?.name ?? "your doctor"}`;

  const payload = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//HealthSync Hospital//EN\nBEGIN:VEVENT\nUID:${appointment._id}@healthsync\nDTSTAMP:${formatICSDate(new Date())}\nDTSTART:${formatICSDate(start)}\nDTEND:${formatICSDate(end)}\nSUMMARY:${summary}\nDESCRIPTION:${description}\nEND:VEVENT\nEND:VCALENDAR`;

  const blob = new Blob([payload], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${summary.replace(/\s+/g, "_")}.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

const statusStyles: Record<AppointmentStatus, string> = {
  scheduled: "bg-emerald-100 text-emerald-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-rose-100 text-rose-600",
  "no-show": "bg-amber-100 text-amber-700",
};

const readableStatus: Record<AppointmentStatus, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
  "no-show": "No show",
};

const blankFormState = {
  appointmentDate: "",
  appointmentTime: "",
  reason: "",
};

const AppointmentsPage = () => {
  const { user, isLoading: isUserLoading } = useClientUser();
  const patientId = user?.userId ?? user?._id;

  const [rescheduleSheetOpen, setRescheduleSheetOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [formState, setFormState] = useState(blankFormState);

  const {
    data,
    isLoading: isAppointmentLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAppointmentsByPatientQuery(patientId as string, {
    skip: !patientId,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });

  const [cancelAppointment, { isLoading: isCancelling }] = useCancelAppointmentMutation();
  const [rescheduleAppointment, { isLoading: isRescheduling }] = useRescheduleAppointmentMutation();

  const appointments = useMemo<Appointment[]>(() => {
    const rows = (data as AppointmentResponse | undefined)?.data;
    return Array.isArray(rows) ? rows : [];
  }, [data]);

  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    return appointments
      .map((entry) => ({
        ...entry,
        slot: combineDateAndTime(entry.appointmentDate, entry.appointmentTime),
      }))
      .filter((entry) => entry.status === "scheduled" && entry.slot >= now)
      .sort((a, b) => a.slot.getTime() - b.slot.getTime());
  }, [appointments]);

  const pastAppointments = useMemo(() => {
    return appointments
      .map((entry) => ({
        ...entry,
        slot: combineDateAndTime(entry.appointmentDate, entry.appointmentTime),
      }))
      .filter((entry) => !(entry.status === "scheduled" && entry.slot >= new Date()))
      .sort((a, b) => b.slot.getTime() - a.slot.getTime());
  }, [appointments]);

  const nextAppointment = upcomingAppointments[0];
  const completedCount = appointments.filter((entry) => entry.status === "completed").length;

  const stats = [
    {
      label: "Upcoming visits",
      value: upcomingAppointments.length.toString(),
      description: "Scheduled consultations in your calendar",
      tone: "bg-emerald-100 text-emerald-700",
      icon: ShieldCheck,
    },
    {
      label: "Completed",
      value: completedCount.toString(),
      description: "Total visits you've already attended",
      tone: "bg-blue-100 text-blue-700",
      icon: Stethoscope,
    },
    {
      label: "Next slot",
      value: nextAppointment
        ? `${formatDisplaySlot(nextAppointment.appointmentDate, nextAppointment.appointmentTime).dateLabel}`
        : "—",
      description: nextAppointment
        ? formatDisplaySlot(nextAppointment.appointmentDate, nextAppointment.appointmentTime).timeLabel
        : "Waiting for your next booking",
      tone: "bg-violet-100 text-violet-600",
      icon: CalendarDays,
    },
  ];

  const isLoading = isUserLoading || isAppointmentLoading || isFetching;
  const hasAppointments = appointments.length > 0;

  const handleCancel = async (appointmentId: string) => {
    if (!patientId) {
      toast.error("Please log in to manage appointments");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to cancel this appointment?");
    if (!confirmed) {
      return;
    }

    try {
      await cancelAppointment({ appointmentId, patientId }).unwrap();
      toast.success("Appointment cancelled");
      refetch();
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : undefined;
      toast.error(message ?? "Failed to cancel appointment. Try again.");
    }
  };

  const openRescheduleSheet = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setFormState({
      appointmentDate: appointment.appointmentDate.slice(0, 10),
      appointmentTime: appointment.appointmentTime,
      reason: appointment.reason ?? "",
    });
    setRescheduleSheetOpen(true);
  };

  const handleRescheduleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedAppointment) {
      return;
    }

    if (!patientId) {
      toast.error("Please log in to manage appointments");
      return;
    }

    const totalMinutes = minutesFromTime(formState.appointmentTime);
    if (Number.isNaN(totalMinutes)) {
      toast.error("Please provide a valid time in HH:MM format");
      return;
    }

    if (totalMinutes < BOOKING_START_MINUTE || totalMinutes > BOOKING_END_MINUTE) {
      toast.error("Appointments are available between 08:00 and 22:00");
      return;
    }

    try {
      await rescheduleAppointment({
        appointmentId: selectedAppointment._id,
        patientId,
        appointmentDate: formState.appointmentDate,
        appointmentTime: formState.appointmentTime,
        reason: formState.reason,
      }).unwrap();

      toast.success("Appointment rescheduled");
      setRescheduleSheetOpen(false);
      setSelectedAppointment(null);
      setFormState(blankFormState);
      refetch();
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : undefined;
      toast.error(message ?? "Unable to reschedule. Please try another slot.");
    }
  };

  const handleSheetChange = (open: boolean) => {
    setRescheduleSheetOpen(open);
    if (!open) {
      setSelectedAppointment(null);
      setFormState(blankFormState);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-violet-100/40 py-12">
      <div className="mx-auto w-11/12 max-w-6xl space-y-10">
        <header className="overflow-hidden rounded-[34px] border border-white/70 bg-white/90 p-10 shadow-[0_40px_80px_-60px_rgba(56,189,248,0.45)] backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-sky-600">
                Care Timeline
              </span>
              <h1 className="text-4xl font-black text-slate-900 sm:text-5xl">
                Stay ahead of every upcoming visit
              </h1>
              <p className="text-base text-slate-600">
                Review scheduled appointments, revisit previous consultations, and keep your care team in sync with add-to-calendar reminders.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 rounded-3xl border border-sky-100 bg-sky-50/60 px-6 py-5 text-sm text-sky-700 shadow-inner">
              <span className="text-xs uppercase tracking-[0.3em] text-sky-500">
                Signed in as
              </span>
              <p className="text-lg font-semibold text-sky-700">{user?.name ?? "Guest"}</p>
              <p className="text-xs text-sky-500">{user?.email ?? "—"}</p>
              <Badge variant="outline" className="border-sky-200 text-sky-600">
                {user?.role ?? "patient"}
              </Badge>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {stats.map(({ label, value, description, tone, icon: Icon }) => (
            <article
              key={label}
              className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl ${tone}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
              <p className="mt-2 text-sm text-slate-500">{description}</p>
            </article>
          ))}
        </section>

        {isError && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-600">
            We couldn’t load your appointments. Please refresh the page or try again later.
          </div>
        )}

        {isLoading && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`appointments-skeleton-${index}`}
                className="h-64 animate-pulse rounded-3xl border border-white/70 bg-white/70"
              />
            ))}
          </div>
        )}

        {!isLoading && !isError && !hasAppointments && (
          <div className="rounded-[32px] border border-dashed border-sky-200 bg-white/85 p-12 text-center shadow-inner">
            <h2 className="text-2xl font-semibold text-slate-900">You don’t have any appointments yet</h2>
            <p className="mt-3 text-sm text-slate-600">
              Explore our specialists to schedule your first consultation and start your care journey.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button asChild className="rounded-full bg-sky-600 px-6 text-sm font-semibold text-white hover:bg-sky-700">
                <Link href="/departmentalDoctors">Find a specialist</Link>
              </Button>
              <Button variant="outline" onClick={() => refetch()} className="rounded-full border-sky-200 text-sky-600 hover:border-sky-300">
                Refresh
              </Button>
            </div>
          </div>
        )}

        {!isLoading && upcomingAppointments.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sky-700">
              <ArrowRight className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Upcoming appointments</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {upcomingAppointments.map((appointment) => {
                const display = formatDisplaySlot(appointment.appointmentDate, appointment.appointmentTime);
                const doctor = appointment.doctor ?? {};
                const statusClass = statusStyles[appointment.status] ?? "bg-slate-200 text-slate-600";

                return (
                  <article
                    key={appointment._id}
                    className="group relative flex h-full flex-col gap-5 overflow-hidden rounded-[30px] border border-white/70 bg-white/95 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-violet-400 to-emerald-400 opacity-0 transition group-hover:opacity-100" />
                    <div className="flex items-start gap-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-sky-100">
                        <Image
                          src={doctor.image || "/image.png"}
                          alt={doctor.name ?? "Doctor"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Consultation with</p>
                            <h3 className="text-xl font-semibold text-slate-900">{doctor.name ?? "Doctor"}</h3>
                            <p className="text-xs text-slate-500">
                              {doctor.specialization ? `${doctor.specialization}` : "General practitioner"}
                              {doctor.department ? ` • ${doctor.department}` : ""}
                            </p>
                          </div>
                          <Badge className={statusClass}>{readableStatus[appointment.status] ?? "Scheduled"}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 rounded-2xl border border-sky-100 bg-sky-50/70 p-4 text-sm text-sky-900/80">
                      <p className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-sky-500" />
                        <span>{display.dateLabel}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-sky-500" />
                        <span>{display.timeLabel}</span>
                      </p>
                      {doctor.availability?.days && doctor.availability.days.length > 0 && (
                        <p className="flex items-center gap-2 text-xs">
                          <MapPin className="h-4 w-4 text-sky-500" />
                          <span>Clinic availability: {doctor.availability.days.join(", ")}</span>
                        </p>
                      )}
                      {appointment.reason && (
                        <p className="rounded-xl border border-sky-100 bg-white/80 p-3 text-xs leading-relaxed text-sky-700">
                          <span className="font-medium text-sky-600">Reason:</span> {appointment.reason}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button size="sm" variant="outline" onClick={() => openRescheduleSheet(appointment)}>
                        <RefreshCcw className="mr-2 h-4 w-4" /> Reschedule
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleCancel(appointment._id)}
                        disabled={isCancelling}
                      >
                        {isCancelling ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="mr-2 h-4 w-4" />
                        )}
                        Cancel
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => downloadICS(appointment)}>
                        <CalendarPlus className="mr-2 h-4 w-4" /> Add to calendar
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {!isLoading && pastAppointments.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-600">
              <ArrowRight className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Previous visits</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {pastAppointments.map((appointment) => {
                const display = formatDisplaySlot(appointment.appointmentDate, appointment.appointmentTime);
                const doctor = appointment.doctor ?? {};
                const statusClass = statusStyles[appointment.status] ?? "bg-slate-200 text-slate-600";

                return (
                  <article
                    key={appointment._id}
                    className="flex h-full flex-col gap-4 rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-lg backdrop-blur"
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-slate-100">
                        <Image
                          src={doctor.image || "/image.png"}
                          alt={doctor.name ?? "Doctor"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Consulted</p>
                            <h3 className="text-lg font-semibold text-slate-900">{doctor.name ?? "Doctor"}</h3>
                            <p className="text-xs text-slate-500">
                              {doctor.specialization ? `${doctor.specialization}` : "General practitioner"}
                              {doctor.department ? ` • ${doctor.department}` : ""}
                            </p>
                          </div>
                          <Badge className={statusClass}>{readableStatus[appointment.status] ?? "Past"}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-sm text-slate-600">
                      <p className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-slate-500" />
                        <span>{display.dateLabel}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-500" />
                        <span>{display.timeLabel}</span>
                      </p>
                      {appointment.reason && (
                        <p className="rounded-xl border border-slate-100 bg-white/80 p-3 text-xs leading-relaxed">
                          <span className="font-medium text-slate-500">Reason:</span> {appointment.reason}
                        </p>
                      )}
                    </div>
                    <Button size="sm" variant="outline" onClick={() => downloadICS(appointment)}>
                      <CalendarPlus className="mr-2 h-4 w-4" /> Add to calendar
                    </Button>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>

      <Sheet open={rescheduleSheetOpen} onOpenChange={handleSheetChange}>
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold text-slate-900">Reschedule appointment</SheetTitle>
            <SheetDescription>Pick a new date and time that works best for you.</SheetDescription>
          </SheetHeader>

          <form className="flex flex-col gap-4 p-4" onSubmit={handleRescheduleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="reschedule-date">New date</Label>
              <Input
                id="reschedule-date"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={formState.appointmentDate}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    appointmentDate: event.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reschedule-time">New time</Label>
              <Input
                id="reschedule-time"
                type="time"
                value={formState.appointmentTime}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    appointmentTime: event.target.value,
                  }))
                }
                required
              />
              <p className="text-xs text-slate-500">Available window: 08:00 – 22:00.</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reschedule-reason">Reason (optional)</Label>
              <Textarea
                id="reschedule-reason"
                rows={4}
                placeholder="Provide additional context for the change"
                value={formState.reason}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    reason: event.target.value,
                  }))
                }
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isRescheduling}>
                {isRescheduling ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                  </span>
                ) : (
                  "Save changes"
                )}
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={() => handleSheetChange(false)}>
                Close
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default AppointmentsPage;
