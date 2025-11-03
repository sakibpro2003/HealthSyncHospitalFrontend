import { baseApi } from "@/redux/api/baseApi";

export interface IPrescription {
  _id: string;
  doctor: {
    _id: string;
    name: string;
    email?: string;
  };
  patient: {
    _id: string;
    name: string;
    email?: string;
  };
  appointment: {
    _id: string;
    appointmentDate: string;
    appointmentTime: string;
    status: string;
  };
  diagnosis?: string;
  complaints?: string;
  medications?: string[];
  advice?: string;
  followUpDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface PrescriptionResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

interface CreatePrescriptionPayload {
  appointment: string;
  diagnosis?: string;
  complaints?: string;
  medications?: string[];
  advice?: string;
  followUpDate?: string;
  notes?: string;
}

export const prescriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPrescription: builder.mutation<
      PrescriptionResponse<IPrescription>,
      CreatePrescriptionPayload
    >({
      query: (body) => ({
        url: "/prescriptions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["prescriptions", "appointments"],
    }),
    getDoctorPrescriptions: builder.query<
      PrescriptionResponse<IPrescription[]>,
      void
    >({
      query: () => "/prescriptions/doctor",
      providesTags: ["prescriptions"],
    }),
    getPatientPrescriptions: builder.query<
      PrescriptionResponse<IPrescription[]>,
      string
    >({
      query: (patientId) => `/prescriptions/patient/${patientId}`,
      providesTags: ["prescriptions"],
    }),
  }),
});

export const {
  useCreatePrescriptionMutation,
  useGetDoctorPrescriptionsQuery,
  useGetPatientPrescriptionsQuery,
} = prescriptionApi;
