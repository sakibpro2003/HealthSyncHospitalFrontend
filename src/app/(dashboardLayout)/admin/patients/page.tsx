"use client";

import Patients, { PatientsContent } from "@/app/(dashboardLayout)/receptionist/patients/page";

export default function AdminPatientsPage() {
  return <Patients baseSegment="admin" />;
}

export { PatientsContent };
