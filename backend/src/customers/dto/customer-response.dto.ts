import type { CustomersPageModel, CustomerModel } from "../models/customer.model";

export class CustomerResponseDto {
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

  static fromModel(model: CustomerModel): CustomerResponseDto {
    return Object.assign(new CustomerResponseDto(), model);
  }
}

// The repository and the service must now return a ‘clients page’ rather than just an array.
// The CustomersPageResponseDto class is used to represent a page of customers in the response.
export class CustomersPageResponseDto{
  totalCount: number;
  customers: CustomerResponseDto[];
  
  static fromModel(model: CustomersPageModel): CustomersPageResponseDto {
    return Object.assign(new CustomersPageResponseDto(), {
      totalCount: model.totalCount,
      customers: model.customers.map(customer => CustomerResponseDto.fromModel(customer),),
    });
  }
}


