import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIAL);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.VITE_FIREBASE_PROJECT_ID, // Explicitly set projectId
  });
}

export const db = admin.firestore();
export default admin;
