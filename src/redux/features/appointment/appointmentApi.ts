import { baseApi } from "@/redux/api/baseApi";

const appointmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAppointmentCheckout: builder.mutation({
      query: (appointmentInfo) => ({
        url: "/appointments/checkout",
        method: "POST",
        body: appointmentInfo,
      }),
    }),
    getAppointmentsByPatient: builder.query({
      query: (patientId: string) => `/appointments/patient/${patientId}`,
      providesTags: ["appointments"],
    }),
  }),
});

export const {
  useCreateAppointmentCheckoutMutation,
  useGetAppointmentsByPatientQuery,
} = appointmentApi;
