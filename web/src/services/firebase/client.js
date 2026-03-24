import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const mode = import.meta.env.MODE || 'development';
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const missingConfig = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

export const firebaseStatus = {
  isConfigured: missingConfig.length === 0,
  missingConfig,
  mode,
  expectedEnvFile: mode === 'prod' ? '.env.prod' : '.env.dev',
};

if (missingConfig.length > 0) {
  console.warn(
    `Missing Firebase configuration values: ${missingConfig.join(', ')}. Check web/${firebaseStatus.expectedEnvFile}.`,
  );
}

export function assertFirebaseConfigured() {
  if (!firebaseStatus.isConfigured) {
    throw new Error(
      `Firebase is not configured. Add the missing values to web/${firebaseStatus.expectedEnvFile}: ${firebaseStatus.missingConfig.join(', ')}.`,
    );
  }
}

let app = null;
let auth = null;
let db = null;
let functions = null;

if (firebaseStatus.isConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  functions = getFunctions(
    app,
    import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || 'southamerica-east1',
  );
}

export { app, auth, db, functions };
