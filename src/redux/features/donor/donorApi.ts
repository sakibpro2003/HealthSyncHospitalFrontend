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
    updateDonor: builder.mutation({
      query: ({_id,donorPayload}) => ({
        url: `/donor/update-donor/${_id}`,
        method: "PUT",
        body: donorPayload,
      }),
    }),
  }),
});

export const {
  useRegisterDonorMutation,
  useViewDonorQuery,
  useGetSingleDonorQuery,useUpdateDonorMutation
} = donorApi;
