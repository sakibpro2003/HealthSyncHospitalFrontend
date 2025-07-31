import { baseApi } from "@/redux/api/baseApi";

const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // getAllPatient: builder.query<
    //   GetAllPatientResponse,
    //   { page: number; searchTerm: string }
    // >({
    //   query: ({ page = 1, searchTerm = "" }) =>
    //     `/patient/all-patient?page=${page}&searchTerm=${searchTerm}`,
    // }),
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

export const { useCreateSubscriptionMutation } = subscriptionApi;
