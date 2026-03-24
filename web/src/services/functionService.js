import { httpsCallable } from 'firebase/functions';
import { assertFirebaseConfigured, functions } from '@/services/firebase/client';

export async function createProduct(payload) {
  assertFirebaseConfigured();
  const createProductCallable = httpsCallable(functions, 'createProduct');
  const response = await createProductCallable(payload);
  return response.data;
}

export async function updateStock(payload) {
  assertFirebaseConfigured();
  const updateStockCallable = httpsCallable(functions, 'updateStock');
  const response = await updateStockCallable(payload);
  return response.data;
}

export async function deleteProduct(payload) {
  assertFirebaseConfigured();
  const deleteProductCallable = httpsCallable(functions, 'deleteProduct');
  const response = await deleteProductCallable(payload);
  return response.data;
}
