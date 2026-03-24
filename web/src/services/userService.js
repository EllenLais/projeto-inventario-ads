import { Timestamp, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { assertFirebaseConfigured, db } from '@/services/firebase/client';

export function buildFallbackProfile(user, displayName = user?.displayName || '') {
  if (!user) {
    return null;
  }

  const creationTime = user.metadata?.creationTime
    ? Timestamp.fromDate(new Date(user.metadata.creationTime))
    : null;

  return {
    id: user.uid,
    email: user.email || '',
    displayName: displayName || user.displayName || user.email?.split('@')[0] || 'Inventory User',
    createdAt: creationTime,
    updatedAt: creationTime,
  };
}

export async function ensureUserProfile(user, displayName = user?.displayName || '') {
  assertFirebaseConfigured();

  if (!user) {
    return null;
  }

  const userRef = doc(db, 'users', user.uid);
  const payload = {
    ...buildFallbackProfile(user, displayName),
    updatedAt: serverTimestamp(),
    createdAt:
      user.metadata?.creationTime != null
        ? Timestamp.fromDate(new Date(user.metadata.creationTime))
        : serverTimestamp(),
  };

  await setDoc(userRef, payload, { merge: true });

  return payload;
}

export async function getUserProfile(userId) {
  assertFirebaseConfigured();
  const snapshot = await getDoc(doc(db, 'users', userId));

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}
