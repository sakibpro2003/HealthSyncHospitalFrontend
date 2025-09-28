import { baseApi } from "@/redux/api/baseApi";

export type PaymentItem = {
  title: string;
  quantity: number;
  price: number;
  type: "product" | "package" | "appointment";
  appointmentDate?: string;
  appointmentTime?: string;
  reason?: string;
};

export type PaymentRecord = {
  _id: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed";
  paidAt?: string;
  createdAt?: string;
  stripePaymentIntentId?: string;
  items: PaymentItem[];
};

export type PaymentSummary = {
  totalTransactions: number;
  paidCount: number;
  paidAmount: number;
  pendingCount: number;
  pendingAmount: number;
  failedCount: number;
  failedAmount: number;
};

export type PaymentsResponse = {
  summary: PaymentSummary;
  payments: PaymentRecord[];
};

const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentsByUser: builder.query<
      PaymentsResponse | undefined,
      { userId: string; params?: Record<string, string | number | undefined> }
    >({
      query: ({ userId, params }) => ({
        url: `/payment/user/${userId}`,
        params,
      }),
      transformResponse: (response: { data?: PaymentsResponse }) =>
        response?.data,
      providesTags: (result) => {
        if (!result) {
          return [{ type: "payments" as const, id: "LIST" }];
        }
        return [
          ...result.payments.map((payment) => ({
            type: "payments" as const,
            id: payment._id,
          })),
          { type: "payments" as const, id: "LIST" },
        ];
      },
    }),
    downloadReceipt: builder.mutation<Blob, string>({
      query: (paymentId) => ({
        url: `/payment/${paymentId}/receipt`,
        method: "GET",
        responseHandler: async (response) => await response.blob(),
      }),
      invalidatesTags: (_result, _error, paymentId) => [
        { type: "payments", id: paymentId },
      ],
    }),
  }),
});

export const { useGetPaymentsByUserQuery, useDownloadReceiptMutation } =
  paymentApi;
