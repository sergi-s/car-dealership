import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Firebase Admin Setup
const serviceAccountPath = join(__dirname, '../serviceAccountKey.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ serviceAccountKey.json not found. Please add your Firebase service account key.');
  process.exit(1);
}
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const WORKING_HOURS_COLLECTION = 'workingHours';

async function setupWorkingHours() {
  try {
    console.log('🔧 Setting up default working hours...');
    
    // Check if working hours already exist
    const querySnapshot = await db.collection(WORKING_HOURS_COLLECTION).get();
    
    if (!querySnapshot.empty) {
      console.log('✅ Working hours already exist in the database.');
      return;
    }
    
    // Create default working hours
    const defaultWorkingHours = {
      defaultOpenTime: '09:00',
      defaultCloseTime: '17:00',
      workingDays: [
        {
          id: 'day-0',
          dayOfWeek: 'monday',
          isOpen: true,
          openTime: '09:00',
          closeTime: '17:00',
          isHoliday: false
        },
        {
          id: 'day-1',
          dayOfWeek: 'tuesday',
          isOpen: true,
          openTime: '09:00',
          closeTime: '17:00',
          isHoliday: false
        },
        {
          id: 'day-2',
          dayOfWeek: 'wednesday',
          isOpen: true,
          openTime: '09:00',
          closeTime: '17:00',
          isHoliday: false
        },
        {
          id: 'day-3',
          dayOfWeek: 'thursday',
          isOpen: true,
          openTime: '09:00',
          closeTime: '17:00',
          isHoliday: false
        },
        {
          id: 'day-4',
          dayOfWeek: 'friday',
          isOpen: true,
          openTime: '09:00',
          closeTime: '17:00',
          isHoliday: false
        },
        {
          id: 'day-5',
          dayOfWeek: 'saturday',
          isOpen: true,
          openTime: '10:00',
          closeTime: '15:00',
          isHoliday: false
        },
        {
          id: 'day-6',
          dayOfWeek: 'sunday',
          isOpen: false,
          isHoliday: true,
          holidayName: 'Sunday - Closed'
        }
      ],
      specialDates: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add to Firestore
    const docRef = await db.collection(WORKING_HOURS_COLLECTION).add(defaultWorkingHours);
    
    console.log('✅ Default working hours created successfully!');
    console.log('📋 Document ID:', docRef.id);
    console.log('🕒 Hours: Monday-Friday 9:00 AM - 5:00 PM, Saturday 10:00 AM - 3:00 PM, Sunday Closed');
    
  } catch (error) {
    console.error('❌ Error setting up working hours:', error);
  } finally {
    process.exit(0);
  }
}

setupWorkingHours(); 