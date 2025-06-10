import { baseApi } from "@/redux/api/baseApi";

const patientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPatient: builder.mutation({
      query: () => ({
        url: "/patient/all-patient",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllPatientMutation } = patientApi;
