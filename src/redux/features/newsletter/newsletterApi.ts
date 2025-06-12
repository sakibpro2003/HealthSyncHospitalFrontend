import { baseApi } from "@/redux/api/baseApi";
interface IEmail {
  email: string;
}
const newsletterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    subscribe: builder.mutation({
      query: (data: IEmail) => ({
        url: "/newsletter/subscribe",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSubscribeMutation } = newsletterApi;
