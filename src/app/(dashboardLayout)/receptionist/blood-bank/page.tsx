"use client";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllAvailableQuantityQuery } from "@/redux/features/bloodBank/bloodBankApi";
import Link from "next/link";
import React from "react";

const BloodBank = () => {
  const { data, isLoading, error } = useGetAllAvailableQuantityQuery({});
  // console.log(data,"full data")
  const bloodData = data?.data?.result;
  console.log(bloodData,'data')

  const handleDonate = (bloodGroup)=>{
    
    console.log(bloodGroup,'click')
  }

  if (isLoading) return <Loader />;
  if (error)
    return (
      <p className="text-red-500 text-center">
        Failed to load blood stock data.
      </p>
    );

  return (
    <div className="p-4">
      <h3 className="text-3xl text-center font-semibold mb-6">Blood Bank</h3>

      <Table className="mx-auto w-11/12 mt-4 border rounded">
        <TableHeader>
          <TableRow>
            <TableHead>Blood Group</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Donate To Patient</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bloodData &&
            Object.entries(bloodData).map(([group, quantity]) => (
              <TableRow key={group}>
                <TableCell className="font-medium">{group}</TableCell>
                <TableCell>{quantity}</TableCell>
                <TableCell>
                  <Link href={`/receptionist/blood-bank/${group}`}>
                  <Button onClick={()=>handleDonate(group)}>Donate</Button>

                  </Link>
                </TableCell>

              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BloodBank;
