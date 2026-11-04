// The API stores prices in cents (integers, no floating point errors).
// This converts cents to a localized euro amount, e.g. 129900 -> "1,299.00 €".
export const formatPrice = (cents: number) =>
  (cents / 100).toLocaleString(undefined, {
    style: "currency",
    currency: "EUR",
  });