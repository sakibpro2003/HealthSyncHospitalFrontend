import { baseApi } from "@/redux/api/baseApi";

const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptions: builder.query({
      query: (patientId) => `/subscription/${patientId}`,
      providesTags:["subscription"]
    }),
    

    createSubscription: builder.mutation({
      query: ({ subscriptionInfo }) => ({
        url: "/subscription",
        method: "POST",
        body: subscriptionInfo,
      }),
    }),
    cancelSubscription: builder.mutation({
      query: (packageId) => ({
        url: `/subscription/cancel/${packageId}`,
        method: "PUT",
      }),
      invalidatesTags:["subscription"]
    }),
  }),
});

export const {
  useCreateSubscriptionMutation,
  useGetSubscriptionsQuery,
  useCancelSubscriptionMutation,
} = subscriptionApi;
