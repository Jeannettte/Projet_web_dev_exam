import { createFileRoute } from "@tanstack/react-router";
import { BikesPage } from "../../bikes/pages/BikesPage";
import { validatePaginationSearch } from "../../shared/pagination";

// URL: /bikes?page=2&limit=10
// validateSearch reads and sanitizes page/limit from the URL
export const Route = createFileRoute("/bikes/")({
  validateSearch: validatePaginationSearch,
  component: RouteComponent,
});

function RouteComponent() {
  const { page, limit } = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <BikesPage
      page={page}
      limit={limit}
      onPaginationChange={(newPage, newLimit) =>
        // When the page size changes, go back to page 1 to avoid an invalid page
        navigate({
          search: { page: newLimit === limit ? newPage : 1, limit: newLimit },
        })
      }
    />
  );
}