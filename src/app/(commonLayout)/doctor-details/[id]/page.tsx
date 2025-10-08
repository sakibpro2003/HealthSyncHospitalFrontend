/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import {
  CalendarClock,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Sparkles,
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
    <section className="relative bg-gradient-to-br from-white via-violet-50/60 to-white py-12">
      <div
        className="absolute -top-20 left-0 w-48 rounded-full bg-violet-200/60 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -bottom-24 right-6 w-56 rounded-full bg-sky-200/55 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto flex w-full justify-center gap-12">
        <div className="grid gap-10 rounded-[2.75rem] border border-white/20 bg-white/85 p-8 shadow-[0_30px_70px_-45px_rgba(91,33,182,0.35)] backdrop-blur lg:grid-cols-[320px,1fr] lg:p-12">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-xs overflow-hidden rounded-3xl border border-white/40 bg-violet-100 shadow-xl">
            <Image
              src={doctor.image || "/default-doctor.jpg"}
              alt={doctor.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-violet-600">
                <Sparkles className="size-4" />
                HealthSync specialist
              </span>
              <div>
                <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
                  {doctor.name}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-violet-600">
                    <Stethoscope className="h-4 w-4" />
                    {doctor.specialization}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-slate-500 shadow">
                    <UserRound className="h-4 w-4" />
                    {doctor.department}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
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
                <span>
                  {doctor.availability?.location ?? "Location on request"}
                </span>
              </p>
            </div>

            <div className="space-y-6 text-sm text-slate-600">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Education & training
                </h2>
                {education ? (
                  <p className="mt-2 flex items-start gap-2">
                    <GraduationCap className="mt-0.5 h-4 w-4 text-violet-500" />
                    <span>{education}</span>
                  </p>
                ) : (
                  <p className="mt-2 text-slate-500">
                    No academic details provided.
                  </p>
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Biography
                </h2>
                <p className="mt-2 leading-relaxed">
                  {doctor.bio ||
                    "This specialist has not added a biography just yet."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-violet-100 bg-violet-50/70 px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-violet-500">
                  Consultation fee
                </p>
                <p className="text-2xl font-semibold text-violet-700">
                  ৳{doctor.consultationFee?.toLocaleString() ?? "—"}
                </p>
              </div>
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button className="rounded-full bg-violet-600 px-6 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-700">
                    Book appointment
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle className="text-xl font-semibold text-slate-900">
                      Book a consultation
                    </SheetTitle>
                    <p className="text-sm text-slate-500">
                      Select a date and time that suits you and follow the steps
                      to confirm your visit with {doctor.name}.
                    </p>
                  </SheetHeader>

                  <form
                    className="mt-6 flex flex-col gap-4"
                    onSubmit={handleSubmit}
                  >
                    <div className="grid gap-2">
                      <Label>Consultation fee</Label>
                      <p className="rounded-xl bg-violet-100 px-3 py-2 text-violet-600">
                        ৳{doctor.consultationFee?.toLocaleString() ?? "—"}
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="appointmentDate">Preferred date</Label>
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
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="appointmentTime">Preferred time</Label>
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
                        required
                      />
                      <p className="text-xs text-slate-500">
                        Available: {availabilityDays ?? "—"}
                        {availabilityWindow ? ` (${availabilityWindow})` : ""}
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="reason">Visit reason (optional)</Label>
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
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isBooking || !patientId}
                      className="w-full rounded-full"
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

        <div className="grid gap-6 rounded-[2.5rem] border border-white/15 bg-white/85 p-8 shadow-lg backdrop-blur sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Comprehensive care tailored to your condition",
            "International training & evidence-based practice",
            "Timely follow-ups and holistic advice",
            doctor.availability?.location
              ? `Consultations at ${doctor.availability.location}`
              : "Hybrid teleconsultation available",
            doctor.experience || "Seasoned specialist trusted by patients",
            availabilityWindow
              ? `Slots between ${availabilityWindow}`
              : "Flexible appointment windows",
          ].map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-2xl bg-violet-50/60 px-4 py-3 text-sm text-slate-600"
            >
              <Sparkles className="mt-0.5 h-4 w-4 text-violet-500" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
