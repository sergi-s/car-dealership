// seed-admin.js
require('dotenv').config();
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// Replace this with the actual UID from Firebase Authentication
const adminUID = 'PRGGMPZ2jsg586XkecLPpzi0GZ12';

// Data to seed
const adminData = {
  role: 'admin'
};

async function seedAdmin() {
  try {
    const adminRef = db.collection('admins').doc(adminUID);

    const docSnapshot = await adminRef.get();
    if (docSnapshot.exists) {
      console.log(`Admin with UID ${adminUID} already exists. Overwriting...`);
    }

    await adminRef.set(adminData);
    console.log(`Successfully seeded admin with UID ${adminUID}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
