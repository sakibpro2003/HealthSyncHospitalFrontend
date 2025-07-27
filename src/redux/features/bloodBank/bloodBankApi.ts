import { baseApi } from "@/redux/api/baseApi";

const bloodBankApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAvailableQuantity: builder.query({
      query: () => ({
        url: "/blood-bank/get-quantity",
        method: "GET",
      }),
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
