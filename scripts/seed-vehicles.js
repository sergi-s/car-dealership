// seed-vehicles.js
require('dotenv').config();
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// Sample vehicle data
const vehicles = [
  {
    make: 'Mercedes-Benz',
    model: 'S-Class',
    year: 2023,
    title: '2023 Mercedes-Benz S-Class',
    price: 94500,
    mileage: 12450,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    extColor: 'Black',
    intColor: 'Beige',
    vin: 'WDDUG8CB5JA123456',
    description: 'Luxury sedan with advanced features and premium comfort.',
    features: ['Navigation', 'Leather Seats', 'Sunroof', 'Premium Audio', 'Heated Seats'],
    image: 'https://example.com/images/mercedes-s-class.jpg',
    images: [
      'https://example.com/images/mercedes-s-class-front.jpg',
      'https://example.com/images/mercedes-s-class-back.jpg',
      'https://example.com/images/mercedes-s-class-interior.jpg'
    ],
    badge: 'Featured',
    status: 'Available',
    dateAdded: new Date()
  },
  {
    make: 'BMW',
    model: '7 Series',
    year: 2023,
    title: '2023 BMW 7 Series',
    price: 89700,
    mileage: 8750,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    drivetrain: 'RWD',
    extColor: 'White',
    intColor: 'Black',
    vin: 'WBA7E2C57JB123457',
    description: 'Flagship luxury sedan with cutting-edge technology and superior performance.',
    features: ['Heads-up Display', 'Massage Seats', 'Panoramic Roof', 'Lane Assist', 'Parking Assistant'],
    image: 'https://example.com/images/bmw-7series.jpg',
    images: [
      'https://example.com/images/bmw-7series-front.jpg',
      'https://example.com/images/bmw-7series-back.jpg',
      'https://example.com/images/bmw-7series-interior.jpg'
    ],
    badge: 'New Arrival',
    status: 'Available',
    dateAdded: new Date()
  },
  {
    make: 'Audi',
    model: 'A8',
    year: 2022,
    title: '2022 Audi A8',
    price: 86500,
    mileage: 15200,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    extColor: 'Gray',
    intColor: 'Brown',
    vin: 'WAUZZZ4H1JN123458',
    description: 'Elegant luxury sedan with Quattro all-wheel drive and premium amenities.',
    features: ['Virtual Cockpit', 'Bang & Olufsen Sound', 'Adaptive Cruise', 'Night Vision', 'Matrix LED Headlights'],
    image: 'https://example.com/images/audi-a8.jpg',
    images: [
      'https://example.com/images/audi-a8-front.jpg',
      'https://example.com/images/audi-a8-back.jpg',
      'https://example.com/images/audi-a8-interior.jpg'
    ],
    badge: 'Sale',
    status: 'Available',
    dateAdded: new Date()
  },
  {
    make: 'Tesla',
    model: 'Model S',
    year: 2023,
    title: '2023 Tesla Model S',
    price: 104990,
    mileage: 5300,
    fuelType: 'Electric',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    extColor: 'Red',
    intColor: 'White',
    vin: '5YJSA1E27JF123459',
    description: 'High-performance electric sedan with advanced autopilot capabilities.',
    features: ['Autopilot', '17" Touchscreen', 'Falcon Wing Doors', 'Ludicrous Mode', 'Over-the-air Updates'],
    image: 'https://example.com/images/tesla-models.jpg',
    images: [
      'https://example.com/images/tesla-models-front.jpg',
      'https://example.com/images/tesla-models-back.jpg',
      'https://example.com/images/tesla-models-interior.jpg'
    ],
    badge: 'Featured',
    status: 'Available',
    dateAdded: new Date()
  },
  {
    make: 'Lexus',
    model: 'LS',
    year: 2023,
    title: '2023 Lexus LS 500',
    price: 78230,
    mileage: 9800,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    drivetrain: 'RWD',
    extColor: 'Silver',
    intColor: 'Black',
    vin: 'JTHB51JF3K0123460',
    description: 'Japanese luxury flagship with exceptional quality and comfort.',
    features: ['Mark Levinson Audio', 'Kiriko Glass', 'Hand-pleated Door Trim', 'Climate Concierge', 'Adaptive Suspension'],
    image: 'https://example.com/images/lexus-ls.jpg',
    images: [
      'https://example.com/images/lexus-ls-front.jpg',
      'https://example.com/images/lexus-ls-back.jpg',
      'https://example.com/images/lexus-ls-interior.jpg'
    ],
    badge: 'New',
    status: 'Available',
    dateAdded: new Date()
  },
  {
    make: 'Porsche',
    model: 'Taycan',
    year: 2023,
    title: '2023 Porsche Taycan',
    price: 86700,
    mileage: 6720,
    fuelType: 'Electric',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    extColor: 'Blue',
    intColor: 'Black',
    vin: 'WP0AA2Y19LSA123461',
    description: 'High-performance electric sports car with iconic Porsche design.',
    features: ['800-volt Architecture', 'Porsche Active Suspension', 'Sport Chrono Package', 'Adaptive Seats', 'Curved Display'],
    image: 'https://example.com/images/porsche-taycan.jpg',
    images: [
      'https://example.com/images/porsche-taycan-front.jpg',
      'https://example.com/images/porsche-taycan-back.jpg',
      'https://example.com/images/porsche-taycan-interior.jpg'
    ],
    badge: 'Featured',
    status: 'Available',
    dateAdded: new Date()
  },
  {
    make: 'Range Rover',
    model: 'Sport',
    year: 2022,
    title: '2022 Range Rover Sport',
    price: 83000,
    mileage: 18500,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    extColor: 'Green',
    intColor: 'Tan',
    vin: 'SALGA2AJ8KA123462',
    description: 'Premium SUV with off-road capability and refined luxury.',
    features: ['Terrain Response 2', 'Wade Sensing', 'Air Suspension', 'Meridian Sound', 'Configurable Ambient Lighting'],
    image: 'https://example.com/images/range-rover-sport.jpg',
    images: [
      'https://example.com/images/range-rover-sport-front.jpg',
      'https://example.com/images/range-rover-sport-back.jpg',
      'https://example.com/images/range-rover-sport-interior.jpg'
    ],
    badge: 'Popular',
    status: 'Available',
    dateAdded: new Date()
  },
  {
    make: 'Cadillac',
    model: 'Escalade',
    year: 2023,
    title: '2023 Cadillac Escalade',
    price: 96795,
    mileage: 11200,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    extColor: 'Black',
    intColor: 'Beige',
    vin: '1GYS4CKJ2NR123463',
    description: 'Full-size luxury SUV with imposing presence and advanced technology.',
    features: ['Super Cruise', 'AKG Studio 36-speaker Audio', 'OLED Displays', 'Magnetic Ride Control', 'Night Vision'],
    image: 'https://example.com/images/cadillac-escalade.jpg',
    images: [
      'https://example.com/images/cadillac-escalade-front.jpg',
      'https://example.com/images/cadillac-escalade-back.jpg',
      'https://example.com/images/cadillac-escalade-interior.jpg'
    ],
    badge: 'Featured',
    status: 'Available',
    dateAdded: new Date()
  }
];

async function seedVehicles() {
  try {
    const vehiclesCollection = db.collection('vehicles');
    
    // Delete existing vehicles (optional)
    const existingVehicles = await vehiclesCollection.get();
    const batch = db.batch();
    existingVehicles.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    console.log(`Deleted ${existingVehicles.size} existing vehicles`);

    // Add new vehicles
    const addPromises = vehicles.map(vehicle => vehiclesCollection.add(vehicle));
    await Promise.all(addPromises);
    
    console.log(`Successfully seeded ${vehicles.length} vehicles to Firestore`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding vehicles:', error);
    process.exit(1);
  }
}

seedVehicles();