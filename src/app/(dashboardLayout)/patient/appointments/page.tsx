"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CalendarDays, Clock, MapPin, UserCircle2, Loader2 } from "lucide-react";
import { useGetAppointmentsByPatientQuery } from "@/redux/features/appointment/appointmentApi";

interface AuthedUser {
  userId?: string;
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
}

const AppointmentsPage = () => {
  const [user, setUser] = useState<AuthedUser | null>(null);

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
  });

  useEffect(() => {
    if (patientId) {
      refetch();
    }
  }, [patientId, refetch]);

  const appointments = appointmentsData?.data ?? [];

  return (
    <div className="p-6 bg-gradient-to-tr from-sky-50 via-white to-blue-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">My Appointments</h1>
          <p className="text-sm text-gray-500 mt-1">
            Keep track of your scheduled visits and upcoming consultations.
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

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {appointments.map((appointment: any) => (
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
                  <span
                    className={`text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full ${
                      appointment.status === "scheduled"
                        ? "bg-emerald-100 text-emerald-700"
                        : appointment.status === "completed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {appointment.status}
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
                <span>
                  {new Date(appointment.appointmentDate).toLocaleDateString(
                    undefined,
                    { weekday: "short", month: "short", day: "numeric" }
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>{appointment.appointmentTime}</span>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentsPage;
