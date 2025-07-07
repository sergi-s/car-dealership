import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load service account key
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Service account key not found!');
  console.log('\nTo fix this:');
  console.log('1. Go to Firebase Console > Project Settings > Service Accounts');
  console.log('2. Click "Generate New Private Key"');
  console.log('3. Save the JSON file as "serviceAccountKey.json" in the project root');
  console.log('4. Make sure to add "serviceAccountKey.json" to your .gitignore file');
  process.exit(1);
}

const serviceAccount = JSON.parse(
  fs.readFileSync(serviceAccountPath, 'utf8')
);

// Initialize Firebase Admin SDK
admin.initializeApp({ 
  credential: admin.credential.cert(serviceAccount) 
});

const db = admin.firestore();

async function createDemoAdminUser() {
  const demoEmail = 'admin@demo.com';
  const demoPassword = 'admin123456';
  
  try {
    console.log('🚀 Setting up demo admin user...');
    
    // Check if user already exists
    try {
      const existingUser = await admin.auth().getUserByEmail(demoEmail);
      console.log('⚠️  User already exists with email:', demoEmail);
      console.log('User UID:', existingUser.uid);
      
      // Update the existing user's role in Firestore
      await db.collection('users').doc(existingUser.uid).set({
        email: demoEmail,
        role: 'admin',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      
      console.log('✅ Updated existing user with admin role');
      console.log('\n📋 Demo Admin Credentials:');
      console.log('Email:', demoEmail);
      console.log('Password:', demoPassword);
      console.log('\n🔗 Login URL: http://localhost:5173/admin/login');
      
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Create new user
        console.log('Creating new admin user...');
        
        const userRecord = await admin.auth().createUser({
          email: demoEmail,
          password: demoPassword,
          displayName: 'Demo Admin',
          emailVerified: true
        });

        // Add admin role in Firestore
        await db.collection('users').doc(userRecord.uid).set({
          email: demoEmail,
          role: 'admin',
          displayName: 'Demo Admin',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log('✅ Demo admin user created successfully!');
        console.log('User UID:', userRecord.uid);
        console.log('\n📋 Demo Admin Credentials:');
        console.log('Email:', demoEmail);
        console.log('Password:', demoPassword);
        console.log('\n🔗 Login URL: http://localhost:5173/admin/login');
      } else {
        throw error;
      }
    }
    
  } catch (error) {
    console.error('❌ Error creating demo admin user:', error);
    process.exit(1);
  }
}

async function createSampleVehicles() {
  try {
    console.log('\n🚗 Creating sample vehicles...');
    
    const sampleVehicles = [
      {
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        price: 25000,
        mileage: 15000,
        fuelType: 'gasoline',
        transmission: 'automatic',
        bodyType: 'sedan',
        color: 'Silver',
        description: 'Well-maintained Toyota Camry with low mileage. Perfect for daily commuting.',
        images: [
          'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
          'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'
        ],
        features: ['Bluetooth', 'Backup Camera', 'Cruise Control', 'Apple CarPlay'],
        vin: '1HGBH41JXMN109186',
        stockNumber: 'TC001',
        isAvailable: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      {
        make: 'Honda',
        model: 'CR-V',
        year: 2021,
        price: 32000,
        mileage: 22000,
        fuelType: 'gasoline',
        transmission: 'automatic',
        bodyType: 'suv',
        color: 'Blue',
        description: 'Spacious Honda CR-V with excellent fuel economy and reliability.',
        images: [
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
          'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800'
        ],
        features: ['AWD', 'Bluetooth', 'Backup Camera', 'Heated Seats', 'Sunroof'],
        vin: '5FNRL38467B024096',
        stockNumber: 'HC001',
        isAvailable: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      {
        make: 'Ford',
        model: 'F-150',
        year: 2023,
        price: 45000,
        mileage: 8000,
        fuelType: 'gasoline',
        transmission: 'automatic',
        bodyType: 'truck',
        color: 'Black',
        description: 'Powerful Ford F-150 with modern technology and excellent towing capacity.',
        images: [
          'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800',
          'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'
        ],
        features: ['4x4', 'Bluetooth', 'Backup Camera', 'Towing Package', 'LED Headlights'],
        vin: '1FTEW1EG8JFA12345',
        stockNumber: 'FF001',
        isAvailable: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }
    ];

    for (const vehicle of sampleVehicles) {
      await db.collection('vehicles').add(vehicle);
    }

    console.log('✅ Created', sampleVehicles.length, 'sample vehicles');
    
  } catch (error) {
    console.error('❌ Error creating sample vehicles:', error);
  }
}

async function main() {
  console.log('🎯 Vehicle Dealership Demo Setup');
  console.log('================================\n');
  
  await createDemoAdminUser();
  await createSampleVehicles();
  
  console.log('\n🎉 Setup complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Start your development server: npm run dev');
  console.log('2. Navigate to: http://localhost:5173/admin/login');
  console.log('3. Login with the demo credentials above');
  console.log('4. Start managing your vehicle inventory!');
  
  process.exit(0);
}

// Run the setup
main().catch(console.error); 