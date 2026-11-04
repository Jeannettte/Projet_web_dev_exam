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

  const load = (page: number, limit: number) => { // load can take 2 components 
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

  // Deleting/creating shifts the content of every page: the caller reloads
 const deleteCustomer = (id: string) =>
  axios.delete(`${CUSTOMERS_URL}/${id}`).then(() => undefined);
 
  // Returns the request so the caller can react to errors (e.g. email already in use)
  const createCustomer = (input: CreateCustomerModel) =>
    axios.post<CustomerModel>(CUSTOMERS_URL, input).then(() => undefined);

  return {
    customers,
    totalCount,
    load,
    isLoading,
    deleteCustomer,
    createCustomer,
  };
};