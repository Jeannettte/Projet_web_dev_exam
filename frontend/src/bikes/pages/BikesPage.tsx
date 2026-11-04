import { BikesList } from "../components/BikeList";

// The page simply passes on whatever the route provides.
// It stays simple and does not know the router.
interface BikesPageProps {
  page: number;
  limit: number;
  onPaginationChange: (page: number, limit: number) => void;
}

export const BikesPage = (props: BikesPageProps) => {
  return <BikesList {...props} />;
};