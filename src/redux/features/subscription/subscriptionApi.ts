import { baseApi } from "@/redux/api/baseApi";

const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptions: builder.query({
      query: (patientId) => `/subscription/${patientId}`,
    }),
    // getSinglePatient: builder.query<GetSinglePatientResponse, string>({
    //   query: (_id) => `/patient/single-patient/${_id}`,
    // }),
    // updatePatient: builder.mutation({
    //   query: ({
    //     id,
    //     updatePayload,
    //   }: {
    //     id: string;
    //     updatePayload: Partial<IPatient>;
    //   }) => ({
    //     url: `/patient/update-patient/${id}`,
    //     method: "PUT",
    //     body: updatePayload,
    //   }),
    // }),

    createSubscription: builder.mutation({
      query: ({ subscriptionInfo }) => ({
        url: "/subscription",
        method: "POST",
        body: subscriptionInfo,
      }),
    }),
  }),
});

export const { useCreateSubscriptionMutation,useGetSubscriptionsQuery } = subscriptionApi;
