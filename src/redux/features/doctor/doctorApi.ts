import { baseApi } from "@/redux/api/baseApi";

export interface IDoctor {
  _id: string;
  name: string;
  email: string;
  image:string,
  phone: string;
  department: string;
  specialization: string;
  education: string[]; // e.g., ["MBBS - Dhaka Medical College", "FCPS - BIRDEM"]
  availability: {
    days: string[]; // e.g., ["Sunday", "Tuesday", "Thursday"]
    from: string; // e.g., "09:00 AM"
    to: string; // e.g., "05:00 PM"
  };
  experience?: string; // e.g., "5 years in Internal Medicine"
  bio?: string; // A short professional summary about the doctor
  createdAt?: string;
  updatedAt?: string;
}

interface IMeta {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
}

interface IGetAllDoctorResponse {
  data: {
    result: IDoctor[];
    meta: IMeta;
  };
  message: string;
  success: string;
}

const doctorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllDoctor: builder.query<IGetAllDoctorResponse, string | void>({
      query: (department = "") =>
        `/doctor/get-all-doctor?department=${department}`,
    }),
    getSingleDoctor: builder.query<IDoctor, string | void>({
      query: (_id) =>
        `/doctor/get-doctor/${_id}`,
    }),
  }),
});

export const { useGetAllDoctorQuery , useGetSingleDoctorQuery} = doctorApi;
