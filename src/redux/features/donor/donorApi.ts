import { baseApi } from "@/redux/api/baseApi";

const donorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerDonor: builder.mutation({
      query: (donorPayload) => ({
        url: "/donor/register-donor",
        method: "POST",
        body: donorPayload,
      }),
    }),
    viewDonor: builder.query({
      query: () => ({
        url: "/donor/all-donor",
        method: "GET",
      }),
    }),
    getSingleDonor: builder.query({
      query: (_id) => ({
        url: `/donor/single-donor/${_id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useRegisterDonorMutation,
  useViewDonorQuery,
  useGetSingleDonorQuery,
} = donorApi;
