// Pagination rules, identical to the backend (PaginationQueryDto)
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 50;

// Returns the value as a positive integer, or the fallback if it is invalid
const toPositiveInt = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 ? parsed : fallback;
};

// Used by the routes as `validateSearch`.
// Page and limit live in the URL (?page=2&limit=10), so the back button and
// page reloads keep the current page. Invalid values fall back to the defaults
// and limit is capped at 50, so we never send a request the API would reject (400).
export const validatePaginationSearch = (search: Record<string, unknown>) => ({
  page: toPositiveInt(search.page, DEFAULT_PAGE),
  limit: Math.min(toPositiveInt(search.limit, DEFAULT_LIMIT), MAX_LIMIT),
});