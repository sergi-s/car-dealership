// seed-inquiries.js
require('dotenv').config();
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// Sample inquiry data
const inquiries = [
  {
    name: 'John Davis',
    email: 'john.davis@example.com',
    phone: '(555) 123-4567',
    interest: 'purchase',
    message: 'I\'m interested in the 2023 Mercedes-Benz S-Class. Does it have the premium package?',
    consent: true,
    status: 'new',
    vehicleId: '', // Can be populated if related to a specific vehicle
    createdAt: new Date()
  },
  {
    name: 'Sarah Miller',
    email: 'sarah.miller@example.com',
    phone: '(555) 234-5678',
    interest: 'test-drive',
    message: 'I would like to schedule a test drive for the BMW 7 Series this weekend if possible.',
    consent: true,
    status: 'new',
    vehicleId: '', // Can be populated if related to a specific vehicle
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)) // 2 days ago
  },
  {
    name: 'Michael Johnson',
    email: 'michael.j@example.com',
    phone: '(555) 345-6789',
    interest: 'trade-in',
    message: 'I want to trade in my 2019 Audi Q5 for a newer model. What kind of value can I expect?',
    consent: true,
    status: 'in-progress',
    vehicleId: '',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)) // 5 days ago
  },
  {
    name: 'Emily Wilson',
    email: 'emily.wilson@example.com',
    phone: '(555) 456-7890',
    interest: 'financing',
    message: 'I\'m interested in financing options for the Tesla Model S. Can you provide details on current rates?',
    consent: true,
    status: 'responded',
    vehicleId: '',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 7)) // 7 days ago
  },
  {
    name: 'Robert Brown',
    email: 'robert.brown@example.com',
    phone: '(555) 567-8901',
    interest: 'purchase',
    message: 'Looking for a luxury SUV with good fuel economy. Do you have any recommendations?',
    consent: true,
    status: 'new',
    vehicleId: '',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)) // 1 day ago
  },
  {
    name: 'Jennifer Smith',
    email: 'jennifer.smith@example.com',
    phone: '(555) 678-9012',
    interest: 'service',
    message: 'Need to schedule a maintenance service for my 2021 Lexus LS 500.',
    consent: true,
    status: 'responded',
    vehicleId: '',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 10)) // 10 days ago
  },
  {
    name: 'David Williams',
    email: 'david.w@example.com',
    phone: '(555) 789-0123',
    interest: 'other',
    message: 'Do you offer vehicle shipping to other states? I\'m relocating but interested in one of your vehicles.',
    consent: true,
    status: 'new',
    vehicleId: '',
    createdAt: new Date()
  },
  {
    name: 'Amanda Taylor',
    email: 'amanda.t@example.com',
    phone: '(555) 890-1234',
    interest: 'test-drive',
    message: 'I want to test drive the Porsche Taycan. Is it available this Thursday afternoon?',
    consent: true,
    status: 'in-progress',
    vehicleId: '',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)) // 3 days ago
  }
];

async function seedInquiries() {
  try {
    const inquiriesCollection = db.collection('inquiries');
    
    // Delete existing inquiries (optional)
    const existingInquiries = await inquiriesCollection.get();
    const batch = db.batch();
    existingInquiries.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    console.log(`Deleted ${existingInquiries.size} existing inquiries`);

    // Add new inquiries
    const addPromises = inquiries.map(inquiry => inquiriesCollection.add(inquiry));
    await Promise.all(addPromises);
    
    console.log(`Successfully seeded ${inquiries.length} inquiries to Firestore`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding inquiries:', error);
    process.exit(1);
  }
}

seedInquiries();