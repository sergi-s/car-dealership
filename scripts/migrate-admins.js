// migrate-admins.js - Script to migrate admin accounts to Firebase Authentication
require('dotenv').config();
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const auth = getAuth();

const migrateAdmins = async () => {
  try {
    console.log('Starting admin migration...');
    
    // Get all current admins from Firestore
    const adminsSnapshot = await db.collection('admins').get();
    
    if (adminsSnapshot.empty) {
      console.log('No admins to migrate');
      return;
    }
    
    console.log(`Found ${adminsSnapshot.size} admins to migrate`);
    
    for (const adminDoc of adminsSnapshot.docs) {
      const adminData = adminDoc.data();
      const username = adminData.username;
      // Create an email from username if it doesn't exist
      const email = adminData.email || `${username}@example.com`;
      
      try {
        // Check if user already exists in Firebase Auth
        try {
          await auth.getUserByEmail(email);
          console.log(`User ${email} already exists in Firebase Auth. Skipping.`);
          continue;
        } catch (error) {
          // User doesn't exist, we can create them
          if (error.code !== 'auth/user-not-found') {
            throw error;
          }
        }
        
        // Create user in Firebase Auth
        const userRecord = await auth.createUser({
          email: email,
          // For security reasons, create a temporary random password
          // that admins will need to reset
          password: Math.random().toString(36).slice(2) + Math.random().toString(36).toUpperCase().slice(2),
          displayName: adminData.name || username
        });
        
        console.log(`Created new user: ${userRecord.uid}`);
        
        // Set custom claims to mark user as admin
        await auth.setCustomUserClaims(userRecord.uid, { admin: true });
        
        // Create or update admin document with reference to Auth user
        await db.collection('admins').doc(userRecord.uid).set({
          username: username,
          email: email,
          role: 'admin',
          name: adminData.name || username,
          migratedAt: new Date(),
          originalAdminId: adminDoc.id
        });
        
        console.log(`Admin ${username} successfully migrated to ${email}`);
        
        // Send password reset email
        // await auth.generatePasswordResetLink(email);
        // console.log(`Password reset link sent to ${email}`);
      } catch (error) {
        console.error(`Error migrating admin ${username}:`, error);
      }
    }
    
    console.log('Admin migration complete!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
};

migrateAdmins().catch(console.error);