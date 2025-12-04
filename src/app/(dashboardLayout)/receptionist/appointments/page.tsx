"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  CalendarClock,
  ClipboardList,
  Loader2,
  RefreshCcw,
  Search,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { useCreateAppointmentByStaffMutation } from "@/redux/features/appointment/appointmentApi";
import { useGetAllDoctorQuery, normaliseDoctorResult } from "@/redux/features/doctor/doctorApi";
import { IPatient, useGetAllPatientQuery } from "@/redux/features/patient/patientApi";

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

const blankForm = {
  patient: "",
  doctor: "",
  appointmentDate: "",
  appointmentTime: "",
  reason: "",
};

const ReceptionistAppointmentPage = () => {
  const [formState, setFormState] = useState(blankForm);
  const [patientSearch, setPatientSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");
  const [doctorDepartmentFilter, setDoctorDepartmentFilter] = useState("all");

  const {
    data: doctorData,
    isLoading: isDoctorLoading,
    isFetching: isDoctorFetching,
    refetch: refetchDoctors,
  } = useGetAllDoctorQuery({ page: 1, limit: 100 });
  const {
    data: patientData,
    isLoading: isPatientLoading,
    isFetching: isPatientFetching,
    refetch: refetchPatients,
  } = useGetAllPatientQuery({ page: 1, limit: 100, searchTerm: "" });
  const [createAppointment, { isLoading: isBooking }] = useCreateAppointmentByStaffMutation();

  const doctors = normaliseDoctorResult(doctorData?.data?.result);
  const patients = useMemo<IPatient[]>(() => patientData?.result ?? [], [patientData?.result]);

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

  const filteredPatients = useMemo(() => {
    const term = patientSearch.trim().toLowerCase();
    if (!term) return patients;
    return patients.filter((patient) =>
      [patient.name, patient.email, patient.phone].filter(Boolean).some((value) => value!.toLowerCase().includes(term))
    );
  }, [patients, patientSearch]);
  const patientSuggestions = filteredPatients.slice(0, 6);
  const doctorSuggestions = filteredDoctors.slice(0, 6);

  const selectedDoctor = useMemo(
    () => doctors.find((entry) => entry._id === formState.doctor),
    [doctors, formState.doctor]
  );
  const selectedPatient = useMemo(
    () => patients.find((entry) => entry._id === formState.patient),
    [patients, formState.patient]
  );

  const isLoading = isDoctorLoading || isPatientLoading;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.patient || !formState.doctor || !formState.appointmentDate || !formState.appointmentTime) {
      toast.error("Please select patient, doctor, date, and time.");
      return;
    }

    const parsedDate = new Date(formState.appointmentDate);
    if (Number.isNaN(parsedDate.getTime())) {
      toast.error("Please provide a valid appointment date.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsedDate < today) {
      toast.error("Appointment date cannot be in the past.");
      return;
    }

    const totalMinutes = timeToMinutes(formState.appointmentTime);
    if (Number.isNaN(totalMinutes)) {
      toast.error("Provide a valid time in HH:MM format.");
      return;
    }

    if (totalMinutes < BOOKING_START_MINUTE || totalMinutes > BOOKING_END_MINUTE) {
      toast.error("Appointments can be booked between 08:00 and 22:00.");
      return;
    }

    try {
      await createAppointment({
        patient: formState.patient,
        doctor: formState.doctor,
        appointmentDate: formState.appointmentDate,
        appointmentTime: formState.appointmentTime,
        reason: formState.reason,
      }).unwrap();

      toast.success("Appointment booked successfully.");
      setFormState(blankForm);
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : undefined;
      toast.error(message ?? "Failed to book appointment. Please try again.");
    }
  };

  const emptyState =
    !isLoading && !isDoctorFetching && !isPatientFetching && (!doctors.length || !patients.length);

  return (
    <section className="space-y-8 px-4 pb-12 pt-6 lg:px-10">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.65fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-violet-700 via-indigo-600 to-violet-800 text-white shadow-xl">
            <CardHeader className="space-y-3">
              <Badge className="w-fit bg-white/20 text-xs uppercase tracking-[0.2em] text-white">
                Appointment desk
              </Badge>
              <CardTitle className="text-3xl font-semibold leading-tight">
                Book a visit on behalf of patients
              </CardTitle>
              <CardDescription className="text-base text-white/80">
                Pair any registered patient with a specialist, confirm their slot, and keep the schedule
                in sync for doctors and patients instantly.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-white/85 md:grid-cols-2">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.28em] text-white/60">Working window</p>
                <p className="text-lg font-semibold text-white">08:00 – 22:00 daily</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.28em] text-white/60">Availability</p>
                <p className="text-lg font-semibold text-white">Real-time slot validation</p>
              </div>
              <div className="md:col-span-2 flex flex-wrap gap-3 text-xs text-white/80">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5">
                  <ClipboardList className="h-4 w-4" /> No payment required at desk
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5">
                  <CalendarClock className="h-4 w-4" /> Auto-notifies doctor schedule
                </span>
                <Link href="/receptionist/doctor-appointments" className="mt-1">
                  <Button variant="outline" size="sm" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                    View doctor appointment list
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="space-y-2">
              <CardTitle className="text-lg font-semibold">Selected details</CardTitle>
              <CardDescription>Make sure the right patient and doctor are paired.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-violet-700">
                  <UserRound className="h-4 w-4" /> Patient
                </div>
                {selectedPatient ? (
                  <div className="mt-2 space-y-1 text-sm text-slate-700">
                    <p className="font-semibold text-slate-900">{selectedPatient.name}</p>
                    <p>{selectedPatient.email ?? "Email not on file"}</p>
                    <p>{selectedPatient.phone ?? "Phone not on file"}</p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">Pick a patient to see details.</p>
                )}
              </div>
              <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-violet-700">
                  <Stethoscope className="h-4 w-4" /> Doctor
                </div>
                {selectedDoctor ? (
                  <div className="mt-2 space-y-1 text-sm text-slate-700">
                    <p className="font-semibold text-slate-900">{selectedDoctor.name}</p>
                    <p className="text-violet-700">{selectedDoctor.specialization}</p>
                    <p className="text-slate-600">{selectedDoctor.department}</p>
                    {selectedDoctor.consultationFee && (
                      <p className="text-xs text-slate-500">
                        Fee: ৳{selectedDoctor.consultationFee.toLocaleString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-slate-600">Select a doctor to confirm availability.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="text-2xl font-semibold">Book appointment</CardTitle>
                <CardDescription>Schedule on behalf of patients in one step.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { refetchPatients(); refetchDoctors(); }}>
                  <RefreshCcw className="mr-2 h-4 w-4" /> Refresh lists
                </Button>
              </div>
            </div>
            {emptyState && (
              <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
                <AlertCircle className="h-4 w-4" />
                Add patients and doctors first to book appointments.
              </div>
            )}
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="patient">Select patient</Label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search by name, phone, or email"
                    value={patientSearch}
                    onChange={(event) => setPatientSearch(event.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                    value={formState.patient}
                    onValueChange={(value) => setFormState((prev) => ({ ...prev, patient: value }))}
                    disabled={isLoading || isPatientFetching || !patients.length}
                  >
                    <SelectTrigger id="patient" className="w-full">
                    <SelectValue placeholder={isLoading ? "Loading patients..." : "Choose patient"} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredPatients.length === 0 && (
                      <SelectItem value="__empty" disabled>
                        No patients match your search
                      </SelectItem>
                    )}
                    {filteredPatients.map((patient) => (
                      <SelectItem key={patient._id} value={patient._id}>
                        {patient.name} {patient.phone ? `· ${patient.phone}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-sm text-slate-700">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Matching patients</p>
                  <div className="mt-2 grid gap-2">
                    {patientSuggestions.length ? (
                      patientSuggestions.map((patient) => (
                        <button
                          key={patient._id}
                          type="button"
                          onClick={() => setFormState((prev) => ({ ...prev, patient: patient._id }))}
                          className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left transition hover:border-violet-300 hover:shadow-sm"
                        >
                          <div className="space-y-0.5">
                            <p className="font-semibold text-slate-900">{patient.name}</p>
                            <p className="text-xs text-slate-500">
                              {patient.phone || patient.email || "No contact on file"}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs text-slate-500">
                            Select
                          </Badge>
                        </button>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500">Start typing to see matches.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctor">Select doctor</Label>
                <div className="grid gap-2 md:grid-cols-[1fr_auto]">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Search by name, specialization, or department"
                      value={doctorSearch}
                      onChange={(event) => setDoctorSearch(event.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select
                    value={doctorDepartmentFilter}
                    onValueChange={(value) => setDoctorDepartmentFilter(value)}
                  >
                    <SelectTrigger className="w-full min-w-[160px]">
                      <SelectValue placeholder="Filter dept." />
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
                </div>
                <Select
                  value={formState.doctor}
                    onValueChange={(value) => setFormState((prev) => ({ ...prev, doctor: value }))}
                    disabled={isLoading || isDoctorFetching || !doctors.length}
                  >
                    <SelectTrigger id="doctor" className="w-full">
                      <SelectValue placeholder={isLoading ? "Loading doctors..." : "Choose doctor"} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredDoctors.length === 0 && (
                      <SelectItem value="__empty" disabled>
                        No doctors match your filters
                      </SelectItem>
                    )}
                    {filteredDoctors.map((doctor) => (
                      <SelectItem key={doctor._id} value={doctor._id}>
                        {doctor.name} · {doctor.specialization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-sm text-slate-700">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Matching doctors</p>
                  <div className="mt-2 grid gap-2">
                    {doctorSuggestions.length ? (
                      doctorSuggestions.map((doctor) => (
                        <button
                          key={doctor._id}
                          type="button"
                          onClick={() => setFormState((prev) => ({ ...prev, doctor: doctor._id }))}
                          className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left transition hover:border-violet-300 hover:shadow-sm"
                        >
                          <div className="space-y-0.5">
                            <p className="font-semibold text-slate-900">{doctor.name}</p>
                            <p className="text-xs text-slate-500">
                              {doctor.specialization} {doctor.department ? `· ${doctor.department}` : ""}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs text-slate-500">
                            Select
                          </Badge>
                        </button>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500">Start typing to see matches.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="appointmentDate">Appointment date</Label>
                <Input
                  id="appointmentDate"
                  type="date"
                  value={formState.appointmentDate}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, appointmentDate: event.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="appointmentTime">Appointment time</Label>
                <Input
                  id="appointmentTime"
                  type="time"
                  value={formState.appointmentTime}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, appointmentTime: event.target.value }))
                  }
                  required
                  min="08:00"
                  max="22:00"
                />
                <p className="text-xs text-slate-500">Available between 08:00 and 22:00</p>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="reason">Reason / notes (optional)</Label>
                <Textarea
                  id="reason"
                  placeholder="Add a short note for the doctor"
                  value={formState.reason}
                  onChange={(event) => setFormState((prev) => ({ ...prev, reason: event.target.value }))}
                  rows={3}
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-3">
                <Button
                  type="submit"
                  className="rounded-full bg-violet-600 px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-700 disabled:cursor-not-allowed"
                  disabled={isBooking || isLoading || emptyState}
                >
                  {isBooking ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Booking…
                    </>
                  ) : (
                    "Book appointment"
                  )}
                </Button>
                <p className="text-xs text-slate-500">
                  Reception bookings skip payment and instantly block the slot.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

    </section>
  );
};

export default ReceptionistAppointmentPage;
