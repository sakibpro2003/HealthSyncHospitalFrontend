import { baseApi } from "@/redux/api/baseApi";

export type TestimonialStatus = "pending" | "approved" | "rejected";

export type Testimonial = {
  _id: string;
  patientId?: string;
  patientName: string;
  patientEmail?: string;
  content: string;
  rating?: number;
  status: TestimonialStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type PaginationMeta = {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};

export type TestimonialQuery = Partial<{
  status: TestimonialStatus | "all";
  searchTerm: string;
  page: number;
  limit: number;
}>;

const testimonialApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitTestimonial: builder.mutation<
      Testimonial | undefined,
      { content: string; rating?: number; patientName?: string }
    >({
      query: (body) => ({
        url: "/testimonials",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data?: { result?: Testimonial } }) =>
        response?.data?.result,
      invalidatesTags: [
        { type: "testimonials", id: "LIST" },
        { type: "testimonials", id: "MY" },
        { type: "testimonials", id: "PUBLIC" },
      ],
    }),

    getMyTestimonials: builder.query<Testimonial[], void>({
      query: () => ({
        url: "/testimonials/mine",
      }),
      transformResponse: (response: { data?: { result?: Testimonial[] } }) =>
        response?.data?.result ?? [],
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map((item) => ({
                type: "testimonials" as const,
                id: item._id,
              })),
              { type: "testimonials" as const, id: "MY" },
            ]
          : [{ type: "testimonials" as const, id: "MY" }],
    }),

    getApprovedTestimonials: builder.query<
      Testimonial[],
      { limit?: number } | void
    >({
      query: (params) => ({
        url: "/testimonials/approved",
        params,
      }),
      transformResponse: (response: { data?: { result?: Testimonial[] } }) =>
        response?.data?.result ?? [],
      providesTags: [{ type: "testimonials", id: "PUBLIC" }],
    }),

    getTestimonials: builder.query<
      { result: Testimonial[]; meta?: PaginationMeta },
      TestimonialQuery | void
    >({
      query: (query) => ({
        url: "/testimonials",
        params: query,
      }),
      transformResponse: (response: {
        data?: { result?: Testimonial[]; meta?: PaginationMeta };
        meta?: PaginationMeta;
      }) => ({
        result: response?.data?.result ?? [],
        meta: response?.meta ?? response?.data?.meta,
      }),
      providesTags: (result) =>
        result?.result?.length
          ? [
              ...result.result.map((item) => ({
                type: "testimonials" as const,
                id: item._id,
              })),
              { type: "testimonials" as const, id: "LIST" },
            ]
          : [{ type: "testimonials" as const, id: "LIST" }],
    }),

    updateTestimonialStatus: builder.mutation<
      Testimonial | undefined,
      { id: string; status: TestimonialStatus }
    >({
      query: ({ id, status }) => ({
        url: `/testimonials/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      transformResponse: (response: { data?: { result?: Testimonial } }) =>
        response?.data?.result,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "testimonials", id },
        { type: "testimonials", id: "LIST" },
        { type: "testimonials", id: "MY" },
        { type: "testimonials", id: "PUBLIC" },
      ],
    }),
  }),
});

export const {
  useSubmitTestimonialMutation,
  useGetMyTestimonialsQuery,
  useGetApprovedTestimonialsQuery,
  useGetTestimonialsQuery,
  useUpdateTestimonialStatusMutation,
} = testimonialApi;
