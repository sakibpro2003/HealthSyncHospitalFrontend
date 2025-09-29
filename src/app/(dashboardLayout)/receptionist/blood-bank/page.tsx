"use client";

import Link from "next/link";
import { useGetBloodInventoriesQuery } from "@/redux/features/bloodBank/bloodBankApi";
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

const ReceptionistBloodBankPage = () => {
  const { data: inventories = [], isLoading, isError } =
    useGetBloodInventoriesQuery();

  return (
    <div className="space-y-8 p-6">
      <Card className="border border-slate-200/70 shadow-sm">
        <CardHeader>
          <CardTitle>Blood Inventory Snapshot</CardTitle>
          <p className="text-sm text-slate-500">
            Track available units for each blood group and coordinate with the
            admin before fulfilling patient requests.
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-slate-500">Loading inventory...</p>
          ) : isError ? (
            <p className="text-sm text-red-500">
              Unable to load blood inventory. Please refresh.
            </p>
          ) : inventories.length === 0 ? (
            <p className="text-sm text-slate-500">No inventory data available.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Units Available</TableHead>
                    <TableHead>Minimum Threshold</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Restock</TableHead>
                    <TableHead>History</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventories.map((inventory) => {
                    const isLow =
                      (inventory.minimumThreshold ?? 0) >= inventory.unitsAvailable;
                    return (
                      <TableRow key={inventory._id}>
                        <TableCell className="font-semibold text-slate-800">
                          {inventory.bloodGroup}
                        </TableCell>
                        <TableCell>{inventory.unitsAvailable}</TableCell>
                        <TableCell>{inventory.minimumThreshold ?? 0}</TableCell>
                        <TableCell>
                          <Badge variant={isLow ? "destructive" : "secondary"}>
                            {isLow ? "Low" : "Healthy"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {inventory.lastRestockedAt
                            ? new Date(inventory.lastRestockedAt).toLocaleString()
                            : "--"}
                        </TableCell>
                        <TableCell>
                          <Link
                            className="text-sm font-semibold text-violet-600 hover:underline"
                            href={`/receptionist/blood-bank/${inventory.bloodGroup}`}
                          >
                            View history
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReceptionistBloodBankPage;
