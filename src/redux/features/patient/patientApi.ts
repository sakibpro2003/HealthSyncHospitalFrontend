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
export interface IPatient {
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
      GetAllPatientResponse["data"] | undefined,
      {
        page?: number;
        limit?: number;
        searchTerm?: string;
        gender?: string;
        bloodGroup?: string;
      }
    >({
      query: ({ page = 1, limit = 10, searchTerm = "", gender, bloodGroup }) => {
        const params: Record<string, string | number> = { page, limit };
        if (searchTerm) params.searchTerm = searchTerm;
        if (gender) params.gender = gender;
        if (bloodGroup) params.bloodGroup = bloodGroup;
        return {
          url: `/patient/all-patient`,
          params,
        };
      },
      transformResponse: (response: GetAllPatientResponse) => {
        const fallbackMeta = {
          page: 1,
          limit: 0,
          total: 0,
          totalPage: 0,
        };

        const payload = response?.data?.result as
          | IPatient[]
          | { result?: IPatient[]; meta?: TMeta }
          | undefined;

        if (Array.isArray(payload)) {
          return { result: payload, meta: response?.meta ?? fallbackMeta };
        }

        if (payload && Array.isArray(payload.result)) {
          return {
            result: payload.result,
            meta: response?.meta ?? payload.meta ?? fallbackMeta,
          };
        }

        return { result: [], meta: response?.meta ?? fallbackMeta };
      },
      providesTags: (result) =>
        result?.result?.length
          ? [
              ...result.result.map((patient) => ({
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
