import admin from 'firebase-admin';


if (!process.env.FIREBASE_ADMIN_CREDENTIAL) {
  console.error('Missing FIREBASE_ADMIN_CREDENTIAL in .env file');
  throw new Error('Failed to initialize Firebase Admin: Missing credentials');
}

try {
  const adminCredentials = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIAL);

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: adminCredentials.project_id,
        clientEmail: adminCredentials.client_email,
        privateKey: adminCredentials.private_key.replace(/\\n/g, '\n'), // Handle newline characters
      }),
    });
    console.log('Firebase Admin initialized successfully');
  }
} catch (error) {
  console.error('Error parsing FIREBASE_ADMIN_CREDENTIAL:', error.message);
  throw new Error('Failed to initialize Firebase Admin: Invalid credentials format');
}


export const adminAuth = admin.auth();
export const adminFirestore = admin.firestore();
