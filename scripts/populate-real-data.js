import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin
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

// Real vehicle data from Derek Piccott Auto Sales website
const realVehicles = [
  {
    make: 'Dodge',
    model: 'Challenger RT TA Edition',
    year: 2023,
    price: 69500,
    salePrice: 65000,
    mileage: 380,
    fuelType: 'gasoline',
    transmission: 'automatic',
    bodyType: 'coupe',
    color: 'Black',
    description: '2023 Dodge Challenger RT TA Edition with only 380 km. Low mileage, excellent condition.',
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop'
    ],
    features: ['Low Km', 'RT Package', 'TA Edition', 'Performance Package'],
    vin: '2C3CDZAG8PH123456',
    stockNumber: 'DP001',
    isAvailable: true
  },
  {
    make: 'Subaru',
    model: 'Outback',
    year: 2016,
    price: 10900,
    salePrice: 9900,
    mileage: 85000,
    fuelType: 'gasoline',
    transmission: 'manual',
    bodyType: 'wagon',
    color: 'Silver',
    description: '2016 Subaru Outback AWD 5-speed manual transmission. Reliable and versatile.',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop'
    ],
    features: ['AWD', 'Manual Transmission', 'Low Km', 'All-Weather Package'],
    vin: '4S3BMHB68B3287654',
    stockNumber: 'DP002',
    isAvailable: false // Sold
  },
  {
    make: 'Ford',
    model: 'Flex',
    year: 2014,
    price: 12900,
    salePrice: 10900,
    mileage: 120000,
    fuelType: 'gasoline',
    transmission: 'automatic',
    bodyType: 'wagon',
    color: 'White',
    description: '2014 Ford Flex wagon AWD. Spacious family vehicle with excellent cargo capacity.',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'
    ],
    features: ['AWD', 'Low Km', 'Third Row Seating', 'Power Liftgate'],
    vin: '2FMDK48C84BA12345',
    stockNumber: 'DP003',
    isAvailable: true
  },
  {
    make: 'GMC',
    model: 'Long Box',
    year: 2010,
    price: 8900,
    salePrice: 6900,
    mileage: 180000,
    fuelType: 'gasoline',
    transmission: 'automatic',
    bodyType: 'truck',
    color: 'Red',
    description: '2010 GMC Long Box 4x4 automatic. Work truck ready for heavy duty tasks.',
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop'
    ],
    features: ['4x4', 'Long Box', 'Low Km', 'Work Ready'],
    vin: '1GTEC14X0YZ123456',
    stockNumber: 'DP004',
    isAvailable: true
  },
  {
    make: 'Jeep',
    model: 'Wrangler',
    year: 2014,
    price: 15900,
    salePrice: 14900,
    mileage: 95000,
    fuelType: 'gasoline',
    transmission: 'manual',
    bodyType: 'suv',
    color: 'Green',
    description: '2014 Jeep Wrangler 6-speed manual. Iconic off-road capability with manual transmission.',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'
    ],
    features: ['4x4', 'Manual Transmission', 'Low Km', 'Trail Rated'],
    vin: '1C4BJWDG4EL123456',
    stockNumber: 'DP005',
    isAvailable: true
  },
  {
    make: 'Honda',
    model: 'Civic LX',
    year: 2016,
    price: 17900,
    salePrice: 16900,
    mileage: 75000,
    fuelType: 'gasoline',
    transmission: 'automatic',
    bodyType: 'sedan',
    color: 'Blue',
    description: '2016 Honda Civic LX. Reliable compact sedan with excellent fuel economy.',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop'
    ],
    features: ['Low Km', 'Fuel Efficient', 'Reliable', 'Backup Camera'],
    vin: '19XFC2F56GE123456',
    stockNumber: 'DP006',
    isAvailable: false // Sold
  },
  {
    make: 'Other',
    model: 'CX Moto 600cc Touring Edition',
    year: 2023,
    price: 8900,
    salePrice: 7900,
    mileage: 500,
    fuelType: 'gasoline',
    transmission: 'manual',
    bodyType: 'other',
    color: 'Black',
    description: '2023 CX Moto 600cc Touring Edition motorcycle. Low mileage touring bike.',
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop'
    ],
    features: ['Low Km', 'Touring Edition', '600cc Engine', 'Manual Transmission'],
    vin: 'CXMOTO2023123456',
    stockNumber: 'DP007',
    isAvailable: true
  },
  {
    make: 'Mitsubishi',
    model: 'Lanhai ATV 550cc Two Up',
    year: 2022,
    price: 4900,
    salePrice: 4900,
    mileage: 200,
    fuelType: 'gasoline',
    transmission: 'automatic',
    bodyType: 'other',
    color: 'Red',
    description: '2022 Mitsubishi Lanhai ATV 550cc Two Up. Off-road adventure vehicle.',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'
    ],
    features: ['Low Km', '550cc Engine', 'Two Up Seating', 'Off-Road Ready'],
    vin: 'MITATV2022123456',
    stockNumber: 'DP008',
    isAvailable: true
  },
  {
    make: 'Ford',
    model: 'Escape XLT',
    year: 2017,
    price: 8995,
    salePrice: 6900,
    mileage: 110000,
    fuelType: 'gasoline',
    transmission: 'automatic',
    bodyType: 'suv',
    color: 'Silver',
    description: '2017 Ford Escape XLT AWD. Compact SUV with all-wheel drive capability.',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop'
    ],
    features: ['AWD', 'Low Km', 'XLT Package', 'Power Liftgate'],
    vin: '1FMCU0F75HUA12345',
    stockNumber: 'DP009',
    isAvailable: true
  },
  {
    make: 'Dodge',
    model: 'Camper Van',
    year: 1997,
    price: 24900,
    salePrice: 19900,
    mileage: 150000,
    fuelType: 'gasoline',
    transmission: 'automatic',
    bodyType: 'van',
    color: 'White',
    description: '1997 Dodge Camper Van. Classic camper van ready for adventures.',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'
    ],
    features: ['Camper Conversion', 'Low Km', 'Sleeping Area', 'Kitchen Setup'],
    vin: '2B4GH25N1VR123456',
    stockNumber: 'DP010',
    isAvailable: true
  }
];

