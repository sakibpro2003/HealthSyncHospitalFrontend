"use client";

import { format } from "date-fns";
import { useGetAdminDashboardInsightsQuery } from "@/redux/features/admin/adminDashboardApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loader from "@/components/shared/Loader";

const formatCurrency = (value: number | undefined) =>
  typeof value === "number" ? `৳${value.toFixed(2)}` : "৳0.00";

const AdminDashboardPage = () => {
  const { data, isLoading, isError } = useGetAdminDashboardInsightsQuery();

  if (isLoading) {
    return (
      <div className="p-6">
        <Loader />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6">
        <p className="text-center text-red-500">
          Unable to load dashboard insights right now.
        </p>
      </div>
    );
  }

  const sales = data.sales.breakdown;
  const recentProducts = sales.product?.recent ?? [];
  const recentPackages = sales.package?.recent ?? [];
  const recentAppointments = sales.appointment?.recent ?? [];

  const donationTotals = data.bloodDonation.totalsByGroup ?? [];
  const recentDonations = data.bloodDonation.recentDonations ?? [];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard Overview</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Medicine Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(sales.product?.totalAmount)}
            </p>
            <p className="text-sm text-gray-500">
              Items sold: {sales.product?.totalItems ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">
              Health Package Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(sales.package?.totalAmount)}
            </p>
            <p className="text-sm text-gray-500">
              Packages sold: {sales.package?.totalItems ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">
              Doctor Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(sales.appointment?.totalAmount)}
            </p>
            <p className="text-sm text-gray-500">
              Visits booked: {sales.appointment?.totalItems ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Medicine Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentProducts.length === 0 ? (
              <p className="text-sm text-gray-500">No recent medicine sales.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentProducts.map((item) => (
                    <TableRow key={`product-${item.paymentId}-${item.title}`}>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{formatCurrency(item.amount)}</TableCell>
                      <TableCell>
                        {format(new Date(item.createdAt), "dd MMM yyyy")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Health Package Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentPackages.length === 0 ? (
              <p className="text-sm text-gray-500">No recent package sales.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Package</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPackages.map((item) => (
                    <TableRow key={`package-${item.paymentId}-${item.title}`}>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{formatCurrency(item.amount)}</TableCell>
                      <TableCell>
                        {format(new Date(item.createdAt), "dd MMM yyyy")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Doctor Appointments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAppointments.length === 0 ? (
              <p className="text-sm text-gray-500">No recent appointment payments.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor/Service</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAppointments.map((item) => (
                    <TableRow key={`appointment-${item.paymentId}-${item.title}`}>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{formatCurrency(item.amount)}</TableCell>
                      <TableCell>
                        {format(new Date(item.createdAt), "dd MMM yyyy")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Appointments by Doctor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.sales.appointmentByDoctor.length === 0 ? (
              <p className="text-sm text-gray-500">No appointment data.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Visits</TableHead>
                    <TableHead>Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.sales.appointmentByDoctor.map((row) => (
                    <TableRow key={row.doctorId.toString()}>
                      <TableCell>{row.doctorName}</TableCell>
                      <TableCell>{row.department ?? "-"}</TableCell>
                      <TableCell>{row.totalAppointments}</TableCell>
                      <TableCell>{formatCurrency(row.totalAmount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Blood Donation Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Blood Group</TableHead>
                <TableHead>Total Units</TableHead>
                <TableHead>Donors</TableHead>
                <TableHead>Last Donation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donationTotals.map((group) => (
                <TableRow key={group.bloodGroup}>
                  <TableCell className="font-medium">{group.bloodGroup}</TableCell>
                  <TableCell>{group.totalQuantity}</TableCell>
                  <TableCell>{group.donors}</TableCell>
                  <TableCell>
                    {group.lastDonation
                      ? format(new Date(group.lastDonation), "dd MMM yyyy")
                      : "--"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div>
            <h2 className="text-md font-semibold mb-2">Recent Donations</h2>
            {recentDonations.length === 0 ? (
              <p className="text-sm text-gray-500">No donation records.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Last Donation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentDonations.map((donation) => (
                    <TableRow key={donation._id}>
                      <TableCell>{donation.name}</TableCell>
                      <TableCell>{donation.bloodGroup}</TableCell>
                      <TableCell>{donation.quantity}</TableCell>
                      <TableCell>
                        {donation.lastDonationDate
                          ? format(new Date(donation.lastDonationDate), "dd MMM yyyy")
                          : "--"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
