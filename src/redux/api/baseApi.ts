import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import type { Pokemon } from './types'
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1",
    credentials: "include",
  }),
  tagTypes: [
    "subscription",
    "appointments",
    "doctor",
    "patient",
    "payments",
    "bloodInventory",
    "bloodRequests",
  ],
  endpoints: () => ({}),
});
