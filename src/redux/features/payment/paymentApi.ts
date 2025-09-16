import { baseApi } from "@/redux/api/baseApi";
import { TProduct } from "@/types/product";

const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // getAllMedicine: builder.query({
    //   query: () => `/products`,
    // }),
    // getSingleProduct: builder.query({
    //   query: (_id) => `/products/${_id}`,
    // }),

    // updateProduct: builder.mutation({
    //   query: ({
    //     id,
    //     updatePayload,
    //   }: {
    //     id: string;
    //     updatePayload: Partial<TProduct>;
    //   }) => ({
    //     url: `/products/${id}`,
    //     method: "PUT",
    //     body: updatePayload,
    //   }),
    // }),

    createPayment: builder.mutation({
      query: (paymentInfo) => ({
        url: "/create-ssl-payment",
        method: "POST",
        body: paymentInfo,
      }),
    }),
    // removeMedicine: builder.mutation({
    //   query: (_id) => ({
    //     url: "/products",
    //     method: "DELETE",
    //     body: _id,
    //   }),
    // }),
  }),
});

export const {useCreatePaymentMutation} = paymentApi;
