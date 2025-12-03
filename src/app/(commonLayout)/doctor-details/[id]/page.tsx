/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import {
  Activity,
  Award,
  CalendarClock,
  Clock,
  GraduationCap,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";

import { useGetSingleDoctorQuery } from "@/redux/features/doctor/doctorApi";
import { useCreateAppointmentCheckoutMutation } from "@/redux/features/appointment/appointmentApi";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useClientUser } from "@/hooks/useClientUser";

const BOOKING_START_MINUTE = 8 * 60;
const BOOKING_END_MINUTE = 22 * 60;

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

export default function DoctorDetailsPage() {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetSingleDoctorQuery(id as string);
  const [createAppointmentCheckout, { isLoading: isBooking }] =
    useCreateAppointmentCheckoutMutation();
  const { user } = useClientUser();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [formState, setFormState] = useState({
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
  });

  const doctor = data?.data?.result;
  const patientId = user?.userId ?? user?._id;

  const education = useMemo(
    () =>
      Array.isArray(doctor?.education)
        ? doctor?.education.join(", ")
        : doctor?.education,
    [doctor?.education]
  );
  const availabilityDays = useMemo(
    () => doctor?.availability?.days?.join(", "),
    [doctor?.availability?.days]
  );
  const availabilityWindow =
    doctor?.availability?.from && doctor?.availability?.to
      ? `${doctor.availability.from} – ${doctor.availability.to}`
      : undefined;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-slate-500">Loading doctor profile…</p>
      </div>
    );
  }

  if (isError || !doctor) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-red-500">
          We couldn’t find the doctor you were looking for.
        </p>
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!patientId) {
      toast.error("Please log in to book an appointment");
      return;
    }

    if (!formState.appointmentDate || !formState.appointmentTime) {
      toast.error("Select appointment date and time");
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
      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (!publishableKey) {
        toast.error("Stripe publishable key is not configured");
        return;
      }

      const stripe = await loadStripe(publishableKey);
      if (!stripe) {
        toast.error("Stripe is not configured");
        return;
      }

      const response = await createAppointmentCheckout({
        patient: patientId,
        patientEmail: user?.email,
        doctor: doctor._id,
        appointmentDate: formState.appointmentDate,
        appointmentTime: formState.appointmentTime,
        reason: formState.reason,
      }).unwrap();

      toast.success("Redirecting to payment…");
      const result = await stripe.redirectToCheckout({
        sessionId: response.data.id,
      });

      if (result.error) {
        toast.error(result.error.message ?? "Stripe redirect failed");
      }

      setFormState({ appointmentDate: "", appointmentTime: "", reason: "" });
      setSheetOpen(false);
    } catch (error: any) {
      const message =
        error?.data?.message || "Failed to book appointment. Please try again.";
      toast.error(message);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-violet-50/60 to-white py-8">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(109,40,217,0.12),transparent_35%),radial-gradient(circle_at_82%_12%,rgba(99,102,241,0.12),transparent_32%),radial-gradient(circle_at_50%_86%,rgba(124,58,237,0.12),transparent_38%)]"
        aria-hidden
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-7 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative overflow-hidden rounded-[24px] border border-white/60 bg-white/90 shadow-[0_18px_50px_-35px_rgba(91,33,182,0.35)] backdrop-blur">
            <div className="grid gap-5 p-6 sm:grid-cols-[210px,1fr] sm:items-start">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-white/80 bg-violet-50 shadow-lg">
                <Image
                  src={doctor.image || "/default-doctor.jpg"}
                  alt={doctor.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-violet-700 shadow">
                  <Stethoscope className="h-4 w-4 text-violet-600" />
                  Specialist
                </div>
              </div>

              <div className="space-y-4 text-slate-900">
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-600">
                  <ShieldCheck className="h-4 w-4 text-violet-500" />
                  HealthSync certified
                </div>
                <div className="space-y-2.5">
                  <h1 className="text-3xl font-black leading-tight sm:text-4xl">
                    {doctor.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-violet-700">
                      <Stethoscope className="h-4 w-4 text-violet-600" />
                      {doctor.specialization}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-slate-500 shadow">
                      <UserRound className="h-4 w-4" />
                      {doctor.department}
                    </span>
                  </div>
                </div>

                <div className="grid gap-2.5 text-sm text-slate-600 sm:grid-cols-2">
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-violet-500" />
                    {doctor.email || "Not shared"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-violet-500" />
                    {doctor.phone || "Not shared"}
                  </p>
                  <p className="flex items-start gap-2">
                    <CalendarClock className="h-4 w-4 text-violet-500" />
                    <span>
                      {availabilityDays ?? "Availability to be confirmed"}
                      {availabilityWindow ? ` · ${availabilityWindow}` : ""}
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-violet-500" />
                    <span>{doctor.availability?.location ?? "Location on request"}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm text-slate-700 sm:grid-cols-3">
                  <div className="rounded-2xl border border-violet-100 bg-violet-50 p-2.5">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-violet-600/80">
                      Fee
                    </p>
                    <p className="text-xl font-semibold text-violet-800">
                      ৳{doctor.consultationFee?.toLocaleString() ?? "—"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-violet-100 bg-violet-50 p-2.5">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-violet-600/80">
                      Experience
                    </p>
                    <p className="text-xl font-semibold text-violet-800">
                      {doctor.experience || "10+ years"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-violet-100 bg-violet-50 p-2.5">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-violet-600/80">
                      Availability
                    </p>
                    <p className="text-sm font-semibold text-violet-800">
                      {availabilityDays ?? "On request"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[24px] border border-violet-100 bg-white/90 p-6 shadow-[0_18px_50px_-35px_rgba(91,33,182,0.35)] backdrop-blur">
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">Consultation booking</p>
                <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800">
                  <HeartPulse className="h-4 w-4" />
                  Active
                </span>
              </div>
              <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">Fee per session</p>
                <p className="text-2xl font-bold text-violet-800">
                  ৳{doctor.consultationFee?.toLocaleString() ?? "—"}
                </p>
                <p className="text-xs text-slate-500">
                  Includes clinic visit or teleconsultation (where available).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="rounded-2xl border border-violet-100 bg-white p-3">
                  <Clock className="h-4 w-4 text-violet-600" />
                  <p className="mt-1 font-semibold text-slate-900">Slots</p>
                  <p>{availabilityWindow ?? "08:00 – 22:00"}</p>
                </div>
                <div className="rounded-2xl border border-violet-100 bg-white p-3">
                  <Activity className="h-4 w-4 text-violet-600" />
                  <p className="mt-1 font-semibold text-slate-900">Days</p>
                  <p>{availabilityDays ?? "Check schedule"}</p>
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-violet-100 bg-violet-50 p-3.5 text-sm text-slate-700">
                <p className="text-sm font-semibold text-slate-900">Doctor snapshot</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex gap-2 rounded-xl bg-white p-3">
                    <HeartPulse className="mt-1 h-4 w-4 text-violet-600" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-violet-600">Biography</p>
                      <p className="text-sm text-slate-700">
                        {doctor.bio ||
                          "This specialist has not added a biography just yet. Reach out to learn more about their focus areas."}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 rounded-xl bg-white p-3">
                    <GraduationCap className="mt-1 h-4 w-4 text-violet-600" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-violet-600">Education</p>
                      <p className="text-sm text-slate-700">
                        {education || "Academic details will be shared soon."}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 rounded-xl bg-white p-3">
                    <CalendarClock className="mt-1 h-4 w-4 text-violet-600" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-violet-600">Availability</p>
                      <p className="text-sm text-slate-700">
                        {availabilityWindow || availabilityDays
                          ? `${availabilityDays ?? "By request"}${availabilityWindow ? ` · ${availabilityWindow}` : ""}`
                          : "Schedule to be confirmed with the clinic."}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 rounded-xl bg-white p-3">
                    <MapPin className="mt-1 h-4 w-4 text-violet-600" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-violet-600">Location</p>
                      <p className="text-sm text-slate-700">
                        {doctor.availability?.location ?? "Hybrid teleconsultation available."}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 rounded-xl bg-white p-3">
                    <Award className="mt-1 h-4 w-4 text-violet-600" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-violet-600">Experience</p>
                      <p className="text-sm text-slate-700">
                        {doctor.experience || "Seasoned specialist trusted by patients."}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 rounded-xl bg-white p-3">
                    <ShieldCheck className="mt-1 h-4 w-4 text-violet-600" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-violet-600">Patient promise</p>
                      <p className="text-sm text-slate-700">
                        Evidence-based care, clear communication, and timely follow-ups for every visit.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button className="w-full rounded-full bg-violet-600 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:bg-violet-700">
                    Book an appointment
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle className="text-xl font-semibold text-slate-900">
                      Book a consultation
                    </SheetTitle>
                    <p className="text-sm text-slate-500">
                      Select a date and time that suits you and follow the steps to confirm your visit with {doctor.name}.
                    </p>
                  </SheetHeader>

                  <form className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit}>
                    <div className="grid gap-3 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-violet-50/80 p-5 shadow-sm">
                      <div className="flex items-center justify-between text-sm text-slate-700">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-violet-600" />
                          <span className="font-semibold text-slate-900">Consultation fee</span>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-violet-700 shadow-sm">
                          {doctor.consultationFee ? "Fixed" : "TBD"}
                        </span>
                      </div>
                      <p className="text-3xl font-bold text-violet-800">
                        ৳{doctor.consultationFee?.toLocaleString() ?? "—"}
                      </p>
                      <p className="text-xs text-slate-500">
                        Includes clinic visit or teleconsultation (where available).
                      </p>
                    </div>

                    <div className="grid gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-md shadow-slate-200/50">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="grid gap-1.5">
                          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                            <Label htmlFor="appointmentDate" className="text-slate-700">
                              Preferred date
                            </Label>
                            <span className="text-[11px] text-violet-600">Required</span>
                          </div>
                          <Input
                            id="appointmentDate"
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            value={formState.appointmentDate}
                            onChange={(event) =>
                              setFormState((prev) => ({
                                ...prev,
                                appointmentDate: event.target.value,
                              }))
                            }
                            className="h-11 rounded-xl border-slate-200 bg-slate-50/60 focus-visible:border-violet-400 focus-visible:ring-violet-200"
                            required
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                            <Label htmlFor="appointmentTime" className="text-slate-700">
                              Preferred time
                            </Label>
                            <span className="text-[11px] text-violet-600">Required</span>
                          </div>
                          <Input
                            id="appointmentTime"
                            type="time"
                            value={formState.appointmentTime}
                            onChange={(event) =>
                              setFormState((prev) => ({
                                ...prev,
                                appointmentTime: event.target.value,
                              }))
                            }
                            className="h-11 rounded-xl border-slate-200 bg-slate-50/60 focus-visible:border-violet-400 focus-visible:ring-violet-200"
                            required
                          />
                          <p className="text-xs text-slate-500">
                            Available: {availabilityDays ?? "—"}
                            {availabilityWindow ? ` (${availabilityWindow})` : ""}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                          <Label htmlFor="reason" className="text-slate-700">
                            Visit reason (optional)
                          </Label>
                          <span className="text-[11px] text-slate-400">Helps prep your visit</span>
                        </div>
                        <Textarea
                          id="reason"
                          rows={4}
                          placeholder="Describe your symptoms or concerns"
                          value={formState.reason}
                          onChange={(event) =>
                            setFormState((prev) => ({
                              ...prev,
                              reason: event.target.value,
                            }))
                          }
                          className="rounded-xl border-slate-200 bg-slate-50/60 focus-visible:border-violet-400 focus-visible:ring-violet-200"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isBooking || !patientId}
                      className="h-12 w-full rounded-full bg-violet-600 text-sm font-semibold text-white shadow-lg shadow-violet-400/30 transition hover:-translate-y-0.5 hover:bg-violet-700"
                    >
                      {isBooking ? "Preparing…" : "Proceed to payment"}
                    </Button>
                    {!patientId && (
                      <p className="text-center text-xs text-red-500">
                        Please log in as a patient to book an appointment.
                      </p>
                    )}
                  </form>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