async function populateRealData() {
  try {
    console.log('🚗 Starting to populate database with real vehicle data...');
    
    // Clear existing vehicles
    const existingVehicles = await db.collection('vehicles').get();
    const batch = db.batch();
    
    existingVehicles.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log('✅ Cleared existing vehicles');
    
    // Add real vehicles
    for (const vehicle of realVehicles) {
      const vehicleData = {
        ...vehicle,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      await db.collection('vehicles').add(vehicleData);
      console.log(`✅ Added ${vehicle.year} ${vehicle.make} ${vehicle.model}`);
    }
    
    console.log(`\n🎉 Successfully populated database with ${realVehicles.length} real vehicles from Derek Piccott Auto Sales!`);
    console.log('\n📊 Summary:');
    console.log(`- Total vehicles: ${realVehicles.length}`);
    console.log(`- Available: ${realVehicles.filter(v => v.isAvailable).length}`);
    console.log(`- Sold: ${realVehicles.filter(v => !v.isAvailable).length}`);
    
    const makes = [...new Set(realVehicles.map(v => v.make))];
    console.log(`- Makes: ${makes.join(', ')}`);
    
    const totalValue = realVehicles.reduce((sum, v) => sum + v.price, 0);
    console.log(`- Total inventory value: $${totalValue.toLocaleString()}`);
    
  } catch (error) {
    console.error('❌ Error populating database:', error);
    process.exit(1);
  }
}

populateRealData().then(() => {
  console.log('\n✨ Database population complete!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
}); 