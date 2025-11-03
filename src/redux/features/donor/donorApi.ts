import { baseApi } from "@/redux/api/baseApi";

export type DonorRecord = {
  _id: string;
  name: string;
  bloodGroup: string;
  quantity: number;
  lastDonationDate?: string;
  phone?: string;
  email?: string;
  available?: boolean;
  address?: string;
  age?: number;
  gender?: string;
};

export type DonorPayload = {
  name: string;
  bloodGroup: string;
  quantity: number;
  lastDonationDate?: string;
  phone?: string;
  email?: string;
  available?: boolean;
  address?: string;
  age?: number;
  gender?: string;
};

const normaliseDonor = (candidate: unknown): DonorRecord | null => {
  if (typeof candidate !== "object" || candidate === null) {
    return null;
  }

  const record = candidate as Record<string, unknown>;
  const id = typeof record._id === "string" ? record._id : null;
  const name = typeof record.name === "string" ? record.name : null;
  const bloodGroup =
    typeof record.bloodGroup === "string" ? record.bloodGroup : null;
  const quantity =
    typeof record.quantity === "number" ? record.quantity : undefined;

  if (!id || !name || !bloodGroup || typeof quantity !== "number") {
    return null;
  }

  return {
    _id: id,
    name,
    bloodGroup,
    quantity,
    lastDonationDate:
      typeof record.lastDonationDate === "string"
        ? record.lastDonationDate
        : undefined,
    phone: typeof record.phone === "string" ? record.phone : undefined,
    email: typeof record.email === "string" ? record.email : undefined,
    available:
      typeof record.available === "boolean" ? record.available : undefined,
    address: typeof record.address === "string" ? record.address : undefined,
    age: typeof record.age === "number" ? record.age : undefined,
    gender: typeof record.gender === "string" ? record.gender : undefined,
  };
};

const normaliseDonorList = (payload: unknown): DonorRecord[] => {
  if (
    typeof payload === "object" &&
    payload !== null &&
    Array.isArray((payload as { result?: unknown }).result)
  ) {
    return normaliseDonorList((payload as { result: unknown[] }).result);
  }

  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .map((item) => normaliseDonor(item))
    .filter((item): item is DonorRecord => Boolean(item));
};

const donorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerDonor: builder.mutation<DonorRecord, DonorPayload>({
      query: (donorPayload) => ({
        url: "/donor/register-donor",
        method: "POST",
        body: donorPayload,
      }),
    }),
    viewDonor: builder.query<DonorRecord[], void>({
      query: () => ({
        url: "/donor/all-donor",
        method: "GET",
      }),
      transformResponse: (response: { data?: unknown }) =>
        normaliseDonorList(response?.data ?? []),
    }),
    getSingleDonor: builder.query<DonorRecord | null, string | void>({
      query: (_id) => ({
        url: `/donor/single-donor/${_id}`,
        method: "GET",
      }),
      transformResponse: (response: { data?: unknown }) => {
        const list = normaliseDonorList(response?.data ?? []);
        return list[0] ?? null;
      },
    }),
    updateDonor: builder.mutation<
      DonorRecord,
      { _id: string; donorPayload: Partial<DonorPayload> }
    >({
      query: ({ _id, donorPayload }) => ({
        url: `/donor/update-donor/${_id}`,
        method: "PUT",
        body: donorPayload,
      }),
    }),
  }),
});

export const {
  useRegisterDonorMutation,
  useViewDonorQuery,
  useGetSingleDonorQuery,
  useUpdateDonorMutation,
} = donorApi;
