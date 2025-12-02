import { baseApi } from "@/redux/api/baseApi";
import { TProduct } from "@/types/product";

// export interface IEmergencyContact {
//   emergencyContactName: string;
//   relationship: string;
//   emergencyContactPhone: string;
// }
// type TMeta = {
//   limit: number;
//   page: number;
//   total: number;
//   totalPage: number;
// };
// export interface IPatient extends Document {
//   _id: string;
//   name: string;
//   role: string;
//   email?: string;
//   phone: string;
//   releaseStatus: boolean;
//   dateOfBirth: string;
//   gender: "male" | "female" | "other";
//   address: string;
//   bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
//   maritalStatus?: "single" | "married" | "divorced" | "widowed";
//   emergencyContact?: IEmergencyContact;
//   occupation?: string;
//   medicalHistory?: string[];
//   allergies?: string[];
//   currentMedications?: string[];
//   createdBy: string;
//   createdAt?: Date;
//   updatedAt?: Date;
//   meta: TMeta;
// }

// interface GetAllPatientResponse {
//   data: {
//     result: IPatient[];
//     meta: TMeta;
//   };
//   message: string;
//   success: boolean;
// }
// interface GetSinglePatientResponse {
//   data: {
//     result: IPatient;
//   };
//   message: string;
//   success: boolean;
// }

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllMedicine: builder.query<{ data: TProduct[] } | undefined, void>({
      query: () => `/products`,
      providesTags: (result) => {
        if (!result?.data) {
          return [{ type: "products" as const, id: "LIST" }];
        }

        const productTags = result.data
          .map((product) =>
            product._id
              ? ({ type: "products" as const, id: product._id } as const)
              : null
          )
          .filter(
            (
              tag
            ): tag is {
              type: "products";
              id: string;
            } => tag !== null
          );

        return [...productTags, { type: "products" as const, id: "LIST" }];
      },
    }),
    getSingleProduct: builder.query<{ data: TProduct }, string | void>({
      query: (_id) => `/products/${_id}`,
      providesTags: (result, _error, id) => {
        const resolvedId =
          result?.data?._id ?? (typeof id === "string" ? id : undefined);
        return resolvedId
          ? [{ type: "products" as const, id: resolvedId }]
          : [];
      },
    }),

    updateProduct: builder.mutation<
      unknown,
      { id: string; updatePayload: Partial<TProduct> }
    >({
      query: ({
        id,
        updatePayload,
      }: {
        id: string;
        updatePayload: Partial<TProduct>;
      }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: updatePayload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "products" as const, id },
        { type: "products" as const, id: "LIST" },
      ],
    }),

    createProduct: builder.mutation({
      query: (productInfo) => ({
        url: "/products",
        method: "POST",
        body: productInfo,
      }),
      invalidatesTags: [{ type: "products" as const, id: "LIST" }],
    }),
    uploadProductImage: builder.mutation<{ url: string }, FormData>({
      query: (formData) => ({
        url: "/products/upload",
        method: "POST",
        body: formData,
      }),
    }),
    removeMedicine: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "products" as const, id },
        { type: "products" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllMedicineQuery,
  useCreateProductMutation,
  useRemoveMedicineMutation,
  useGetSingleProductQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} = productApi;
