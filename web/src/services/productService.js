import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { assertFirebaseConfigured, db } from '@/services/firebase/client';
import { COLLECTIONS } from '@/services/firestoreSchema';

function withId(snapshot) {
  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export function subscribeToProducts(userId, onValue, onError) {
  assertFirebaseConfigured();
  const productsQuery = query(
    collection(db, COLLECTIONS.products),
    where('userId', '==', userId),
    where('deleted', '==', false),
    orderBy('updatedAt', 'desc'),
  );

  return onSnapshot(
    productsQuery,
    (snapshot) => onValue(snapshot.docs.map(withId)),
    onError,
  );
}

export function subscribeToRecentMovements(userId, onValue, onError, limitCount = 6) {
  assertFirebaseConfigured();
  const movementsQuery = query(
    collection(db, COLLECTIONS.movements),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount),
  );

  return onSnapshot(
    movementsQuery,
    (snapshot) => onValue(snapshot.docs.map(withId)),
    onError,
  );
}

export function subscribeToMovementsByProduct(userId, productId, onValue, onError) {
  assertFirebaseConfigured();
  const movementsQuery = query(
    collection(db, COLLECTIONS.movements),
    where('userId', '==', userId),
    where('productId', '==', productId),
    orderBy('createdAt', 'desc'),
  );

  return onSnapshot(
    movementsQuery,
    (snapshot) => onValue(snapshot.docs.map(withId)),
    onError,
  );
}

export function subscribeToProduct(productId, onValue, onError) {
  assertFirebaseConfigured();
  return onSnapshot(
    doc(db, COLLECTIONS.products, productId),
    (snapshot) => {
      if (!snapshot.exists()) {
        onValue(null);
        return;
      }

      onValue(withId(snapshot));
    },
    onError,
  );
}

export async function getProduct(productId) {
  assertFirebaseConfigured();
  const snapshot = await getDoc(doc(db, COLLECTIONS.products, productId));

  if (!snapshot.exists()) {
    return null;
  }

  return withId(snapshot);
}

export async function updateProductMetadata(productId, payload) {
  assertFirebaseConfigured();
  const productRef = doc(db, COLLECTIONS.products, productId);

  await updateDoc(productRef, {
    name: payload.name,
    description: payload.description || '',
    category: payload.category,
    price: Number(payload.price),
    updatedAt: serverTimestamp(),
  });
}
