import { getFirestore, collection, getDocs, query, where, orderBy, limit, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { app } from '../firebase';

const db = getFirestore(app);
const vehiclesCollection = collection(db, 'vehicles');

export const vehicleService = {
  /**
   * Fetch vehicles with optional filtering
   * @param {Object} filters - Filter criteria for vehicles
   * @param {Object} sorting - Sorting criteria
   * @param {number} pageSize - Number of results per page
   * @param {number} pageNumber - Page number for pagination
   * @returns {Promise<{vehicles: Array, totalCount: number}>}
   */
  async getVehicles(filters = {}, sorting = { field: 'price', direction: 'asc' }, pageSize = 10, pageNumber = 1) {
    try {
      console.log('[getVehicles] Called with:', {
        filters,
        sorting,
        pageSize,
        pageNumber
      });

      let vehicleQuery = query(vehiclesCollection);

      // Apply filters if provided
      if (filters.make) {
        console.log('[getVehicles] Applying filter: make =', filters.make);
        vehicleQuery = query(vehicleQuery, where('make', '==', filters.make));
      }

      if (filters.model) {
        console.log('[getVehicles] Applying filter: model =', filters.model);
        vehicleQuery = query(vehicleQuery, where('model', '==', filters.model));
      }

      // Price filters
      if (filters.minPrice) {
        console.log('[getVehicles] Applying filter: minPrice >=', filters.minPrice);
        vehicleQuery = query(vehicleQuery, where('price', '>=', Number(filters.minPrice)));
      }

      if (filters.maxPrice) {
        console.log('[getVehicles] Applying filter: maxPrice <=', filters.maxPrice);
        vehicleQuery = query(vehicleQuery, where('price', '<=', Number(filters.maxPrice)));
      }

      // Year filters
      if (filters.minYear) {
        console.log('[getVehicles] Applying filter: minYear >=', filters.minYear);
        vehicleQuery = query(vehicleQuery, where('year', '>=', Number(filters.minYear)));
      }

      if (filters.maxYear) {
        console.log('[getVehicles] Applying filter: maxYear <=', filters.maxYear);
        vehicleQuery = query(vehicleQuery, where('year', '<=', Number(filters.maxYear)));
      }

      // Mileage filters
      if (filters.minMileage) {
        console.log('[getVehicles] Applying filter: minMileage >=', filters.minMileage);
        vehicleQuery = query(vehicleQuery, where('mileage', '>=', Number(filters.minMileage)));
      }

      if (filters.maxMileage) {
        console.log('[getVehicles] Applying filter: maxMileage <=', filters.maxMileage);
        vehicleQuery = query(vehicleQuery, where('mileage', '<=', Number(filters.maxMileage)));
      }

      // Fuel type filter
      if (filters.fuelType) {
        console.log('[getVehicles] Applying filter: fuelType =', filters.fuelType);
        vehicleQuery = query(vehicleQuery, where('fuelType', '==', filters.fuelType));
      }

      // Badge filter
      if (filters.badge) {
        console.log('[getVehicles] Applying filter: badge =', filters.badge);
        vehicleQuery = query(vehicleQuery, where('badge', '==', filters.badge));
      }

      // Apply sorting
      console.log('[getVehicles] Applying sorting:', sorting);
      vehicleQuery = query(vehicleQuery, orderBy(sorting.field, sorting.direction));

      // Apply pagination (basic implementation)
      console.log('[getVehicles] Applying pagination: limit =', pageSize);
      vehicleQuery = query(vehicleQuery, limit(pageSize));

      console.log('[getVehicles] Final query constructed. Fetching data...');

      // Fetch filtered and sorted vehicles
      const vehicleSnapshot = await getDocs(vehicleQuery);
      console.log('[getVehicles] Vehicles fetched:', vehicleSnapshot.size);

      // Get total count of all vehicles (no filters applied)
      const countSnapshot = await getDocs(vehiclesCollection);
      const totalCount = countSnapshot.size;
      console.log('[getVehicles] Total vehicles in collection:', totalCount);

      const vehicles = vehicleSnapshot.docs.map(doc => {
        const data = doc.data();
        const vehicle = {
          id: doc.id,
          image: data.image || '/api/placeholder/320/240',
          title: data.title || `${data.year} ${data.make} ${data.model}`,
          price: data.price,
          mileage: data.mileage,
          fuelType: data.fuelType,
          transmission: data.transmission,
          drivetrain: data.drivetrain,
          badge: data.badge
        };
        return vehicle;
      });

      console.log('[getVehicles] Returning result with', vehicles.length, 'vehicles.');
      return { vehicles, totalCount };
    } catch (error) {
      console.error('[getVehicles] Error occurred:', error);
      throw error;
    }
  },

  /**
   * Get a single vehicle by ID
   * @param {string} id - Vehicle ID
   * @returns {Promise<Object>}
   */
  async getVehicleById(id) {
    console.log('[getVehicleById] Called with ID:', id);
    const ref = doc(db, 'vehicles', id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      throw new Error(`Vehicle with ID ${id} not found`);
    }
    return { id: snap.id, ...snap.data() };
  },

  /**
   * Create a new vehicle
   */
  async createVehicle(data) {
    const ref = collection(db, 'vehicles');
    const docRef = await addDoc(ref, data);
    return docRef.id;
  },

  /**
   * Update existing vehicle by ID
   */
  async updateVehicle(id, data) {
    const ref = doc(db, 'vehicles', id);
    await updateDoc(ref, data);
  },

  /**
   * Delete vehicle by ID
   */
  async deleteVehicle(id) {
    const ref = doc(db, 'vehicles', id);
    await deleteDoc(ref);
  }
};
