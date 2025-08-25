const admin = require('firebase-admin');
require('dotenv').config();

let db = null;

// Only initialize Firebase Admin if we have proper credentials
if (process.env.FIREBASE_ADMIN_ENABLED === 'true' && process.env.FIREBASE_PROJECT_ID) {
  try {
    const serviceAccount = {
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
    };

    // Check if we have the minimum required fields
    if (serviceAccount.project_id && serviceAccount.private_key && serviceAccount.client_email) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      db = admin.firestore();
      console.log('✅ Firebase Admin SDK initialized successfully');
    } else {
      console.log('⚠️ Firebase Admin SDK disabled - missing credentials');
    }
  } catch (error) {
    console.log('⚠️ Firebase Admin SDK disabled - configuration error:', error.message);
  }
} else {
  console.log('ℹ️ Firebase Admin SDK disabled - using client-side Firebase');
}

module.exports = { admin, db };
