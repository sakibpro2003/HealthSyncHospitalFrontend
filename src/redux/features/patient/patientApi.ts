import { baseApi } from "@/redux/api/baseApi";

export interface IEmergencyContact {
  emergencyContactName: string;
  relationship: string;
  emergencyContactPhone: string;
}
type TMeta = {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};
export interface IPatient extends Document {
  _id: string;
  name: string;
  role: string;
  email?: string;
  phone: string;
  releaseStatus: boolean;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  address: string;
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  maritalStatus?: "single" | "married" | "divorced" | "widowed";
  emergencyContact?: IEmergencyContact;
  occupation?: string;
  medicalHistory?: string[];
  allergies?: string[];
  currentMedications?: string[];
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  meta: TMeta;
}

interface GetAllPatientResponse {
  data: {
    result: IPatient[];
    meta: TMeta;
  };
  message: string;
  success: boolean;
}
interface GetSinglePatientResponse {
  data: {
    result: IPatient;
  };
  message: string;
  success: boolean;
}

const patientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPatient: builder.query<
      GetAllPatientResponse,
      { page: number; searchTerm: string }
    >({
      query: ({ page = 1, searchTerm = "" }) =>
        `/patient/all-patient?page=${page}&searchTerm=${searchTerm}`,
      providesTags: (result) =>
        result?.data?.result
          ? [
              ...result.data.result.map((patient) => ({
                type: "patient" as const,
                id: patient._id,
              })),
              { type: "patient" as const, id: "LIST" },
            ]
          : [{ type: "patient" as const, id: "LIST" }],
    }),
    getSinglePatient: builder.query<GetSinglePatientResponse, string>({
      query: (_id) => `/patient/single-patient/${_id}`,
      providesTags: (_result, _error, id) => [{ type: "patient", id }],
    }),
    updatePatient: builder.mutation({
      query: ({
        id,
        updatePayload,
      }: {
        id: string;
        updatePayload: Partial<IPatient>;
      }) => ({
        url: `/patient/update-patient/${id}`,
        method: "PUT",
        body: updatePayload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "patient", id },
        { type: "patient", id: "LIST" },
      ],
    }),

    updateMedicalHistory: builder.mutation({
      query: ({
        id,
        payload,
      }: {
        id: string;
        payload: Partial<
          Pick<IPatient, "medicalHistory" | "allergies" | "currentMedications">
        > & { email?: string };
      }) => ({
        url: `/patient/medical-history/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "patient", id },
        { type: "patient", id: "LIST" },
      ],
    }),

    registerPatient: builder.mutation({
      query: (userInfo) => ({
        url: "/patient/register-patient",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: [{ type: "patient", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllPatientQuery,
  useGetSinglePatientQuery,
  useUpdatePatientMutation,
  useUpdateMedicalHistoryMutation,
  useRegisterPatientMutation,
} = patientApi;
