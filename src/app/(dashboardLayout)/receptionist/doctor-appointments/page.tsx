"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Loader2, RefreshCcw, Search } from "lucide-react";

import { useGetAppointmentsByDoctorIdQuery } from "@/redux/features/appointment/appointmentApi";
import { useGetAllDoctorQuery, normaliseDoctorResult } from "@/redux/features/doctor/doctorApi";
import type { DoctorAppointment } from "@/redux/features/doctor/doctorDashboardApi";

const combineSlot = (dateISO: string, timeHHMM: string) => {
  const slot = new Date(dateISO);
  const [hours = 0, minutes = 0] = timeHHMM.split(":").map(Number);
  slot.setHours(hours, minutes, 0, 0);
  return slot;
};

const formatSlot = (dateISO: string, timeHHMM: string) => {
  const slot = combineSlot(dateISO, timeHHMM);
  return {
    dateLabel: slot.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
    timeLabel: slot.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
  };
};

type AppointmentWithSerial = DoctorAppointment & { slot: Date; serial: number };

const DoctorAppointmentsPage = () => {
  const [doctorSearch, setDoctorSearch] = useState("");
  const [doctorDepartmentFilter, setDoctorDepartmentFilter] = useState("all");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");

  const {
    data: doctorData,
    isLoading: isDoctorLoading,
    isFetching: isDoctorFetching,
    refetch: refetchDoctors,
  } = useGetAllDoctorQuery({ page: 1, limit: 120 });

  const doctors = normaliseDoctorResult(doctorData?.data?.result);

  const filteredDoctors = useMemo(() => {
    const term = doctorSearch.trim().toLowerCase();
    return doctors.filter((doctor) => {
      const matchesTerm =
        term.length === 0 ||
        [doctor.name, doctor.specialization, doctor.department]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(term));

      const matchesDepartment =
        doctorDepartmentFilter === "all" ||
        doctor.department?.toLowerCase() === doctorDepartmentFilter.toLowerCase();

      return matchesTerm && matchesDepartment;
    });
  }, [doctors, doctorSearch, doctorDepartmentFilter]);

  useEffect(() => {
    if (filteredDoctors.length === 0) {
      setSelectedDoctorId("");
      return;
    }

    if (!selectedDoctorId || !filteredDoctors.some((doc) => doc._id === selectedDoctorId)) {
      setSelectedDoctorId(filteredDoctors[0]._id);
    }
  }, [filteredDoctors, selectedDoctorId]);

  const {
    data: doctorAppointmentsResponse,
    isLoading: isDoctorAppointmentsLoading,
    isFetching: isDoctorAppointmentsFetching,
    refetch: refetchDoctorAppointments,
  } = useGetAppointmentsByDoctorIdQuery(selectedDoctorId, {
    skip: !selectedDoctorId,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const appointmentsData = (doctorAppointmentsResponse as { data?: any } | undefined)?.data as
    | {
        upcoming?: DoctorAppointment[];
        history?: DoctorAppointment[];
      }
    | undefined;

  const upcomingAppointments = appointmentsData?.upcoming ?? [];
  const pastAppointments = appointmentsData?.history ?? [];

  const appointmentRows: AppointmentWithSerial[] = useMemo(() => {
    const withSlots = (rows: DoctorAppointment[]) =>
      rows.map((entry) => ({
        ...entry,
        slot: combineSlot(entry.appointmentDate, entry.appointmentTime),
      }));

    const sorted = [...withSlots(upcomingAppointments), ...withSlots(pastAppointments)].sort(
      (a, b) => a.slot.getTime() - b.slot.getTime()
    );

    return sorted.map((entry, index) => ({ ...entry, serial: index + 1 }));
  }, [upcomingAppointments, pastAppointments]);

  const isLoadingAppointments = isDoctorAppointmentsLoading || isDoctorAppointmentsFetching;

  return (
    <section className="space-y-8 px-4 pb-12 pt-6 lg:px-10">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-950 p-8 text-white shadow-xl shadow-violet-900/25">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <Badge className="w-fit bg-white/15 text-xs uppercase tracking-[0.28em] text-white">
              Doctor appointment list
            </Badge>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">All patient appointments by doctor</h1>
            <p className="max-w-3xl text-sm text-purple-100/85">
              Select any doctor to review their full appointment queue with serial numbers for quick check-in and follow-up.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild className="border-white/40 text-white hover:bg-white/10">
              <Link href="/receptionist/appointments">Back to booking</Link>
            </Button>
          </div>
        </div>
      </div>

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="space-y-4 border-b border-slate-100">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-2xl font-semibold text-slate-900">Filter by doctor</CardTitle>
              <CardDescription className="text-slate-600">Search and pick a doctor to load appointments.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => { refetchDoctors(); refetchDoctorAppointments(); }}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr] lg:grid-cols-[1.2fr_0.6fr_0.6fr]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search by name, specialization, or department"
                value={doctorSearch}
                onChange={(event) => setDoctorSearch(event.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={doctorDepartmentFilter} onValueChange={(value) => setDoctorDepartmentFilter(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                {Array.from(
                  new Set(
                    doctors
                      .map((doc) => doc.department)
                      .filter((dept): dept is string => Boolean(dept))
                      .map((dept) => dept)
                  )
                ).map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedDoctorId}
              onValueChange={(value) => setSelectedDoctorId(value)}
              disabled={filteredDoctors.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={isDoctorLoading ? "Loading doctors..." : "Choose doctor"} />
              </SelectTrigger>
              <SelectContent>
                {filteredDoctors.length === 0 && (
                  <SelectItem value="__none" disabled>
                    No doctors available
                  </SelectItem>
                )}
                {filteredDoctors.map((doctor) => (
                  <SelectItem key={doctor._id} value={doctor._id}>
                    {doctor.name} · {doctor.specialization}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {selectedDoctorId && isLoadingAppointments && (
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading appointments…
            </div>
          )}

          {!selectedDoctorId && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-800">
              Select a doctor to load appointment serials.
            </div>
          )}

          {selectedDoctorId && !isLoadingAppointments && appointmentRows.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              No appointments found for this doctor yet.
            </div>
          )}

          {appointmentRows.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-700">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-2">Serial</th>
                    <th className="px-3 py-2">Patient</th>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Time</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {appointmentRows.map((appointment) => {
                    const slot = formatSlot(appointment.appointmentDate, appointment.appointmentTime);
                    const statusTone =
                      appointment.status === "completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : appointment.status === "cancelled"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-indigo-100 text-indigo-700";

                    return (
                      <tr key={appointment._id} className="border-b border-slate-100 last:border-none">
                        <td className="px-3 py-2 font-semibold text-slate-900">{appointment.serial}</td>
                        <td className="px-3 py-2">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900">{appointment.patient?.name ?? "Patient"}</span>
                            <span className="text-xs text-slate-500">
                              {appointment.patient?.email ?? appointment.patient?.phone ?? ""}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-2">{slot.dateLabel}</td>
                        <td className="px-3 py-2">{slot.timeLabel}</td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${statusTone}`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-slate-600">{appointment.reason ?? "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default DoctorAppointmentsPage;
