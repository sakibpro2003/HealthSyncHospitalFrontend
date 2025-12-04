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
    createAppointmentByStaff: builder.mutation({
      query: (appointmentInfo) => ({
        url: "/appointments/book",
        method: "POST",
        body: appointmentInfo,
      }),
      invalidatesTags: ["appointments"],
    }),
    getAppointmentsByDoctorId: builder.query({
      query: (doctorId: string) => `/appointments/doctor/${doctorId}`,
      providesTags: ["appointments"],
    }),
    getAppointmentsByPatient: builder.query({
      query: (patientId: string) => `/appointments/patient/${patientId}`,
      providesTags: ["appointments"],
    }),
    cancelAppointment: builder.mutation({
      query: ({ appointmentId, patientId }: { appointmentId: string; patientId?: string }) => ({
        url: `/appointments/${appointmentId}/cancel`,
        method: "PATCH",
        body: { patientId },
      }),
      invalidatesTags: ["appointments"],
    }),
    rescheduleAppointment: builder.mutation({
      query: ({
        appointmentId,
        patientId,
        appointmentDate,
        appointmentTime,
        reason,
      }: {
        appointmentId: string;
        patientId?: string;
        appointmentDate: string;
        appointmentTime: string;
        reason?: string;
      }) => ({
        url: `/appointments/${appointmentId}/reschedule`,
        method: "PATCH",
        body: { patientId, appointmentDate, appointmentTime, reason },
      }),
      invalidatesTags: ["appointments"],
    }),
  }),
});

export const {
  useCreateAppointmentCheckoutMutation,
  useCreateAppointmentByStaffMutation,
  useGetAppointmentsByDoctorIdQuery,
  useGetAppointmentsByPatientQuery,
  useCancelAppointmentMutation,
  useRescheduleAppointmentMutation,
} = appointmentApi;
