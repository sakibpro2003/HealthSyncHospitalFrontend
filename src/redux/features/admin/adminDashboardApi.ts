import { baseApi } from "@/redux/api/baseApi";

type SalesBreakdown = {
  breakdown: Record<
    string,
    {
      totalAmount?: number;
      totalItems?: number;
      recent?: Array<{
        paymentId: string;
        title: string;
        amount: number;
        quantity: number;
        createdAt: string;
      }>;
    }
  >;
  appointmentByDoctor: Array<{
    doctorId: string;
    doctorName: string;
    department?: string;
    totalAppointments: number;
    totalAmount: number;
  }>;
};

type BloodDonationInsights = {
  totalsByGroup: Array<{
    bloodGroup: string;
    totalQuantity: number;
    donors: number;
    lastDonation?: string;
  }>;
  recentDonations: Array<{
    _id: string;
    name: string;
    bloodGroup: string;
    quantity: number;
    lastDonationDate?: string;
    createdAt: string;
  }>;
};

type AdminDashboardResponse = {
  sales: SalesBreakdown;
  bloodDonation: BloodDonationInsights;
};

const adminDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboardInsights: builder.query<AdminDashboardResponse, void>({
      query: () => ({
        url: "/admin-dashboard/insights",
      }),
      transformResponse: (response: { data?: AdminDashboardResponse }) =>
        response.data as AdminDashboardResponse,
      providesTags: ["payments"],
    }),
  }),
});

export const { useGetAdminDashboardInsightsQuery } = adminDashboardApi;
