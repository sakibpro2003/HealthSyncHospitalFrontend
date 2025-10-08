"use client";

import Link from "next/link";
import { useViewDonorQuery } from "@/redux/features/donor/donorApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const ReceptionistDonorListPage = () => {
  const { data, isLoading, isError } = useViewDonorQuery(undefined);
  const donors = data?.data?.result ?? data?.data ?? [];

  return (
    <div className="space-y-8 p-6">
      <Card className="border border-slate-200/70 shadow-sm">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Registered donors</CardTitle>
            <p className="text-sm text-slate-500">
              Review donor contact details before scheduling an urgent donation.
            </p>
          </div>
          <Link
            href="/receptionist/register-donor"
            className="text-sm font-semibold text-violet-600 hover:underline"
          >
            Register new donor
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-slate-500">Loading donors...</p>
          ) : isError ? (
            <p className="text-sm text-red-500">
              Unable to load donor list. Please refresh later.
            </p>
          ) : donors.length === 0 ? (
            <p className="text-sm text-slate-500">No donors registered yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Blood group</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Last donation</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Profile</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donors.map((donor: any) => (
                    <TableRow key={donor._id}>
                      <TableCell className="font-semibold text-slate-800">
                        {donor.name}
                      </TableCell>
                      <TableCell>{donor.bloodGroup}</TableCell>
                      <TableCell>{donor.quantity} units</TableCell>
                      <TableCell>
                        {donor.lastDonationDate
                          ? new Date(donor.lastDonationDate).toLocaleDateString()
                          : "--"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-xs text-slate-500">
                          <span>{donor.phone}</span>
                          <span>{donor.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={donor.available ? "secondary" : "outline"}>
                          {donor.available ? "Available" : "Unavailable"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link
                          className="text-sm font-semibold text-violet-600 hover:underline"
                          href={`/receptionist/donors/${donor._id}`}
                        >
                          View
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReceptionistDonorListPage;
