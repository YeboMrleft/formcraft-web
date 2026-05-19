import admin from 'firebase-admin';

let app: admin.app.App | null = null;

function initApp(): admin.app.App {
  if (app) return app;
  if (admin.apps.length > 0) { app = admin.apps[0]!; return app; }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT env var not set');

  const sa = JSON.parse(raw);
  if (sa.private_key) sa.private_key = sa.private_key.replace(/\\n/g, '\n');

  app = admin.initializeApp({ credential: admin.credential.cert(sa) });
  return app;
}

export function getFirestore() {
  return admin.firestore(initApp());
}
