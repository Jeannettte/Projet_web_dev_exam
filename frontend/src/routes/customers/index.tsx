import { createFileRoute } from "@tanstack/react-router";
import { CustomersPage } from "../../customers/pages/CustomersPage";

const DEFAULT_PAGE=1;
const DEFAULT_LIMIT=10;
const MAX_LIMIT=50;

// Page and limit live in the URL (?page=2&limit=10): navigation, back button
// and reloads all keep the current page. Invalid values fall back to defaults.
const toPositiveInt = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 ? parsed : fallback;
};

export const Route = createFileRoute("/customers/")({
  validateSearch: (search: Record<string, unknown>) => ({
    page: toPositiveInt(search.page, DEFAULT_PAGE),
    limit: Math.min(toPositiveInt(search.limit, DEFAULT_LIMIT), MAX_LIMIT),
  }),
  component: RouteComponent,
});

// The route component is rendered when the route is active. It can use the route's search and params.
// It can also use the route's loaderData, if the route has a loader.
//useSearch and useParams are typed to the route's search and params. The component can also use the route's loaderData, if the route has a loader.
//I reset any invalid values to their defaults so that I never send a request to the backend that would return a 400 error. I also set the limit to 50 for the same reason
function RouteComponent() {
  const { page, limit } = Route.useSearch();
  const navigate = Route.useNavigate();
  return ( <CustomersPage page={page} limit={limit} onPaginationChange={(newPage, newLimit) =>
    //if user change the page size, we reset the page to 1 to avoid invalid page number
        navigate({search: {page: newLimit === limit ? newPage : 1,  limit: newLimit,
          },
        })
      }
    />
  );
}