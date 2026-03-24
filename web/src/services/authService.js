import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { assertFirebaseConfigured, auth } from '@/services/firebase/client';
import { ensureUserProfile } from '@/services/userService';

async function enablePersistentSession() {
  assertFirebaseConfigured();
  await setPersistence(auth, browserLocalPersistence);
}

export async function registerWithEmailAndPassword({ email, password, displayName }) {
  await enablePersistentSession();
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  if (displayName) {
    await updateProfile(credential.user, { displayName });
  }

  await ensureUserProfile(credential.user, displayName);

  return credential.user;
}

export async function loginWithEmailAndPassword({ email, password }) {
  await enablePersistentSession();
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await ensureUserProfile(credential.user);
  return credential.user;
}

export async function logoutUser() {
  assertFirebaseConfigured();
  await signOut(auth);
}
