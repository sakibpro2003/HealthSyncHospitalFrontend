import { baseApi } from "@/redux/api/baseApi";

const userAPi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: () => `/user/get-all-users`,
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
  }),
});

export const {
  useGetAllUserQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
  useUpdateUserRoleMutation
} = userAPi;
