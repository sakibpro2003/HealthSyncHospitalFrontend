import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { readClientTokenCookie } from "@/utils/clientTokenCookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1";

type MaybeAuthState = {
  auth?: {
    token?: string | null;
  };
};

const resolveAuthToken = (state?: MaybeAuthState) => {
  if (state?.auth?.token) {
    return state.auth.token;
  }

  return readClientTokenCookie();
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include",
    prepareHeaders: (headers, api) => {
      const token = resolveAuthToken(api.getState() as MaybeAuthState);
      if (token && !headers.has("authorization")) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: [
    "subscription",
    "appointments",
    "prescriptions",
  "doctor",
  "patient",
  "payments",
  "bloodInventory",
  "bloodRequests",
  "products",
  ],
  endpoints: () => ({}),
});
