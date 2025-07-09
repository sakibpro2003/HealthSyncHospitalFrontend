"use client";
import Loader from "@/components/shared/Loader";
import Paginate from "@/components/shared/Paginate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
// import { register } from "module";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

const Patients = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const { register, watch } = useForm();
  const searchTerm = watch("search","");
  const { data, isLoading, error } = useGetAllPatientQuery({ page , searchTerm});
  const patients = data?.data?.result?.result || [];
  const meta = data?.data?.result?.meta;
  const totalPage = Number(meta?.totalPage);


  if (isLoading) return <Loader></Loader>;
  if (error) return <p>Failed to load patients.</p>;
  if (patients.length === 0) return <p>No patients found.</p>;

  return (
    <div>
      <h3 className="text-3xl text-center ">Registered Patients</h3>

      <div className="w-1/3 mx-auto mt-10">
        <Input
          {...register("search")}
          name="search"
          type="text"
          placeholder="Search by name or email"
        />
      </div>
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
      <Paginate totalPage={totalPage}></Paginate>
    </div>
  );
};

export default Patients;
