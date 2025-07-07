export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  salePrice?: number; // Optional sale price for discounts
  mileage: number;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  transmission: 'automatic' | 'manual';
  bodyType: 'sedan' | 'suv' | 'truck' | 'coupe' | 'convertible' | 'wagon' | 'hatchback' | 'van' | 'atv' | 'motorcycle' | 'camper' | 'cargo-van' | 'minivan' | 'pickup' | 'crew-cab' | 'extended-cab' | 'regular-cab' | 'sport-utility' | 'luxury' | 'classic' | 'recreational' | 'commercial' | 'other';
  color: string;
  description: string;
  images: string[];
  features: string[];
  vin: string;
  stockNumber: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VehicleFilters {
  make?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  color?: string;
}

// Working Hours Types
export interface WorkingHours {
  id: string;
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  isOpen: boolean;
  openTime?: string; // Format: "HH:MM" (24-hour)
  closeTime?: string; // Format: "HH:MM" (24-hour)
  isHoliday: boolean;
  holidayName?: string;
}

export interface SpecialDate {
  id: string;
  date: string; // Format: YYYY-MM-DD
  isOpen: boolean;
  openTime?: string; // Format: "HH:MM"
  closeTime?: string; // Format: "HH:MM"
  isHoliday: boolean;
  holidayName?: string;
}

export interface WorkingHoursSettings {
  id: string;
  defaultOpenTime: string; // Format: "HH:MM"
  defaultCloseTime: string; // Format: "HH:MM"
  workingDays: WorkingHours[];
  specialDates?: SpecialDate[];
  createdAt: Date;
  updatedAt: Date;
}

// Review Types
export interface Review {
  id?: string;
  name: string;
  email?: string;
  rating: number; // 1-5 stars
  title: string;
  comment: string;
  isApproved: boolean;
  isFlagged: boolean;
  flagReason?: string;
  createdAt: Date;
  updatedAt?: Date;
  adminNotes?: string;
} 