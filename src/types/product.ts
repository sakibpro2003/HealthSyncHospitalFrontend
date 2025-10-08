export type TManufacturer = {
  name: string;
  address?: string;
  contact?: string;
};

export type TProduct = {
  _id?: string;
  name: string;
  image: string;
  description: string;
  price: number;
  inStock: boolean;
  quantity: number;
  manufacturer?: TManufacturer | string;
  requiredPrescription?: boolean;
  expiryDate?: string;
  totalPrice?: number;
  product?: {
    name: string;
    image: string;
  };
  discount?: number;
  packSize?: string;
  category?: string;
  form?: string;
  rating?: number;
  dosage?: string;
  createdAt?: string;
  updatedAt?: string;
  updated_at?: string;
};
