import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import VehicleCard from '../components/VehicleCard';
import VehicleFiltersComponent from '../components/VehicleFilters';
import { vehicleService } from '../services/vehicleService';
import type { Vehicle, VehicleFilters as VehicleFiltersType } from '../types/vehicle';

const Inventory = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<VehicleFiltersType>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showSoldCars, setShowSoldCars] = useState(false);

  // Load saved settings from localStorage
  useEffect(() => {
    const savedFilters = localStorage.getItem('vehicleFilters');
    const savedSearchTerm = localStorage.getItem('vehicleSearchTerm');
    const savedShowSoldCars = localStorage.getItem('vehicleShowSoldCars');

    if (savedFilters) {
      try {
        setFilters(JSON.parse(savedFilters));
      } catch (error) {
        console.error('Error parsing saved filters:', error);
      }
    }
    if (savedSearchTerm) {
      setSearchTerm(savedSearchTerm);
    }
    if (savedShowSoldCars) {
      setShowSoldCars(JSON.parse(savedShowSoldCars));
    }
  }, []);

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const allVehicles = await vehicleService.getAllVehicles();
        setVehicles(allVehicles);
        setFilteredVehicles(allVehicles);
      } catch (error) {
        console.error('Error loading vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('vehicleFilters', JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    localStorage.setItem('vehicleSearchTerm', searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    localStorage.setItem('vehicleShowSoldCars', JSON.stringify(showSoldCars));
  }, [showSoldCars]);

  useEffect(() => {
    let filtered = vehicles;

    // Apply sold cars filter
    if (!showSoldCars) {
      filtered = filtered.filter(vehicle => vehicle.isAvailable);
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        vehicle =>
          vehicle.make.toLowerCase().includes(searchLower) ||
          vehicle.model.toLowerCase().includes(searchLower) ||
          vehicle.year.toString().includes(searchLower) ||
          vehicle.color.toLowerCase().includes(searchLower)
      );
    }

    // Apply other filters
    if (filters.make) {
      filtered = filtered.filter(vehicle => 
        vehicle.make.toLowerCase().includes(filters.make!.toLowerCase())
      );
    }
    if (filters.model) {
      filtered = filtered.filter(vehicle => 
        vehicle.model.toLowerCase().includes(filters.model!.toLowerCase())
      );
    }
    if (filters.yearMin) {
      filtered = filtered.filter(vehicle => vehicle.year >= filters.yearMin!);
    }
    if (filters.yearMax) {
      filtered = filtered.filter(vehicle => vehicle.year <= filters.yearMax!);
    }
    if (filters.priceMin) {
      filtered = filtered.filter(vehicle => vehicle.price >= filters.priceMin!);
    }
    if (filters.priceMax) {
      filtered = filtered.filter(vehicle => vehicle.price <= filters.priceMax!);
    }
    if (filters.fuelType) {
      filtered = filtered.filter(vehicle => vehicle.fuelType === filters.fuelType);
    }
    if (filters.transmission) {
      filtered = filtered.filter(vehicle => vehicle.transmission === filters.transmission);
    }
    if (filters.bodyType) {
      filtered = filtered.filter(vehicle => vehicle.bodyType === filters.bodyType);
    }
    if (filters.color) {
      filtered = filtered.filter(vehicle => 
        vehicle.color.toLowerCase().includes(filters.color!.toLowerCase())
      );
    }

    setFilteredVehicles(filtered);
  }, [vehicles, searchTerm, filters, showSoldCars]);

  const handleFiltersChange = (newFilters: VehicleFiltersType) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setShowSoldCars(false);
    // Clear localStorage
    localStorage.removeItem('vehicleFilters');
    localStorage.removeItem('vehicleSearchTerm');
    localStorage.removeItem('vehicleShowSoldCars');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Inventory</h1>
          <p className="text-gray-600">
            Find your perfect vehicle from our extensive selection of quality cars, trucks, and SUVs.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by make, model, year, or color..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              {/* Show Sold Cars Toggle */}
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSoldCars}
                  onChange={(e) => setShowSoldCars(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Show Sold Cars</span>
              </label>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <VehicleFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg" />
            ))
          ) : filteredVehicles.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12">
              No vehicles found matching your criteria.
            </div>
          ) : (
            filteredVehicles.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory; 