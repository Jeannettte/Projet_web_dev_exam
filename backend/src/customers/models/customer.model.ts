export interface CustomerModel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  birthDate: string | null;
  address: string | null;
  postalCode: string | null;
  city: string | null;
  country: string | null;
}

export interface CreateCustomerModel {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  birthDate?: string | null;
  address?: string | null;
  postalCode?: string | null;
  city?: string | null;
  country?: string | null;
}

export type UpdateCustomerModel = Partial<CreateCustomerModel>;

// The repository and the service must now return a ‘clients page’ rather than just an array.
export interface CustomersPageModel{
  totalCount: number;
  customers: CustomerModel[];
}