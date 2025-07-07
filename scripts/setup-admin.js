// This script helps you set up admin users in Firebase
// Run this in your Firebase project console or use Firebase Admin SDK

/*
To set up an admin user:

1. First, create a user account in Firebase Authentication
2. Then, add a document to the 'users' collection with the following structure:

Collection: 'users'
Document ID: [user-uid-from-auth]
{
  "email": "admin@example.com",
  "role": "admin",
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}

Example Firestore document:
{
  "email": "admin@yourdomain.com",
  "role": "admin", 
  "createdAt": serverTimestamp(),
  "updatedAt": serverTimestamp()
}

To create this manually in Firebase Console:
1. Go to Firestore Database
2. Create a collection called 'users'
3. Add a document with ID = user UID from Authentication
4. Add the fields above

Or use Firebase Admin SDK in a Node.js script:
*/

/*
const admin = require('firebase-admin');
const serviceAccount = require('./path-to-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function createAdminUser(email, password) {
  try {
    // Create user in Authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });

    // Add admin role in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email: email,
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('Admin user created successfully:', userRecord.uid);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Usage:
// createAdminUser('admin@example.com', 'secure-password-123');
*/ 