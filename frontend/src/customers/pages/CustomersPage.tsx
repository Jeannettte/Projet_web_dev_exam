import { CustomersList } from "../components/CustomersList";
//The page simply passes on whatever the route provides. The page remains simple and is unaware of the router.
interface CustomersPageProps {
  page: number;
  limit: number;
  onPaginationChange: (page: number, limit: number) => void;
}

export const CustomersPage = (props: CustomersPageProps) => {
  return <CustomersList {...props} />;
};