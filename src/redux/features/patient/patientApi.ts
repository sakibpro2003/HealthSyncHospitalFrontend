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
    getAllPatient: builder.query<GetAllPatientResponse, { page: number }>({
      query: ({ page = 1 }) => `/patient/all-patient?page=${page}`,
    }),
    getSinglePatient: builder.query<GetSinglePatientResponse, string>({
      query: (_id) => `/patient/single-patient/${_id}`,
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
    }),
  }),
});

export const {
  useGetAllPatientQuery,
  useGetSinglePatientQuery,
  useUpdatePatientMutation,
} = patientApi;
