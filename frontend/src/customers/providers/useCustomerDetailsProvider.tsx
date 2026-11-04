import axios from "axios";
import { useState } from "react";
import type {
  CustomerModel,
  UpdateCustomerModel,
} from "../models/CustomerModel";
import type { PurchaseModel } from "../models/PurchaseModel";

const CUSTOMERS_URL = "http://localhost:3000/customers";

export const useCustomerDetailsProvider = (customerId: string) => {
  const [customer, setCustomer] = useState<CustomerModel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [purchases, setPurchases] = useState<PurchaseModel[]>([]);
  const [isPurchasesLoading, setIsPurchasesLoading] = useState<boolean>(true);

  const load = () => {
    setIsLoading(true);
    return axios
      .get<CustomerModel>(`${CUSTOMERS_URL}/${customerId}`)
      .then((result) => setCustomer(result.data))
      // 404 or network error: the page shows "Customer not found"
      .catch(() => setCustomer(null))
      .finally(() => setIsLoading(false));
  };

  const loadPurchases = () => {
    setIsPurchasesLoading(true);
    return axios
      .get<PurchaseModel[]>(`${CUSTOMERS_URL}/${customerId}/bikes`)
      .then((result) => setPurchases(result.data))
      .catch(() => setPurchases([]))
      .finally(() => setIsPurchasesLoading(false));
  };

  // Rejects on failure so the edit form stays open
  const updateCustomer = (input: UpdateCustomerModel) =>
    axios
      .patch<CustomerModel>(`${CUSTOMERS_URL}/${customerId}`, input)
      .then((result) => setCustomer(result.data));

  return {
    customer,
    isLoading,
    load,
    updateCustomer,
    purchases,
    isPurchasesLoading,
    loadPurchases,
  };
};
