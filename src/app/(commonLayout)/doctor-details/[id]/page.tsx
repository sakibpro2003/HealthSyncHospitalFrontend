"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useGetSingleDoctorQuery } from "@/redux/features/doctor/doctorApi";
import { Button } from "@/components/ui/button";

export default function DoctorDetailsPage() {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetSingleDoctorQuery(id as string);
  const doctor = data?.data?.result;

  if (isLoading)
    return <div className="w-11/12 mx-auto mt-10 text-center">Loading...</div>;
  if (isError || !doctor)
    return (
      <div className="w-11/12 mx-auto mt-10 text-center text-red-500">
        Doctor not found.
      </div>
    );

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
        <Button>Book Appointment</Button>
      </div>
    </div>
  );
}
