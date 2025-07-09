"use client";

import Link from "next/link";
import { Button } from "../ui/button";

const departments = [
  { name: "Cardiology", slug: "Cardiology" },
  { name: "Neurology", slug: "Neurology" },
  { name: "Orthopedics", slug: "Orthopedics" },
  { name: "Pediatrics", slug: "Pediatrics" },
  { name: "Dermatology", slug: "Dermatology" },
  { name: "General", slug: "General" },
  { name: "Radiology", slug: "Radiology" },
  { name: "Psychiatry", slug: "Psychiatry" },
  { name: "Emergency", slug: "Emergency" },
  { name: "Dental", slug: "Dental" },
  { name: "Oncology", slug: "Oncology" },
  { name: "Urology", slug: "Urology" },
];

const DepartmentButtons = () => {
  return (
    <div className="mt-10">
      <h2 className="text-3xl text-center">Find Doctor</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6 w-11/12 mx-auto">
        {departments.map((dept) => (
          <Link key={dept.slug} href={`/departmentalDoctors/${dept.slug}`}>
            <Button className="w-full">{dept.name}</Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DepartmentButtons;
