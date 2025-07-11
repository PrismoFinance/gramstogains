
import admin from 'firebase-admin';

// Function to initialize Firebase Admin SDK
const initializeFirebaseAdmin = () => {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountKey) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. Please add it to your .env file.');
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: any) {
    console.error('Error parsing Firebase service account key:', error.message);
    throw new Error('Could not initialize Firebase Admin SDK. Please check your FIREBASE_SERVICE_ACCOUNT_KEY.');
  }
};

// Initialize and export the Firebase Admin SDK instance
export const firebaseAdmin = initializeFirebaseAdmin();

// Export the Firestore database instance for use in other parts of the backend
export const firestore = admin.firestore();

