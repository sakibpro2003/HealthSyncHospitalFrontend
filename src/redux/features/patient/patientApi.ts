import { baseApi } from "@/redux/api/baseApi";

export interface IEmergencyContact {
  emergencyContactName: string;
  relationship: string;
  emergencyContactPhone: string;
}
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
}

interface GetAllPatientResponse {
  data: {
    result: IPatient[];
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
    getAllPatient: builder.query<GetAllPatientResponse, void>({
      query: () => "/patient/all-patient",
    }),
    getSinglePatient: builder.query<GetSinglePatientResponse, string>({
      query: (_id) => `/patient/single-patient/${_id}`,
    }),
  }),
});

export const { useGetAllPatientQuery,useGetSinglePatientQuery } = patientApi;
