"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  Clock,
  MapPin,
  UserCircle2,
  Loader2,
  ArrowRight,
  CalendarPlus,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  useCancelAppointmentMutation,
  useGetAppointmentsByPatientQuery,
  useRescheduleAppointmentMutation,
} from "@/redux/features/appointment/appointmentApi";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AuthedUser {
  userId?: string;
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
}

const BOOKING_START_MINUTE = 8 * 60; // 08:00
const BOOKING_END_MINUTE = 22 * 60; // 22:00

const timeToMinutes = (time: string) => {
  const [hourStr, minuteStr] = time.split(":");
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

const combineDateTime = (dateISO: string, timeHHMM: string) => {
  const date = new Date(dateISO);
  const [hours, minutes] = timeHHMM.split(":").map(Number);
  date.setHours(hours ?? 0, minutes ?? 0, 0, 0);
  return date;
};

const formatDisplayDateTime = (dateISO: string, timeHHMM: string) => {
  const dateTime = combineDateTime(dateISO, timeHHMM);
  return {
    date: dateTime.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    time: dateTime.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

const buildICSFile = (appointment: any) => {
  const start = combineDateTime(
    appointment.appointmentDate,
    appointment.appointmentTime
  );
  const end = new Date(start.getTime() + 45 * 60 * 1000);

  const formatICSDate = (date: Date) =>
    date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const summary = `Consultation with ${appointment.doctor?.name ?? "Doctor"}`;
  const description = appointment.reason
    ? appointment.reason
    : `Appointment with ${appointment.doctor?.name ?? "doctor"}`;

  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//HealthSync Hospital//EN\nBEGIN:VEVENT\nUID:${appointment._id}@healthsync\nDTSTAMP:${formatICSDate(new Date())}\nDTSTART:${formatICSDate(start)}\nDTEND:${formatICSDate(end)}\nSUMMARY:${summary}\nDESCRIPTION:${description}\nEND:VEVENT\nEND:VCALENDAR`;

  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${summary.replace(/\s+/g, "_")}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const AppointmentsPage = () => {
  const [user, setUser] = useState<AuthedUser | null>(null);
  const [rescheduleSheetOpen, setRescheduleSheetOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [formState, setFormState] = useState({
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
  });

  useEffect(() => {
    if (!rescheduleSheetOpen) {
      setSelectedAppointment(null);
    }
  }, [rescheduleSheetOpen]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("Not logged in");
      }
    };

    fetchUser();
  }, []);

  const patientId = user?.userId ?? user?._id;

  const {
    data: appointmentsData,
    isLoading,
    isError,
    refetch,
  } = useGetAppointmentsByPatientQuery(patientId as string, {
    skip: !patientId,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });

  const [cancelAppointment, { isLoading: isCancelling }] =
    useCancelAppointmentMutation();
  const [rescheduleAppointment, { isLoading: isRescheduling }] =
    useRescheduleAppointmentMutation();

  const appointments = appointmentsData?.data ?? [];

  const { upcomingAppointments, pastAppointments } = useMemo(() => {
    const now = new Date();
    const upcoming: any[] = [];
    const past: any[] = [];

    appointments.forEach((appointment: any) => {
      const appointmentDateTime = combineDateTime(
        appointment.appointmentDate,
        appointment.appointmentTime
      );

      if (
        appointment.status === "scheduled" &&
        appointmentDateTime >= now
      ) {
        upcoming.push({ ...appointment, appointmentDateTime });
      } else {
        past.push({ ...appointment, appointmentDateTime });
      }
    });

    upcoming.sort(
      (a, b) => a.appointmentDateTime.getTime() - b.appointmentDateTime.getTime()
    );

    past.sort(
      (a, b) => b.appointmentDateTime.getTime() - a.appointmentDateTime.getTime()
    );

    return { upcomingAppointments: upcoming, pastAppointments: past };
  }, [appointments]);

  const handleCancel = async (appointmentId: string) => {
    if (!patientId) {
      toast.error("Please log in to manage appointments");
      return;
    }

    const proceed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );
    if (!proceed) return;

    try {
      await cancelAppointment({ appointmentId, patientId }).unwrap();
      toast.success("Appointment cancelled");
      refetch();
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to cancel appointment. Try again."
      );
    }
  };

  const handleRescheduleOpen = (appointment: any) => {
    setSelectedAppointment(appointment);
    setFormState({
      appointmentDate: appointment.appointmentDate.slice(0, 10),
      appointmentTime: appointment.appointmentTime,
      reason: appointment.reason ?? "",
    });
    setRescheduleSheetOpen(true);
  };

  const handleRescheduleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!selectedAppointment) return;
    if (!patientId) {
      toast.error("Please log in to manage appointments");
      return;
    }

    const totalMinutes = timeToMinutes(formState.appointmentTime);
    if (Number.isNaN(totalMinutes)) {
      toast.error("Please provide a valid time in HH:MM format");
      return;
    }

    if (
      totalMinutes < BOOKING_START_MINUTE ||
      totalMinutes > BOOKING_END_MINUTE
    ) {
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
      refetch();
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Unable to reschedule. Please try another slot."
      );
    }
  };

  return (
    <div className="p-6 bg-gradient-to-tr from-sky-50 via-white to-blue-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">My Appointments</h1>
          <p className="text-sm text-gray-500 mt-1">
            Keep track of your scheduled visits and review past consultations.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="animate-spin w-5 h-5" />
          Fetching appointments...
        </div>
      )}

      {isError && (
        <p className="text-red-500">Unable to load appointment history.</p>
      )}

      {!isLoading && !appointments.length && (
        <div className="text-gray-500 border border-dashed border-sky-200 rounded-xl p-10 text-center bg-white/70">
          You have no appointments yet. Visit a doctor profile to schedule one.
        </div>
      )}

      {!!upcomingAppointments.length && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-blue-700">
            <ArrowRight className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Upcoming</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {upcomingAppointments.map((appointment: any) => {
              const display = formatDisplayDateTime(
                appointment.appointmentDate,
                appointment.appointmentTime
              );

              return (
                <div
                  key={appointment._id}
                  className="bg-white/90 backdrop-blur-sm border border-sky-100 rounded-2xl shadow-sm hover:shadow-md transition-transform hover:-translate-y-1"
                >
                  <div className="p-5 flex gap-4">
                    <div className="relative h-20 w-20 rounded-xl overflow-hidden border border-blue-100 shadow-inner">
                      <Image
                        src={appointment.doctor?.image || "/image.png"}
                        alt={appointment.doctor?.name || "Doctor"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {appointment.doctor?.name}
                        </h3>
                        <span className="text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                          Scheduled
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <UserCircle2 className="w-4 h-4 text-blue-500" />
                        {appointment.doctor?.specialization} • {" "}
                        {appointment.doctor?.department}
                      </p>
                    </div>
                  </div>
                  <div className="px-5 pb-5 space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-blue-500" />
                      <span>{display.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>{display.time}</span>
                    </div>
                    {appointment.doctor?.availability?.days && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span className="text-xs text-gray-500">
                          Available {appointment.doctor.availability.days.join(", ")}
                        </span>
                      </div>
                    )}
                    {appointment.reason && (
                      <div className="bg-sky-50 text-sky-900/80 border border-sky-100 rounded-lg p-3 text-xs leading-relaxed">
                        <span className="font-medium text-sky-700">Reason:</span>{" "}
                        {appointment.reason}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRescheduleOpen(appointment)}
                      >
                        <RefreshCw className="w-4 h-4 mr-1" /> Reschedule
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleCancel(appointment._id)}
                        disabled={isCancelling}
                      >
                        <XCircle className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => buildICSFile(appointment)}
                      >
                        <CalendarPlus className="w-4 h-4 mr-1" /> Add to Calendar
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {!!pastAppointments.length && (
        <section className="space-y-4 mt-10">
          <div className="flex items-center gap-2 text-slate-600">
            <ArrowRight className="w-5 h-5" />
            <h2 className="text-xl font-semibold">History</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {pastAppointments.map((appointment: any) => {
              const display = formatDisplayDateTime(
                appointment.appointmentDate,
                appointment.appointmentTime
              );

              const statusLabel =
                appointment.status === "completed"
                  ? "Completed"
                  : appointment.status === "cancelled"
                  ? "Cancelled"
                  : "Past";
              const statusClass =
                appointment.status === "completed"
                  ? "bg-blue-100 text-blue-700"
                  : appointment.status === "cancelled"
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600";

              return (
                <div
                  key={appointment._id}
                  className="bg-white/80 border border-gray-100 rounded-2xl shadow-sm"
                >
                  <div className="p-5 flex gap-4">
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-gray-100 shadow-inner">
                      <Image
                        src={appointment.doctor?.image || "/image.png"}
                        alt={appointment.doctor?.name || "Doctor"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {appointment.doctor?.name}
                        </h3>
                        <span
                          className={`text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full ${statusClass}`}
                        >
                          {statusLabel}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <UserCircle2 className="w-4 h-4 text-blue-500" />
                        {appointment.doctor?.specialization} • {" "}
                        {appointment.doctor?.department}
                      </p>
                    </div>
                  </div>
                  <div className="px-5 pb-5 space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-blue-500" />
                      <span>{display.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>{display.time}</span>
                    </div>
                    {appointment.reason && (
                      <div className="bg-gray-50 text-gray-700 border border-gray-100 rounded-lg p-3 text-xs leading-relaxed">
                        <span className="font-medium text-gray-600">Reason:</span>{" "}
                        {appointment.reason}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <Sheet open={rescheduleSheetOpen} onOpenChange={setRescheduleSheetOpen}>
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold text-gray-800">
              Reschedule Appointment
            </SheetTitle>
            <SheetDescription>
              Choose a new date and time that works best for you.
            </SheetDescription>
          </SheetHeader>
          <form className="flex flex-col gap-4 p-4" onSubmit={handleRescheduleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="reschedule-date">New Date</Label>
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
              <Label htmlFor="reschedule-time">New Time</Label>
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
              <p className="text-xs text-gray-500">
                Available window: 08:00 - 22:00. Please choose a slot in this range.
              </p>
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
              <Button
                type="submit"
                className="flex-1"
                disabled={isRescheduling}
              >
                {isRescheduling ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setRescheduleSheetOpen(false)}
              >
                Close
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AppointmentsPage;
