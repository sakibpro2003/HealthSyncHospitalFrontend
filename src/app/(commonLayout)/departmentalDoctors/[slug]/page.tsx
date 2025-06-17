"use client";

import { useParams } from "next/navigation";
import { useGetAllDoctorQuery } from "@/redux/features/doctor/doctorApi";
import { IDoctor } from "@/redux/features/doctor/doctorApi";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const DepartmentDoctorsPage = () => {
  const params = useParams();
  const slug = params?.slug as string; // id will be your department name

  const { data, isLoading, error } = useGetAllDoctorQuery(slug);
  const doctors = data?.data?.result?.result;

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load doctors.</p>;

  if (!Array.isArray(doctors)) return <p>No doctors found.</p>;

  return (
    <div className="w-11/12 mx-auto mt-6 h-screen">
      <h2 className="text-3xl font-bold text-center mb-6">{slug} Doctors</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor: IDoctor) => (
          <div
            key={doctor._id}
            className="flex items-center gap-4 border shadow-lg rounded-xl bg-white hover:shadow-xl transition p-4"
          >
            {/* Doctor Image */}
            <Image
              src={doctor.image || "/default-doctor.jpg"}
              alt={doctor.name}
              width={120}
              height={120}
              className="rounded-lg object-cover"
            />

            {/* Info Section */}
            <div className="flex flex-col justify-between">
              <h3 className="text-lg font-semibold">{doctor.name}</h3>
              <p className="text-sm text-gray-600">{doctor.specialization}</p>
              <p className="text-sm text-gray-500">
                {doctor.education.join(", ")}
              </p>
              <Link href={`/doctor-details/${doctor._id}`}>
                <Button className="mt-2 px-3 py-1 text-white rounded  text-sm w-fit">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentDoctorsPage;
