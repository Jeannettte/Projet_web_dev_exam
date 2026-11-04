// Removes leading/trailing spaces from strings, so "  Trek " is stored as "Trek".
// Non-string values are returned untouched, so the validators can reject them.
export const trimString = ({ value }: { value: unknown }): unknown =>
  typeof value === "string" ? value.trim() : value;