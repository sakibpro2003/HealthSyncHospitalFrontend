"use client";
import Loader from "@/components/shared/Loader";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IPatient, useGetAllPatientQuery } from "@/redux/features/patient/patientApi";
import React from "react";

const Patients = () => {
  const { data, isLoading, error } = useGetAllPatientQuery();


  const patients = data?.data?.result ?? [];

  if (isLoading) return <Loader></Loader>;
  if (error) return <p>Failed to load patients.</p>;
  if (patients.length === 0) return <p>No patients found.</p>;

  return (
    <Table>
      <TableCaption>View All Registered Patients</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Gender</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient: IPatient) => (
          <TableRow key={patient._id}>
            <TableCell className="font-medium">{patient.name}</TableCell>
            <TableCell>{patient.email}</TableCell>
            <TableCell>{patient.phone}</TableCell>
            <TableCell>{patient.gender}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Patients;
