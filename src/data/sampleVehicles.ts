import type { Vehicle } from '../types/vehicle';

export const sampleVehicles: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    price: 28500,
    mileage: 15000,
    fuelType: 'gasoline',
    transmission: 'automatic',
    bodyType: 'sedan',
    color: 'Silver',
    description: 'Well-maintained Toyota Camry with excellent fuel economy and reliability. Perfect for daily commuting or family use.',
    images: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop'
    ],
    features: ['Bluetooth', 'Backup Camera', 'Lane Departure Warning', 'Apple CarPlay', 'Android Auto'],
    vin: '1HGBH41JXMN109186',
    stockNumber: 'CAM001',
    isAvailable: true
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
    description: 'Spacious Honda CR-V with all-wheel drive. Great for families and outdoor adventures.',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop'
    ],
    features: ['AWD', 'Heated Seats', 'Navigation', 'Blind Spot Monitor', 'Power Liftgate'],
    vin: '5FNRL38467B411146',
    stockNumber: 'CRV002',
    isAvailable: true
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
    description: 'Powerful Ford F-150 with excellent towing capacity. Perfect for work or recreational use.',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop'
    ],
    features: ['4x4', 'Towing Package', 'Bed Liner', 'Backup Camera', 'SYNC 3'],
    vin: '1FTEW1EG8JFA12345',
    stockNumber: 'F150003',
    isAvailable: true
  },
  {
    make: 'BMW',
    model: '3 Series',
    year: 2022,
    price: 42000,
    mileage: 12000,
    fuelType: 'gasoline',
    transmission: 'automatic',
    bodyType: 'sedan',
    color: 'White',
    description: 'Luxury BMW 3 Series with premium features and sporty performance.',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop'
    ],
    features: ['Leather Seats', 'Navigation', 'Premium Sound', 'Sport Package', 'LED Headlights'],
    vin: 'WBA8E9G50JNT12345',
    stockNumber: 'BMW004',
    isAvailable: true
  },
  {
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    price: 48000,
    mileage: 5000,
    fuelType: 'electric',
    transmission: 'automatic',
    bodyType: 'sedan',
    color: 'Red',
    description: 'Electric Tesla Model 3 with autopilot and long-range battery. Zero emissions, maximum performance.',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop'
    ],
    features: ['Autopilot', 'Long Range', 'Glass Roof', 'Supercharging', 'Premium Interior'],
    vin: '5YJ3E1EA1JF123456',
    stockNumber: 'TES005',
    isAvailable: true
  },
  {
    make: 'Jeep',
    model: 'Wrangler',
    year: 2021,
    price: 38000,
    mileage: 18000,
    fuelType: 'gasoline',
    transmission: 'manual',
    bodyType: 'suv',
    color: 'Green',
    description: 'Iconic Jeep Wrangler with off-road capability. Ready for adventure.',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop'
    ],
    features: ['4x4', 'Removable Top', 'Off-road Package', 'Manual Transmission', 'Trail Rated'],
    vin: '1C4HJXEG8MW123456',
    stockNumber: 'JEEP006',
    isAvailable: false
  }
]; 