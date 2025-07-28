import { baseApi } from "@/redux/api/baseApi";

const healthPackageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllhealthPackage: builder.query({
      query: () => "/health-package/package",
    }),
  }),
});

export const { useGetAllhealthPackageQuery } = healthPackageApi;
