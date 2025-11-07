import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include",
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
