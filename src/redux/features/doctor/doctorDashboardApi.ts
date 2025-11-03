import { baseApi } from "@/redux/api/baseApi";

export type AppointmentStatus = "scheduled" | "completed" | "cancelled";

export interface DoctorAppointmentPatient {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface DoctorAppointmentPrescriptionSummary {
  _id: string;
  diagnosis?: string;
  followUpDate?: string;
  createdAt?: string;
}

export interface DoctorAppointment {
  _id: string;
  appointmentDate: string;
  appointmentTime: string;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  patient: DoctorAppointmentPatient;
  prescription?: DoctorAppointmentPrescriptionSummary | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface DoctorAppointmentStats {
  total: number;
  scheduled: number;
  completed: number;
  cancelled: number;
}

export interface DoctorAppointmentsResponse {
  data: {
    upcoming: DoctorAppointment[];
    history: DoctorAppointment[];
    stats: DoctorAppointmentStats;
    nextAppointment: DoctorAppointment | null;
  };
  message: string;
  success: boolean;
}

export const doctorDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDoctorAppointments: builder.query<DoctorAppointmentsResponse, void>({
      query: () => ({
        url: "/appointments/doctor/overview",
      }),
      providesTags: ["appointments"],
    }),
    completeAppointment: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (appointmentId) => ({
        url: `/appointments/${appointmentId}/complete`,
        method: "PATCH",
      }),
      invalidatesTags: ["appointments"],
    }),
  }),
});

export const {
  useGetDoctorAppointmentsQuery,
  useCompleteAppointmentMutation,
} = doctorDashboardApi;
