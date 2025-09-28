import { baseApi } from "@/redux/api/baseApi";

const bloodBankApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAvailableQuantity: builder.query<Record<string, number>, void>({
      query: () => ({
        url: "/blood-bank/get-quantity",
        method: "GET",
      }),
      transformResponse: (response: { data?: { result?: Record<string, number> } }) =>
        response?.data?.result ?? {},
    }),
    handleBloodDonateQuery: builder.mutation({
      query: () => ({
        url: "/blood-bank/donate-blood",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetAllAvailableQuantityQuery,
  useHandleBloodDonateQueryMutation,
} = bloodBankApi;
