import { initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { setGlobalOptions } from 'firebase-functions/v2/options';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

initializeApp();

setGlobalOptions({
  region: 'southamerica-east1',
  maxInstances: 10,
});

const db = getFirestore();
const PRODUCTS = 'products';
const MOVEMENTS = 'movements';

function requireAuth(request) {
  const userId = request.auth?.uid;

  if (!userId) {
    throw new HttpsError('unauthenticated', 'You must be signed in to perform this action.');
  }

  return userId;
}

function ensureDocumentId(value, fieldName) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new HttpsError('invalid-argument', `${fieldName} must be a non-empty string.`);
  }

  return value.trim();
}

function ensureText(value, fieldName, { required = true, maxLength = 180 } = {}) {
  if (value == null || value === '') {
    if (required) {
      throw new HttpsError('invalid-argument', `${fieldName} is required.`);
    }

    return '';
  }

  if (typeof value !== 'string') {
    throw new HttpsError('invalid-argument', `${fieldName} must be a string.`);
  }

  const normalized = value.trim();

  if (required && normalized.length === 0) {
    throw new HttpsError('invalid-argument', `${fieldName} cannot be empty.`);
  }

  if (normalized.length > maxLength) {
    throw new HttpsError(
      'invalid-argument',
      `${fieldName} must contain at most ${maxLength} characters.`,
    );
  }

  return normalized;
}

function ensurePrice(value) {
  const price = Number(value);

  if (!Number.isFinite(price) || price < 0) {
    throw new HttpsError('invalid-argument', 'price must be a valid non-negative number.');
  }

  return Number(price.toFixed(2));
}

function ensureQuantity(value, fieldName = 'quantity', { min = 0 } = {}) {
  const quantity = Number(value);

  if (!Number.isInteger(quantity) || quantity < min) {
    throw new HttpsError(
      'invalid-argument',
      `${fieldName} must be an integer greater than or equal to ${min}.`,
    );
  }

  return quantity;
}

function ensureMovementType(value) {
  if (value !== 'IN' && value !== 'OUT') {
    throw new HttpsError('invalid-argument', 'type must be either IN or OUT.');
  }

  return value;
}

// Flat top-level collections make audit and dashboard queries cheaper to
// reason about: a user's recent movements and low-stock list can be fetched
// directly without traversing product subcollections.
export const createProduct = onCall(async (request) => {
  const userId = requireAuth(request);
  const name = ensureText(request.data?.name, 'name', { maxLength: 120 });
  const description = ensureText(request.data?.description, 'description', {
    required: false,
    maxLength: 600,
  });
  const category = ensureText(request.data?.category, 'category', { maxLength: 80 });
  const price = ensurePrice(request.data?.price);
  const initialQuantity = ensureQuantity(request.data?.initialQuantity ?? 0, 'initialQuantity');
  const now = FieldValue.serverTimestamp();
  const productRef = db.collection(PRODUCTS).doc();
  const batch = db.batch();

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
  });

  if (initialQuantity > 0) {
    const movementRef = db.collection(MOVEMENTS).doc();

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
});

export const updateStock = onCall(async (request) => {
  const userId = requireAuth(request);
  const productId = ensureDocumentId(request.data?.productId, 'productId');
  const type = ensureMovementType(request.data?.type);
  const quantity = ensureQuantity(request.data?.quantity, 'quantity', { min: 1 });
  const reason = ensureText(request.data?.reason, 'reason', {
    required: false,
    maxLength: 180,
  });
  const productRef = db.collection(PRODUCTS).doc(productId);
  const movementRef = db.collection(MOVEMENTS).doc();

  await db.runTransaction(async (transaction) => {
    const productSnapshot = await transaction.get(productRef);

    if (!productSnapshot.exists) {
      throw new HttpsError('not-found', 'Product not found.');
    }

    const product = productSnapshot.data();

    if (product.userId !== userId) {
      throw new HttpsError('permission-denied', 'You can only change your own inventory.');
    }

    if (product.deleted) {
      throw new HttpsError('failed-precondition', 'Deleted products cannot receive stock updates.');
    }

    const currentQuantity = Number(product.quantity || 0);
    const nextQuantity = type === 'IN' ? currentQuantity + quantity : currentQuantity - quantity;

    if (nextQuantity < 0) {
      throw new HttpsError('failed-precondition', 'Stock cannot go below zero.');
    }

    transaction.update(productRef, {
      quantity: nextQuantity,
      updatedAt: FieldValue.serverTimestamp(),
    });

    transaction.set(movementRef, {
      id: movementRef.id,
      productId,
      userId,
      type,
      quantity,
      reason,
      createdAt: FieldValue.serverTimestamp(),
    });
  });

  return {
    productId,
  };
});

export const deleteProduct = onCall(async (request) => {
  const userId = requireAuth(request);
  const productId = ensureDocumentId(request.data?.productId, 'productId');
  const productRef = db.collection(PRODUCTS).doc(productId);

  await db.runTransaction(async (transaction) => {
    const productSnapshot = await transaction.get(productRef);

    if (!productSnapshot.exists) {
      throw new HttpsError('not-found', 'Product not found.');
    }

    const product = productSnapshot.data();

    if (product.userId !== userId) {
      throw new HttpsError('permission-denied', 'You can only delete your own products.');
    }

    if (product.deleted) {
      throw new HttpsError('failed-precondition', 'Product is already deleted.');
    }

    transaction.update(productRef, {
      deleted: true,
      updatedAt: FieldValue.serverTimestamp(),
    });
  });

  return {
    productId,
    deleted: true,
  };
});

