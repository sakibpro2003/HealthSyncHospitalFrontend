import { baseApi } from "@/redux/api/baseApi";

const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogSection: builder.query({
      query: () => "/blog/all-blog?limit=4",
    }),
  }),
});

export const { useGetBlogSectionQuery } = blogApi;

export default blogApi;
