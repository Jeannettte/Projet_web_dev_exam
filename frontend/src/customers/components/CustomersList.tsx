import { Pagination, Skeleton, Space } from "antd";
import { useEffect } from "react";
import type { CreateCustomerModel } from "../models/CustomerModel";
import { useCustomersProvider } from "../providers/useCustomersProvider";
import { AddCustomerButton } from "./AddCustomerButton";
import { CustomerListItem } from "./CustomerListItem";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

interface CustomersListProps {
  page: number;
  limit: number;
  onPaginationChange: (page: number, limit: number) => void;
}

export const CustomersList = ({
  page,
  limit,
  onPaginationChange,
}: CustomersListProps) => {
  const {
    customers,
    totalCount,
    deleteCustomer,
    createCustomer,
    isLoading,
    load,
  } = useCustomersProvider();

  //It now depends on [page, limit], so the list reloads every time the page or size changes.
  useEffect(() => {
    load(page, limit);
  }, [page, limit]);

  // The requested page is past the end (e.g. the last customer of the last
  // page was deleted, or the URL was edited): go back to the last page.
  useEffect(() => {
    if (!isLoading && customers.length === 0 && totalCount > 0 && page > 1) {
      onPaginationChange(Math.ceil(totalCount / limit), limit);
    }
  }, [isLoading, customers, totalCount, page, limit]);

  //onDelete reloads the current page after the action
  const onDelete = (id: string) => {
    deleteCustomer(id).then(() => load(page, limit));
  };

  //onCreate returns the promise so that AddCustomerButton can continue to handle the ‘email already in use’ error.
  const onCreate = (input: CreateCustomerModel) =>
    createCustomer(input).then(() => load(page, limit));

  return (
    <Space orientation="vertical" style={{ padding: ".25rem .5rem" }}>
      <AddCustomerButton createCustomer={onCreate} />
      {isLoading ? (
        <Skeleton />
      ) : (
        customers.map((customer) => (
          <CustomerListItem
            key={customer.id}
            customer={customer}
            deleteCustomer={onDelete}
          />
        ))
      )}
      <Pagination
        current={page}
        pageSize={limit}
        total={totalCount}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        showSizeChanger
        showTotal={(total) => `${total} customers`}
        onChange={onPaginationChange}
      />
    </Space>
  );
};