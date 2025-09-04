import { baseApi } from "@/redux/api/baseApi";
// import { TProduct } from "@/types/product";

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

    // createProduct: builder.mutation({
    //   query: (productInfo) => ({
    //     url: "/products",
    //     method: "POST",
    //     body: productInfo,
    //   }),
    // }),
    // getSingleProduct: builder.query({
    //   query: (_id) => ({
    //     url: "/products",
    //     method: "GE",
    //     body: _id,
    //   }),
    // }),
    // removeMedicine: builder.mutation({
    //   query: (_id) => ({
    //     url: "/products",
    //     method: "DELETE",
    //     body: _id,
    //   }),
    // }),
  }),
});

export const { useGetAllUserQuery,useBlockUserMutation } = userAPi;
