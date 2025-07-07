import { collection, getDocs, query, where, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Vehicle, VehicleFilters } from '../types/vehicle';

const VEHICLES_COLLECTION = 'vehicles';

export const vehicleService = {
  // Get all vehicles
  async getAllVehicles(): Promise<Vehicle[]> {
    try {
      const querySnapshot = await getDocs(collection(db, VEHICLES_COLLECTION));
      const vehicles = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Vehicle[];
      
      return vehicles;
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw error;
    }
  },

  // Get vehicles with filters
  async getVehiclesWithFilters(filters: VehicleFilters): Promise<Vehicle[]> {
    try {
      console.log('🔍 getVehiclesWithFilters called with filters:', filters);
      const q = collection(db, VEHICLES_COLLECTION);
      const constraints = [];

      if (filters.make) {
        constraints.push(where('make', '==', filters.make));
      }
      if (filters.model) {
        constraints.push(where('model', '==', filters.model));
      }
      if (filters.yearMin) {
        constraints.push(where('year', '>=', filters.yearMin));
      }
      if (filters.yearMax) {
        constraints.push(where('year', '<=', filters.yearMax));
      }
      if (filters.priceMin) {
        constraints.push(where('price', '>=', filters.priceMin));
      }
      if (filters.priceMax) {
        constraints.push(where('price', '<=', filters.priceMax));
      }
      if (filters.fuelType) {
        constraints.push(where('fuelType', '==', filters.fuelType));
      }
      if (filters.transmission) {
        constraints.push(where('transmission', '==', filters.transmission));
      }
      if (filters.bodyType) {
        console.log('🚗 Adding bodyType filter:', filters.bodyType);
        constraints.push(where('bodyType', '==', filters.bodyType));
      }
      if (filters.color) {
        constraints.push(where('color', '==', filters.color));
      }

      constraints.push(where('isAvailable', '==', true));
      constraints.push(orderBy('createdAt', 'desc'));
      
      console.log('🔍 Query constraints:', constraints);

      try {
        console.log('🔍 Executing query with constraints:', constraints.length, 'constraints');
        const querySnapshot = await getDocs(query(q, ...constraints));
        const vehicles = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        })) as Vehicle[];
        
        console.log('🔍 Query returned', vehicles.length, 'vehicles');
        if (vehicles.length > 0) {
          console.log('🔍 First vehicle bodyType:', vehicles[0].bodyType);
        }
        
        return vehicles;
      } catch (indexError: unknown) {
        console.error('🔍 Query failed with error:', indexError);
        // If the index is still building, try without ordering
        if (indexError instanceof Error && indexError.message && indexError.message.includes('index is currently building')) {
          
          // Remove the orderBy constraint and try again
          const constraintsWithoutOrder = constraints.filter(constraint => 
            !(constraint instanceof Object && 'fieldPath' in constraint && constraint.fieldPath === 'createdAt')
          );
          
          const querySnapshot = await getDocs(query(q, ...constraintsWithoutOrder));
          const vehicles = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate()
          })) as Vehicle[];
          
          console.log('🔍 Fallback query returned', vehicles.length, 'vehicles');
          if (vehicles.length > 0) {
            console.log('🔍 First vehicle bodyType (fallback):', vehicles[0].bodyType);
          }
          
          // Sort in memory as fallback
          return vehicles.sort((a, b) => {
            const dateA = a.createdAt || new Date(0);
            const dateB = b.createdAt || new Date(0);
            return dateB.getTime() - dateA.getTime();
          });
        }
        throw indexError;
      }
    } catch (error) {
      console.error('Error fetching filtered vehicles:', error);
      throw error;
    }
  },

  // Get vehicle by ID
  async getVehicleById(id: string): Promise<Vehicle | null> {
    try {
      const docRef = doc(db, VEHICLES_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate(),
          updatedAt: docSnap.data().updatedAt?.toDate()
        } as Vehicle;
      }
      return null;
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      throw error;
    }
  },

  // Debug function to check database content
  async debugDatabase(): Promise<void> {
    try {
      console.log('🔍 Debugging database content...');
      const querySnapshot = await getDocs(collection(db, VEHICLES_COLLECTION));
      const vehicles = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as { id: string; bodyType?: string; isAvailable?: boolean }[];
      
      console.log('📊 Total vehicles in database:', vehicles.length);
      
      if (vehicles.length > 0) {
        const bodyTypes = [...new Set(vehicles.map(v => v.bodyType))];
        console.log('📊 All bodyTypes in database:', bodyTypes);
        
        const sedanVehicles = vehicles.filter(v => v.bodyType === 'sedan');
        console.log('📊 Sedan vehicles:', sedanVehicles.length);
        if (sedanVehicles.length > 0) {
          console.log('📊 Sample sedan vehicle:', sedanVehicles[0]);
        }
        
        const availableVehicles = vehicles.filter(v => v.isAvailable === true);
        console.log('📊 Available vehicles:', availableVehicles.length);
        
        const availableSedanVehicles = vehicles.filter(v => v.bodyType === 'sedan' && v.isAvailable === true);
        console.log('📊 Available sedan vehicles:', availableSedanVehicles.length);
      }
    } catch (error) {
      console.error('Error debugging database:', error);
    }
  },

  // Get featured vehicles (latest 6)
  async getFeaturedVehicles(): Promise<Vehicle[]> {
    try {
      // First try to get vehicles ordered by createdAt
      let q = query(
        collection(db, VEHICLES_COLLECTION),
        where('isAvailable', '==', true),
        orderBy('createdAt', 'desc'),
        limit(6)
      );
      
      try {
        const querySnapshot = await getDocs(q);
        const vehicles = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        })) as Vehicle[];
        
        if (vehicles.length > 0) {
          return vehicles;
        }
      } catch (orderError) {
        console.log('Could not order by createdAt, trying without ordering:', orderError);
      }
      
      // Fallback: get all available vehicles without ordering
      q = query(
        collection(db, VEHICLES_COLLECTION),
        where('isAvailable', '==', true),
        limit(6)
      );
      
      const querySnapshot = await getDocs(q);
      const vehicles = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Vehicle[];
      
      if (vehicles.length > 0) {
        return vehicles;
      }
      
      // Final fallback: get any vehicles (including sold ones) just to show something
      console.log('No available vehicles found, showing any vehicles as fallback');
      const allVehiclesQuery = query(
        collection(db, VEHICLES_COLLECTION),
        limit(6)
      );
      
      const allVehiclesSnapshot = await getDocs(allVehiclesQuery);
      return allVehiclesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Vehicle[];
      
    } catch (error) {
      console.error('Error fetching featured vehicles:', error);
      // Return empty array instead of throwing to prevent app crash
      return [];
    }
  }
}; 