import { baseApi } from "@/redux/api/baseApi";

export interface IDoctor {
  _id: string;
  name: string;
  email: string;
  image: string;
  phone: string;
  department: string;
  specialization: string;
  education: string[] | string;
  availability: {
    days?: string[];
    from?: string;
    to?: string;
    location?: string;
  };
  experience?: string;
  consultationFee?: number;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IMeta {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
}

type DoctorListPayload =
  | IDoctor[]
  | {
      result?: IDoctor[];
      meta?: IMeta;
    };

type GetAllDoctorArgs = {
  department?: string;
  page?: number;
  limit?: number;
  searchTerm?: string;
};

interface IGetAllDoctorResponse {
  data: {
    result: DoctorListPayload;
    meta?: IMeta | null;
  };
  message: string;
  success: string;
}

interface IGetSingleDoctorResponse {
  data: {
    result: IDoctor;
  };
  message: string;
  success: string;
}

const normaliseDoctorList = (payload: DoctorListPayload | undefined): IDoctor[] => {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload.result)) {
    return payload.result;
  }

  return [];
};

export const extractDoctorMeta = (
  payload: DoctorListPayload | undefined,
  meta?: IMeta | null,
): IMeta | undefined => {
  if (meta) {
    return meta;
  }

  if (payload && !Array.isArray(payload) && payload.meta) {
    return payload.meta;
  }

  return undefined;
};

export const doctorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllDoctor: builder.query<IGetAllDoctorResponse, GetAllDoctorArgs | void>({
      query: (args) => {
        const params = new URLSearchParams();

        if (args?.department && args.department.trim().length > 0) {
          params.set("department", args.department.trim());
        }

        const limit = args?.limit ?? 12;
        params.set("limit", String(limit));

        if (args?.page) {
          params.set("page", String(args.page));
        }

        if (args?.searchTerm && args.searchTerm.trim().length > 0) {
          params.set("searchTerm", args.searchTerm.trim());
        }

        const queryString = params.toString();
        return queryString
          ? `/doctor/get-all-doctor?${queryString}`
          : "/doctor/get-all-doctor";
      },
      providesTags: (result) => {
        const doctors = normaliseDoctorList(result?.data?.result);
        return [
          ...doctors.map((doctor) => ({
            type: "doctor" as const,
            id: doctor._id,
          })),
          { type: "doctor" as const, id: "LIST" },
        ];
      },
    }),
    getSingleDoctor: builder.query<IGetSingleDoctorResponse, string | void>({
      query: (_id) => `/doctor/get-doctor/${_id}`,
      providesTags: (result, error, arg) =>
        result?.data?.result?._id
          ? [{ type: "doctor" as const, id: result.data.result._id }]
          : arg
          ? [{ type: "doctor" as const, id: arg }]
          : [],
    }),
    updateDoctor: builder.mutation<
      unknown,
      { id: string; payload: Partial<IDoctor> }
    >({
      query: ({ id, payload }) => ({
        url: `/doctor/update-doctor/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "doctor" as const, id },
        { type: "doctor" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllDoctorQuery,
  useGetSingleDoctorQuery,
  useUpdateDoctorMutation,
} = doctorApi;

export const normaliseDoctorResult = normaliseDoctorList;
