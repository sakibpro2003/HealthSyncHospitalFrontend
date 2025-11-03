import { baseApi } from "@/redux/api/baseApi";

export type BloodInventoryHistoryEntry = {
  _id: string;
  change: number;
  balanceAfter: number;
  type: "restock" | "donation" | "request-fulfillment" | "adjustment";
  note?: string;
  actorName?: string;
  actorRole?: string;
  createdAt?: string;
};

export type BloodInventory = {
  _id: string;
  bloodGroup: string;
  unitsAvailable: number;
  minimumThreshold?: number;
  notes?: string;
  lastRestockedAt?: string;
  history?: BloodInventoryHistoryEntry[];
  createdAt?: string;
  updatedAt?: string;
};

export type BloodRequest = {
  _id: string;
  bloodGroup: string;
  unitsRequested: number;
  status: "pending" | "approved" | "rejected" | "fulfilled" | "cancelled";
  priority: "low" | "medium" | "high" | "critical";
  reason?: string;
  neededOn?: string;
  requesterName: string;
  requesterEmail?: string;
  requesterPhone?: string;
  patientId?: string;
  processedBy?: string;
  processedAt?: string;
  fulfilledAt?: string;
  notes?: string;
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;
};

type BloodRequestQuery = Partial<{
  status: string;
  bloodGroup: string;
  priority: string;
  requesterEmail: string;
  requesterPhone: string;
  neededOn: string;
}>;

const bloodBankApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInventorySummary: builder.query<Record<string, number>, void>({
      query: () => ({
        url: "/blood-bank/get-quantity",
        method: "GET",
      }),
      transformResponse: (response: { data?: { result?: Record<string, number> } }) =>
        response?.data?.result ?? {},
      providesTags: ["bloodInventory"],
    }),
    getBloodInventories: builder.query<BloodInventory[], void>({
      query: () => ({
        url: "/blood-bank/inventories",
      }),
      transformResponse: (response: { data?: { result?: BloodInventory[] } }) =>
        response?.data?.result ?? [],
      providesTags: ["bloodInventory"],
    }),
    createBloodInventory: builder.mutation<BloodInventory, Partial<BloodInventory>>({
      query: (body) => ({
        url: "/blood-bank/inventories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["bloodInventory"],
    }),
    updateBloodInventory: builder.mutation<
      BloodInventory,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/blood-bank/inventories/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["bloodInventory"],
    }),
    adjustBloodInventory: builder.mutation<BloodInventory, Record<string, unknown>>({
      query: (data) => ({
        url: "/blood-bank/adjust",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["bloodInventory"],
    }),
    recordBloodDonation: builder.mutation<BloodInventory, Record<string, unknown>>({
      query: (data) => ({
        url: "/blood-bank/donate-blood",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["bloodInventory"],
    }),
    deleteBloodInventory: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/blood-bank/inventories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["bloodInventory"],
    }),
    getBloodInventoryHistory: builder.query<BloodInventory[], string | void>({
      query: (bloodGroup) => ({
        url: "/blood-bank/history",
        params: bloodGroup ? { bloodGroup } : undefined,
      }),
      transformResponse: (response: { data?: { result?: BloodInventory[] } }) =>
        response?.data?.result ?? [],
      providesTags: ["bloodInventory"],
    }),
    createBloodRequest: builder.mutation<BloodRequest, Record<string, unknown>>({
      query: (data) => ({
        url: "/blood-bank/requests",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["bloodRequests"],
    }),
    getBloodRequests: builder.query<BloodRequest[], BloodRequestQuery | void>({
      query: (params) => {
        const queryParams =
          params && typeof params === "object"
            ? (Object.fromEntries(
                Object.entries(params).filter(
                  ([, value]) => value !== undefined && value !== ""
                )
              ) as Record<string, string>)
            : undefined;
        return {
          url: "/blood-bank/requests",
          params: queryParams,
        };
      },
      transformResponse: (response: { data?: { result?: BloodRequest[] } }) =>
        response?.data?.result ?? [],
      providesTags: ["bloodRequests"],
    }),
    updateBloodRequestStatus: builder.mutation<
      BloodRequest,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/blood-bank/requests/${id}/status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["bloodRequests", "bloodInventory"],
    }),
  }),
});

export const {
  useGetInventorySummaryQuery,
  useGetBloodInventoriesQuery,
  useCreateBloodInventoryMutation,
  useUpdateBloodInventoryMutation,
  useAdjustBloodInventoryMutation,
  useRecordBloodDonationMutation,
  useDeleteBloodInventoryMutation,
  useGetBloodInventoryHistoryQuery,
  useCreateBloodRequestMutation,
  useGetBloodRequestsQuery,
  useUpdateBloodRequestStatusMutation,
} = bloodBankApi;
