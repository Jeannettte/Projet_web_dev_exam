// Persistence failures translated at the repository boundary, without ORM types.
// The repository throws it, and the service turns it into an HTTP 409.
export class BikeHasSalesError extends Error {}