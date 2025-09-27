import { baseApi } from "@/redux/api/baseApi";

const appointmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAppointment: builder.mutation({
      query: (appointmentInfo) => ({
        url: "/appointments",
        method: "POST",
        body: appointmentInfo,
      }),
      invalidatesTags: ["appointments"],
    }),
    getAppointmentsByPatient: builder.query({
      query: (patientId: string) => `/appointments/patient/${patientId}`,
      providesTags: ["appointments"],
    }),
  }),
});

export const {
  useCreateAppointmentMutation,
  useGetAppointmentsByPatientQuery,
} = appointmentApi;
