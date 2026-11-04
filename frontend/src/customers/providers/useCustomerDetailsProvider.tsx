import axios from "axios";
import { useRef, useState } from "react";
import type {
  CreateCustomerModel,
  CustomerModel,
  CustomersPageModel,
} from "../models/CustomerModel";

const CUSTOMERS_URL = "http://localhost:3000/customers";

export const useCustomersProvider = () => {
  const [customers, setCustomers] = useState<CustomerModel[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Only the latest request may update the state (avoids out-of-order responses)
  const lastRequestId = useRef(0);

  const load = (page: number, limit: number) => {
    const requestId = ++lastRequestId.current;
    setIsLoading(true);
    return axios
      .get<CustomersPageModel>(CUSTOMERS_URL, { params: { page, limit } })
      .then((result) => {
        if (requestId !== lastRequestId.current) return;
        setCustomers(result.data.customers);
        setTotalCount(result.data.totalCount);
      })
      .finally(() => {
        if (requestId === lastRequestId.current) setIsLoading(false);
      });
  };


  const deleteCustomer = (id: string) =>
    axios.delete(`${CUSTOMERS_URL}/${id}`).then(() => undefined);

  const createCustomer = (input: CreateCustomerModel) =>
    axios.post<CustomerModel>(CUSTOMERS_URL, input).then(() => undefined);

  return {
    customers,
    totalCount,
    load,
    isLoading,
    createCustomer,
  };
};