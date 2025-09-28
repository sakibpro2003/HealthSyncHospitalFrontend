"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { format } from "date-fns";
import { loadStripe } from "@stripe/stripe-js";
import {
  Stethoscope,
  GraduationCap,
  Mail,
  Phone,
  Building,
  CalendarClock,
  Clock,
  Quote,
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

type AuthedUser = {
  userId?: string;
  _id?: string;
  email?: string;
  name?: string;
  role?: string;
};

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
  const [user, setUser] = useState<AuthedUser | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [formState, setFormState] = useState({
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const doctor = data?.data?.result;
  const patientId = user?.userId ?? user?._id;

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

  const education = Array.isArray(doctor.education)
    ? doctor.education.join(", ")
    : doctor.education;

  const availabilityDays = doctor.availability?.days?.join(", ");
  const availabilityWindow =
    doctor.availability?.from && doctor.availability?.to
      ? `${doctor.availability.from} – ${doctor.availability.to}`
      : undefined;

  return (
    <section className="bg-slate-50 py-12 dark:bg-slate-950">
      <div className="mx-auto w-11/12 space-y-8">
        <div className="grid gap-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:grid-cols-[320px,1fr] dark:border-slate-800 dark:bg-slate-900">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-xs overflow-hidden rounded-2xl shadow-lg">
            <Image
              src={doctor.image || "/default-doctor.jpg"}
              alt={doctor.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-blue-500">
                HealthSync Specialist
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                {doctor.name}
              </h1>
              <p className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300">
                  <Stethoscope className="h-4 w-4" />
                  {doctor.specialization}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <Building className="h-4 w-4" />
                  {doctor.department}
                </span>
              </p>
            </div>

            <div className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2 dark:text-slate-300">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" />
                {doctor.email}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-500" />
                {doctor.phone}
              </p>
              <p className="flex items-start gap-2">
                <Quote className="h-4 w-4 text-blue-500" />
                <span>
                  Experience:{" "}
                  {doctor.experience ? doctor.experience : "Information not available."}
                </span>
              </p>
              <p className="flex items-start gap-2">
                <CalendarClock className="h-4 w-4 text-blue-500" />
                <span>
                  Availability:{" "}
                  {availabilityDays ? `${availabilityDays}` : "—"}
                  {availabilityWindow ? ` | ${availabilityWindow}` : ""}
                </span>
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Education & Training
                </h2>
                {education ? (
                  <p className="mt-1 flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <GraduationCap className="mt-0.5 h-4 w-4 text-blue-500" />
                    {education}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    No academic details provided.
                  </p>
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Biography
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {doctor.bio || "This specialist has not added a biography just yet."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between rounded-2xl bg-blue-50 px-5 py-4 dark:bg-blue-500/10">
              <div>
                <p className="text-xs uppercase tracking-wide text-blue-500">
                  Consultation Fee
                </p>
                <p className="text-2xl font-semibold text-blue-700 dark:text-blue-300">
                  ৳{doctor.consultationFee?.toLocaleString() ?? "—"}
                </p>
              </div>
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button className="rounded-full px-6 text-sm">
                    Book Appointment
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                      Book a consultation
                    </SheetTitle>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Select a date and time that suits you and follow the steps to confirm
                      your visit with {doctor.name}.
                    </p>
                  </SheetHeader>

                  <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                      <Label>Consultation Fee</Label>
                      <p className="rounded-md bg-blue-50 px-3 py-2 text-blue-600 dark:bg-blue-500/10 dark:text-blue-200">
                        ৳{doctor.consultationFee?.toLocaleString() ?? "—"}
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="appointmentDate">Preferred Date</Label>
                      <Input
                        id="appointmentDate"
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={formState.appointmentDate}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            appointmentDate: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="appointmentTime">Preferred Time</Label>
                      <Input
                        id="appointmentTime"
                        type="time"
                        value={formState.appointmentTime}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            appointmentTime: e.target.value,
                          }))
                        }
                        required
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Available: {availabilityDays ? availabilityDays : "—"}{" "}
                        {availabilityWindow ? `(${availabilityWindow})` : ""}
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="reason">Visit reason (optional)</Label>
                      <Textarea
                        id="reason"
                        rows={4}
                        placeholder="Describe your symptoms or concerns"
                        value={formState.reason}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            reason: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isBooking || !patientId}
                      className="w-full"
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

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Why patients trust {doctor.name}
          </h2>
          <ul className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2 lg:grid-cols-3">
            <li className="flex items-start gap-2 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
              <Stethoscope className="mt-0.5 h-4 w-4 text-blue-500" />
              Comprehensive care tailored to your condition.
            </li>
            <li className="flex items-start gap-2 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
              <GraduationCap className="mt-0.5 h-4 w-4 text-blue-500" />
              International training & evidence-based practice.
            </li>
            <li className="flex items-start gap-2 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
              <Clock className="mt-0.5 h-4 w-4 text-blue-500" />
              Timely follow-ups and holistic advice.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
