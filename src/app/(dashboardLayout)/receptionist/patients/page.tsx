"use client";
import Loader from "@/components/shared/Loader";
import Paginate from "@/components/shared/Paginate";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IPatient,
  useGetAllPatientQuery,
} from "@/redux/features/patient/patientApi";
import Link from "next/link";
import React from "react";

const Patients = () => {
  
  const { data, isLoading, error } = useGetAllPatientQuery();

  const patients = data?.data?.result ?? [];

  if (isLoading) return <Loader></Loader>;
  if (error) return <p>Failed to load patients.</p>;
  if (patients.length === 0) return <p>No patients found.</p>;

  return (
    <div>
      <h3 className="text-3xl text-center ">Registered Patients</h3>
      <Table className="mx-auto w-11/12 mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Blood Group</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient: IPatient) => (
            <TableRow key={patient._id}>
              <TableCell className="font-medium">{patient.name}</TableCell>
              <TableCell>{patient.email}</TableCell>
              <TableCell>{patient.phone}</TableCell>
              <TableCell>{patient.bloodGroup}</TableCell>
              <TableCell>{patient.gender}</TableCell>
              <TableCell>
                <Link href={`/receptionist/patients/${patient._id}`}>
                  <Button>Detail</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Paginate></Paginate>
    </div>
  );
};

export default Patients;
