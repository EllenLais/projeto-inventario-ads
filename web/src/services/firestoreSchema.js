// The app uses flat top-level collections instead of subcollections.
// That keeps dashboard queries fast and simple because we can fetch a
// user's recent movements or low-stock products without collection-group
// queries across many product documents.
export const COLLECTIONS = {
  users: 'users',
  products: 'products',
  movements: 'movements',
};

