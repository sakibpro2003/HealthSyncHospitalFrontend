import { baseApi } from "@/redux/api/baseApi";

const userAPi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: ({ page = 1, limit = 10, searchTerm }: { page?: number; limit?: number; searchTerm?: string }) => {
        const params: Record<string, string | number> = { page, limit };
        if (searchTerm) params.searchTerm = searchTerm;
        return {
          url: `/user/get-all-users`,
          params,
        };
      },
      transformResponse: (response: { data?: any; meta?: any }) => ({
        data: Array.isArray(response?.data) ? response.data : [],
        meta: response?.meta ?? { page: 1, limit: 10, total: 0, totalPage: 1 },
      }),
    }),

    blockUser: builder.mutation({
      query: (userId) => ({
        url: `/user/block/${userId}`,
        method: "PUT",
      }),
    }),
    unblockUser: builder.mutation({
      query: (userId) => ({
        url: `/user/unblock/${userId}`,
        method: "PUT",
      }),
    }),
    updateUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/user/update-role/${userId}`,
        method: "PUT",
        body: { role },
      }),
    }),
    getRoleMetrics: builder.query({
      query: () => ({
        url: `/user/role-metrics`,
      }),
      transformResponse: (response: { data?: any }) => response?.data,
    }),
  }),
});

export const {
  useGetAllUserQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
  useUpdateUserRoleMutation,
  useGetRoleMetricsQuery
} = userAPi;
