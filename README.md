# StockPilot IMS

Production-ready Inventory Management System built with React, Vite, Tailwind CSS, and Firebase.

## Architecture

- Frontend: React + Vite SPA in [`web/`](/home/matheus/Documentos/senai/imsi/projeto-inventario-ads/web) with Firebase Auth, Firestore subscriptions, protected routes, validation, toasts, and Tailwind UI.
- Backend: Firebase Callable Functions in [`functions/src/index.js`](/home/matheus/Documentos/senai/imsi/projeto-inventario-ads/functions/src/index.js) for product creation, stock adjustments, and soft delete.
- Data model: flat Firestore collections (`users`, `products`, `movements`) to make dashboard queries and recent movement feeds simpler than nested product subcollections.
- Security: Firestore rules allow users to access only their own documents, block direct movement writes, and block direct stock changes from the client.

## Folder Structure

```text
.
├── .github/workflows/
│   ├── deploy-dev.yml
│   └── deploy-prod.yml
├── functions/
│   ├── package.json
│   └── src/index.js
├── web/
│   ├── .env.dev.example
│   ├── .env.prod.example
│   ├── package.json
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── hooks/
│       ├── lib/
│       ├── pages/
│       └── services/
├── .firebaserc
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
└── README.md
```

## Firestore Collections

### `users/{uid}`

```json
{
  "id": "uid",
  "email": "user@example.com",
  "displayName": "Alex Johnson",
  "createdAt": "Timestamp",
  "updatedAt": "Timestamp"
}
```

### `products/{productId}`

```json
{
  "id": "generated-id",
  "name": "Wireless scanner",
  "description": "Warehouse handheld scanner",
  "category": "Peripherals",
  "price": 149.9,
  "quantity": 12,
  "createdAt": "Timestamp",
  "updatedAt": "Timestamp",
  "userId": "uid",
  "deleted": false
}
```

### `movements/{movementId}`

```json
{
  "id": "generated-id",
  "productId": "product-id",
  "userId": "uid",
  "type": "IN",
  "quantity": 4,
  "reason": "Purchase order #204",
  "createdAt": "Timestamp"
}
```

## Key Flows

### 1. Product creation with movement logging

Callable function: [`functions/src/index.js`](/home/matheus/Documentos/senai/imsi/projeto-inventario-ads/functions/src/index.js)

```js
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
```

If `initialQuantity > 0`, the same batch writes an `IN` movement.

### 2. Stock updates enforced on the backend

Callable function: [`functions/src/index.js`](/home/matheus/Documentos/senai/imsi/projeto-inventario-ads/functions/src/index.js)

```js
const nextQuantity = type === 'IN' ? currentQuantity + quantity : currentQuantity - quantity;

if (nextQuantity < 0) {
  throw new HttpsError('failed-precondition', 'Stock cannot go below zero.');
}
```

The same transaction updates product stock and creates the movement record.

### 3. Direct client stock writes blocked by rules

Rule file: [`firestore.rules`](/home/matheus/Documentos/senai/imsi/projeto-inventario-ads/firestore.rules)

```rules
allow update: if productOwner()
  && request.resource.data.userId == resource.data.userId
  && request.resource.data.quantity == resource.data.quantity
  && request.resource.data.deleted == resource.data.deleted;
```

This permits metadata edits while forcing stock updates and soft delete through Functions.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create actual env files in [`web/`](/home/matheus/Documentos/senai/imsi/projeto-inventario-ads/web):

```bash
cp web/.env.dev.example web/.env.dev
cp web/.env.prod.example web/.env.prod
```

3. Fill the Firebase Web App config values for each environment.

4. Start the app:

```bash
npm run dev
```

## Firebase Setup Steps

1. Create two Firebase projects:
   - `inventory-dev`
   - `inventory-prod`
2. In each project, enable:
   - Authentication with Email/Password
   - Cloud Firestore in production mode
   - Cloud Functions
   - Firebase Hosting
3. Create a Web App in each Firebase project and copy its config into `web/.env.dev` or `web/.env.prod`.
4. Create a service account JSON key in each project and add it to GitHub Secrets:
   - `FIREBASE_SERVICE_ACCOUNT_DEV`
   - `FIREBASE_SERVICE_ACCOUNT_PROD`
5. Add web config secrets for both environments:
   - `DEV_FIREBASE_API_KEY`
   - `DEV_FIREBASE_AUTH_DOMAIN`
   - `DEV_FIREBASE_PROJECT_ID`
   - `DEV_FIREBASE_STORAGE_BUCKET`
   - `DEV_FIREBASE_MESSAGING_SENDER_ID`
   - `DEV_FIREBASE_APP_ID`
   - `DEV_FIREBASE_FUNCTIONS_REGION`
   - `PROD_FIREBASE_API_KEY`
   - `PROD_FIREBASE_AUTH_DOMAIN`
   - `PROD_FIREBASE_PROJECT_ID`
   - `PROD_FIREBASE_STORAGE_BUCKET`
   - `PROD_FIREBASE_MESSAGING_SENDER_ID`
   - `PROD_FIREBASE_APP_ID`
   - `PROD_FIREBASE_FUNCTIONS_REGION`
6. Ensure the Firebase project IDs in [`.firebaserc`](/home/matheus/Documentos/senai/imsi/projeto-inventario-ads/.firebaserc) match the real project IDs.

## Deployment Strategy

- Push to `dev`:
  - installs dependencies
  - creates `web/.env.dev`
  - builds with `vite build --mode dev`
  - deploys Hosting, Functions, Firestore rules, and indexes to `inventory-dev`
- Push to `main`:
  - installs dependencies
  - creates `web/.env.prod`
  - builds with `vite build --mode prod`
  - deploys Hosting, Functions, Firestore rules, and indexes to `inventory-prod`

Workflow files:

- [`deploy-dev.yml`](/home/matheus/Documentos/senai/imsi/projeto-inventario-ads/.github/workflows/deploy-dev.yml)
- [`deploy-prod.yml`](/home/matheus/Documentos/senai/imsi/projeto-inventario-ads/.github/workflows/deploy-prod.yml)

## Private Route and Session Handling

- Firebase Auth persists the session in local browser storage.
- [`AuthContext.jsx`](/home/matheus/Documentos/senai/imsi/projeto-inventario-ads/web/src/contexts/AuthContext.jsx) listens to `onAuthStateChanged`.
- [`ProtectedRoute.jsx`](/home/matheus/Documentos/senai/imsi/projeto-inventario-ads/web/src/components/ProtectedRoute.jsx) blocks private screens for unauthenticated users.

## Notes for Extension

- Add Firebase Emulator support if you want isolated local backend testing.
- Add unit tests around form validation and function payload validation if you want CI coverage beyond build verification.
- Add recovery workflows for soft-deleted products if product restoration becomes a requirement.
