import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { assertFirebaseConfigured, auth, db } from '@/services/firebase/client';
import { COLLECTIONS } from '@/services/firestoreSchema';

function withId(snapshot) {
  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

function createAppError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function requireSignedInUserId() {
  assertFirebaseConfigured();

  const userId = auth?.currentUser?.uid;

  if (!userId) {
    throw createAppError('unauthenticated', 'You must be signed in to perform this action.');
  }

  return userId;
}

function ensureDocumentId(value, fieldName) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw createAppError('invalid-argument', `${fieldName} must be a non-empty string.`);
  }

  return value.trim();
}

function ensureText(value, fieldName, { required = true, maxLength = 180 } = {}) {
  if (value == null || value === '') {
    if (required) {
      throw createAppError('invalid-argument', `${fieldName} is required.`);
    }

    return '';
  }

  if (typeof value !== 'string') {
    throw createAppError('invalid-argument', `${fieldName} must be a string.`);
  }

  const normalized = value.trim();

  if (required && normalized.length === 0) {
    throw createAppError('invalid-argument', `${fieldName} cannot be empty.`);
  }

  if (normalized.length > maxLength) {
    throw createAppError(
      'invalid-argument',
      `${fieldName} must contain at most ${maxLength} characters.`,
    );
  }

  return normalized;
}

function ensurePrice(value) {
  const price = Number(value);

  if (!Number.isFinite(price) || price < 0) {
    throw createAppError('invalid-argument', 'price must be a valid non-negative number.');
  }

  return Number(price.toFixed(2));
}

function ensureQuantity(value, fieldName = 'quantity', { min = 0 } = {}) {
  const quantity = Number(value);

  if (!Number.isInteger(quantity) || quantity < min) {
    throw createAppError(
      'invalid-argument',
      `${fieldName} must be an integer greater than or equal to ${min}.`,
    );
  }

  return quantity;
}

function ensureMovementType(value) {
  if (value !== 'IN' && value !== 'OUT') {
    throw createAppError('invalid-argument', 'type must be either IN or OUT.');
  }

  return value;
}

function productsCollection() {
  return collection(db, COLLECTIONS.products);
}

function movementsCollection() {
  return collection(db, COLLECTIONS.movements);
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

export async function createProduct(payload) {
  const userId = requireSignedInUserId();
  const name = ensureText(payload?.name, 'name', { maxLength: 120 });
  const description = ensureText(payload?.description, 'description', {
    required: false,
    maxLength: 600,
  });
  const category = ensureText(payload?.category, 'category', { maxLength: 80 });
  const price = ensurePrice(payload?.price);
  const initialQuantity = ensureQuantity(payload?.initialQuantity ?? 0, 'initialQuantity');
  const now = serverTimestamp();
  const productRef = doc(productsCollection());
  const movementRef = initialQuantity > 0 ? doc(movementsCollection()) : null;
  const batch = writeBatch(db);

  batch.set(productRef, {
    id: productRef.id,
    name,
    description,
    category,
    price,
    quantity: initialQuantity,
    createdAt: now,
    updatedAt: now,
    userId,
    deleted: false,
    lastMovementId: movementRef?.id || '',
  });

  if (movementRef) {
    batch.set(movementRef, {
      id: movementRef.id,
      productId: productRef.id,
      userId,
      type: 'IN',
      quantity: initialQuantity,
      reason: 'Initial stock',
      createdAt: now,
    });
  }

  await batch.commit();

  return {
    productId: productRef.id,
  };
}

export async function updateProductMetadata(productId, payload) {
  assertFirebaseConfigured();
  const normalizedProductId = ensureDocumentId(productId, 'productId');
  const productRef = doc(db, COLLECTIONS.products, normalizedProductId);
  const name = ensureText(payload?.name, 'name', { maxLength: 120 });
  const description = ensureText(payload?.description, 'description', {
    required: false,
    maxLength: 600,
  });
  const category = ensureText(payload?.category, 'category', { maxLength: 80 });
  const price = ensurePrice(payload?.price);

  await updateDoc(productRef, {
    name,
    description,
    category,
    price,
    updatedAt: serverTimestamp(),
  });
}

export async function updateStock(payload) {
  const userId = requireSignedInUserId();
  const productId = ensureDocumentId(payload?.productId, 'productId');
  const type = ensureMovementType(payload?.type);
  const quantity = ensureQuantity(payload?.quantity, 'quantity', { min: 1 });
  const reason = ensureText(payload?.reason, 'reason', {
    required: false,
    maxLength: 180,
  });
  const productRef = doc(db, COLLECTIONS.products, productId);
  const movementRef = doc(movementsCollection());

  await runTransaction(db, async (transaction) => {
    const productSnapshot = await transaction.get(productRef);

    if (!productSnapshot.exists()) {
      throw createAppError('not-found', 'Product not found.');
    }

    const product = productSnapshot.data();

    if (product.userId !== userId) {
      throw createAppError('permission-denied', 'You can only change your own inventory.');
    }

    if (product.deleted) {
      throw createAppError(
        'failed-precondition',
        'Deleted products cannot receive stock updates.',
      );
    }

    const currentQuantity = Number(product.quantity || 0);
    const nextQuantity = type === 'IN' ? currentQuantity + quantity : currentQuantity - quantity;

    if (nextQuantity < 0) {
      throw createAppError('failed-precondition', 'Stock cannot go below zero.');
    }

    transaction.update(productRef, {
      quantity: nextQuantity,
      updatedAt: serverTimestamp(),
      lastMovementId: movementRef.id,
    });

    transaction.set(movementRef, {
      id: movementRef.id,
      productId,
      userId,
      type,
      quantity,
      reason,
      createdAt: serverTimestamp(),
    });
  });

  return {
    productId,
  };
}

export async function deleteProduct(payload) {
  const userId = requireSignedInUserId();
  const productId = ensureDocumentId(payload?.productId, 'productId');
  const productRef = doc(db, COLLECTIONS.products, productId);

  await runTransaction(db, async (transaction) => {
    const productSnapshot = await transaction.get(productRef);

    if (!productSnapshot.exists()) {
      throw createAppError('not-found', 'Product not found.');
    }

    const product = productSnapshot.data();

    if (product.userId !== userId) {
      throw createAppError('permission-denied', 'You can only delete your own products.');
    }

    if (product.deleted) {
      throw createAppError('failed-precondition', 'Product is already deleted.');
    }

    transaction.update(productRef, {
      deleted: true,
      updatedAt: serverTimestamp(),
    });
  });

  return {
    productId,
    deleted: true,
  };
}
