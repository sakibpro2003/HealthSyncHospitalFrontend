"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { useGetSingleDoctorQuery } from "@/redux/features/doctor/doctorApi";
import { useCreateAppointmentMutation } from "@/redux/features/appointment/appointmentApi";
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

export default function DoctorDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading, isError } = useGetSingleDoctorQuery(id as string);
  const [createAppointment, { isLoading: isBooking }] =
    useCreateAppointmentMutation();
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
      } catch (error) {
        console.error("Not logged in");
      }
    };
    fetchUser();
  }, []);

  const doctor = data?.data?.result;
  //  const token = cookies().get("token")?.value;
  // const user = token ? await verifyToken(token) : null;

  if (isLoading)
    return <div className="w-11/12 mx-auto mt-10 text-center">Loading...</div>;
  if (isError || !doctor)
    return (
      <div className="w-11/12 mx-auto mt-10 text-center text-red-500">
        Doctor not found.
      </div>
    );

  const patientId = user?.userId ?? user?._id;

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

    try {
      await createAppointment({
        patient: patientId,
        doctor: doctor._id,
        appointmentDate: formState.appointmentDate,
        appointmentTime: formState.appointmentTime,
        reason: formState.reason,
      }).unwrap();

      toast.success("Appointment booked successfully");
      setFormState({ appointmentDate: "", appointmentTime: "", reason: "" });
      setSheetOpen(false);
      router.push("/patient/appointments");
    } catch (error: any) {
      const message =
        error?.data?.message || "Failed to book appointment. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div>
      <h2 className="text-3xl text-center mt-10">Doctor Detail</h2>
      <div className="w-11/12 mx-auto my-10 p-6 bg-white shadow-lg rounded-xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Doctor Image */}
        <div className="md:col-span-1 flex justify-center">
          <div className="relative w-64 h-80 rounded-lg overflow-hidden shadow-md">
            <Image
              src={doctor.image}
              alt={doctor.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Doctor Info */}
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{doctor.name}</h1>
          <p className="text-lg text-gray-600">
            {doctor.specialization} - {doctor.department}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p>
              <span className="font-semibold">Email:</span> {doctor.email}
            </p>
            <p>
              <span className="font-semibold">Phone:</span> {doctor.phone}
            </p>
            <p>
              <span className="font-semibold">Experience:</span>{" "}
              {doctor.experience || "Not Available"}
            </p>
            {doctor.availability ? (
              <p>
                <span className="font-semibold">Availability:</span>{" "}
                {doctor.availability.days?.join(", ")}
                <br />({doctor.availability.from} - {doctor.availability.to})
              </p>
            ) : (
              <p>
                <span className="font-semibold">Availability:</span> Not
                Available
              </p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mt-4 mb-2">Education</h2>
            {Array.isArray(doctor.education) && doctor.education.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700">
                {doctor.education.map((degree: string[], index: number) => (
                  <li key={index}>{degree}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Education details not available.</p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mt-4 mb-2">Biography</h2>
            <p className="text-gray-700">{doctor.bio || "No bio available."}</p>
          </div>
        </div>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button className="md:col-span-3 w-full md:w-auto md:justify-self-end">
              Book Appointment
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="text-xl font-semibold text-gray-800">
                Book a Consultation
              </SheetTitle>
              <p className="text-sm text-gray-500">
                Secure your slot with {doctor.name}. Fill in the details below.
              </p>
            </SheetHeader>
            <form className="flex flex-col gap-4 p-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="appointmentDate">Preferred Date</Label>
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
                <Label htmlFor="appointmentTime">Preferred Time</Label>
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
                <p className="text-xs text-gray-500">
                  Doctor availability: {doctor.availability?.from} - {" "}
                  {doctor.availability?.to} on {" "}
                  {doctor.availability?.days?.join(", ")}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reason">Visit Reason (optional)</Label>
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

              <Button type="submit" disabled={isBooking} className="w-full">
                {isBooking ? "Booking..." : "Confirm Appointment"}
              </Button>
              {!patientId && (
                <p className="text-xs text-red-500 text-center">
                  Please log in as a patient to book an appointment.
                </p>
              )}
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
