import { baseApi } from "@/redux/api/baseApi";

export type UserRole = "user" | "receptionist" | "admin" | "doctor" | "patient";

export type UserSummary = {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  gender?: string;
  bloodGroup?: string;
  role: UserRole | string;
  isBlocked?: boolean;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type PaginatedUsersResponse = {
  data: UserSummary[];
  meta: PaginationMeta;
};

export type RoleMetricsSummary = {
  summary: Record<
    string,
    {
      active: number;
      blocked: number;
    }
  >;
};

type GetUsersQueryArguments = {
  page?: number;
  limit?: number;
  searchTerm?: string;
};

const defaultMeta: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPage: 1,
};

const normaliseUser = (candidate: unknown): UserSummary | null => {
  if (typeof candidate !== "object" || candidate === null) {
    return null;
  }

  const record = candidate as Record<string, unknown>;
  const id = typeof record._id === "string" ? record._id : null;
  const name = typeof record.name === "string" ? record.name : null;

  if (!id || !name) {
    return null;
  }

  return {
    _id: id,
    name,
    email: typeof record.email === "string" ? record.email : undefined,
    phone: typeof record.phone === "string" ? record.phone : undefined,
    gender: typeof record.gender === "string" ? record.gender : undefined,
    bloodGroup:
      typeof record.bloodGroup === "string" ? record.bloodGroup : undefined,
    role:
      typeof record.role === "string" ? record.role : ("user" satisfies UserRole),
    isBlocked:
      typeof record.isBlocked === "boolean" ? record.isBlocked : undefined,
  };
};

const normaliseUsers = (payload: unknown): UserSummary[] => {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .map((item) => normaliseUser(item))
    .filter((item): item is UserSummary => Boolean(item));
};

const normaliseMeta = (meta: unknown): PaginationMeta => {
  if (typeof meta !== "object" || meta === null) {
    return defaultMeta;
  }

  const record = meta as Record<string, unknown>;
  return {
    page: typeof record.page === "number" ? record.page : defaultMeta.page,
    limit: typeof record.limit === "number" ? record.limit : defaultMeta.limit,
    total: typeof record.total === "number" ? record.total : defaultMeta.total,
    totalPage:
      typeof record.totalPage === "number"
        ? record.totalPage
        : defaultMeta.totalPage,
  };
};

const normaliseRoleMetrics = (payload: unknown): RoleMetricsSummary | null => {
  if (typeof payload !== "object" || payload === null) {
    return null;
  }

  const record = payload as Record<string, unknown>;
  if (typeof record.summary !== "object" || record.summary === null) {
    return null;
  }

  const summaryEntries = Object.entries(record.summary as Record<string, unknown>).reduce<
    RoleMetricsSummary["summary"]
  >((acc, [role, counts]) => {
    if (
      typeof counts === "object" &&
      counts !== null &&
      typeof (counts as Record<string, unknown>).active === "number" &&
      typeof (counts as Record<string, unknown>).blocked === "number"
    ) {
      acc[role] = {
        active: (counts as Record<string, number>).active,
        blocked: (counts as Record<string, number>).blocked,
      };
    }
    return acc;
  }, {});

  return { summary: summaryEntries };
};

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUser: builder.query<PaginatedUsersResponse, GetUsersQueryArguments>({
      query: ({ page = 1, limit = 10, searchTerm } = {}) => {
        const params: Record<string, string | number> = { page, limit };
        if (searchTerm) {
          params.searchTerm = searchTerm;
        }
        return {
          url: "/user/get-all-users",
          params,
        };
      },
      transformResponse: (response: {
        data?: unknown;
        meta?: unknown;
      }): PaginatedUsersResponse => ({
        data: normaliseUsers(response?.data),
        meta: normaliseMeta(response?.meta),
      }),
    }),

    blockUser: builder.mutation<{ message?: string }, string>({
      query: (userId) => ({
        url: `/user/block/${userId}`,
        method: "PUT",
      }),
    }),
    unblockUser: builder.mutation<{ message?: string }, string>({
      query: (userId) => ({
        url: `/user/unblock/${userId}`,
        method: "PUT",
      }),
    }),
    updateUserRole: builder.mutation<
      { message?: string },
      { userId: string; role: string }
    >({
      query: ({ userId, role }) => ({
        url: `/user/update-role/${userId}`,
        method: "PUT",
        body: { role },
      }),
    }),
    getRoleMetrics: builder.query<RoleMetricsSummary | null, void>({
      query: () => ({
        url: "/user/role-metrics",
      }),
      transformResponse: (response: { data?: unknown }) =>
        normaliseRoleMetrics(response?.data),
    }),
  }),
});

export const {
  useGetAllUserQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
  useUpdateUserRoleMutation,
  useGetRoleMetricsQuery,
} = userApi;
