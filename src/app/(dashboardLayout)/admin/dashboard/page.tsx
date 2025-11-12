"use client";

import { useMemo, useId } from "react";
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

const CURRENCY_SYMBOL = "BDT ";



const formatCurrency = (value: number | undefined) =>

  typeof value === "number"

    ? `${CURRENCY_SYMBOL}${value.toFixed(2)}`

    : `${CURRENCY_SYMBOL}0.00`;



const buildSparklineShape = (

  values: number[],

  width = 220,

  height = 80

): { linePath: string; areaPath: string } => {

  const safeValues = values.filter((value) => Number.isFinite(value));



  if (!safeValues.length) {

    const baseY = height - 10;

    return {

      linePath: `M0,${baseY} L${width},${baseY}`,

      areaPath: `M0,${baseY} L${width},${baseY} L${width},${height} L0,${height} Z`,

    };

  }



  const min = Math.min(...safeValues);

  const max = Math.max(...safeValues);

  const range = max - min || 1;

  const step = safeValues.length === 1 ? width : width / (safeValues.length - 1);

  const topPadding = 6;

  const verticalSpace = height - topPadding * 2;



  const points = safeValues.map((value, index) => {

    const x = index * step;

    const normalised = (value - min) / range;

    const y = height - topPadding - normalised * verticalSpace;

    return { x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) };

  });



  const linePath = [

    `M${points[0].x},${points[0].y}`,

    ...points.slice(1).map((point) => `L${point.x},${point.y}`),

  ].join(" " );



  const areaPath = [

    `M${points[0].x},${points[0].y}`,

    ...points.slice(1).map((point) => `L${point.x},${point.y}`),

    `L${width},${height}`,

    `L0,${height}`,

    "Z",

  ].join(" " );



  return {

    linePath,

    areaPath,

  };

};



type SparklineDescriptor = {

  key: string;

  title: string;

  total: number;

  countLabel: string;

  values: number[];

  accent: {

    chipBg: string;

    chipText: string;

    gradientFrom: string;

    gradientTo: string;

  };

};

const AdminDashboardPage = () => {
  const { data, isLoading, isError } = useGetAdminDashboardInsightsQuery();
  const revenueCards = useMemo<SparklineDescriptor[]>(() => {
    if (!data) {
      return [];
    }

    const sales = data.sales.breakdown;
    const toValues = (items?: { amount: number }[]) =>
      (items ?? []).map((item) => Math.max(item.amount, 0));

    return [
      {
        key: "product",
        title: "Medicine revenue",
        total: sales.product?.totalAmount ?? 0,
        countLabel: `${sales.product?.totalItems ?? 0} unit(s) sold`,
        values: toValues(sales.product?.recent),
        accent: {
          chipBg: "bg-emerald-50",
          chipText: "text-emerald-700",
          gradientFrom: "#34d399",
          gradientTo: "#059669",
        },
      },
      {
        key: "package",
        title: "Health package revenue",
        total: sales.package?.totalAmount ?? 0,
        countLabel: `${sales.package?.totalItems ?? 0} package(s) sold`,
        values: toValues(sales.package?.recent),
        accent: {
          chipBg: "bg-sky-50",
          chipText: "text-sky-700",
          gradientFrom: "#38bdf8",
          gradientTo: "#0ea5e9",
        },
      },
      {
        key: "appointment",
        title: "Appointment revenue",
        total: sales.appointment?.totalAmount ?? 0,
        countLabel: `${sales.appointment?.totalItems ?? 0} visit(s) booked`,
        values: toValues(sales.appointment?.recent),
        accent: {
          chipBg: "bg-violet-50",
          chipText: "text-violet-700",
          gradientFrom: "#a855f7",
          gradientTo: "#7c3aed",
        },
      },
    ];
  }, [data]);

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

      <section className="grid gap-4 lg:grid-cols-3">
        {revenueCards.map(({ key, ...sparklineProps }) => (
          <SparklineCard key={key} {...sparklineProps} />
        ))}
      </section>

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

const SparklineCard = ({
  title,
  total,
  countLabel,
  values,
  accent,
}: SparklineDescriptor) => {
  const gradientId = useId();
  const { linePath, areaPath } = buildSparklineShape(values);
  const activityLabel = values.length
    ? `${values.length} recent payment${values.length > 1 ? "s" : ""}`
    : "Awaiting activity";

  return (
    <Card className="border border-slate-100 bg-white/90 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-slate-500">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-3xl font-bold text-slate-900">
            {formatCurrency(total)}
          </p>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            {countLabel}
          </p>
        </div>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${accent.chipBg} ${accent.chipText}`}
        >
          {activityLabel}
        </span>
        <svg
          viewBox="0 0 220 80"
          role="img"
          aria-hidden="true"
          className="w-full"
        >
          <defs>
            <linearGradient
              id={gradientId}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={accent.gradientFrom} stopOpacity="0.45" />
              <stop offset="100%" stopColor={accent.gradientTo} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#${gradientId})`} />
          <path
            d={linePath}
            fill="none"
            stroke={accent.gradientFrom}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        </svg>
      </CardContent>
    </Card>
  );
};

export default AdminDashboardPage;
