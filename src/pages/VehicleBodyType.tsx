import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Car } from 'lucide-react';
import VehicleCard from '../components/VehicleCard';
import VehicleFiltersComponent from '../components/VehicleFilters';
import { vehicleService } from '../services/vehicleService';
import type { Vehicle, VehicleFilters as VehicleFiltersType } from '../types/vehicle';

const VehicleBodyType = () => {
  const { bodyType } = useParams<{ bodyType: string }>();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<VehicleFiltersType>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Body type display names
  const bodyTypeNames: Record<string, string> = {
    'sedan': 'Sedan',
    'suv': 'SUV',
    'truck': 'Truck',
    'coupe': 'Coupe',
    'convertible': 'Convertible',
    'wagon': 'Wagon',
    'hatchback': 'Hatchback',
    'van': 'Van',
    'atv': 'ATV',
    'motorcycle': 'Motorcycle',
    'camper': 'Camper',
    'cargo-van': 'Cargo Van',
    'minivan': 'Minivan',
    'pickup': 'Pickup',
    'crew-cab': 'Crew Cab',
    'extended-cab': 'Extended Cab',
    'regular-cab': 'Regular Cab',
    'sport-utility': 'Sport Utility',
    'luxury': 'Luxury',
    'classic': 'Classic',
    'recreational': 'Recreational',
    'commercial': 'Commercial',
    'other': 'Other'
  };

  const displayName = bodyType ? bodyTypeNames[bodyType] || bodyType : 'Unknown';

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoading(true);
        // Set the body type filter
        const bodyTypeFilters: VehicleFiltersType = {
          bodyType: bodyType
        };
        const filteredVehicles = await vehicleService.getVehiclesWithFilters(bodyTypeFilters);
        setVehicles(filteredVehicles);
        setFilteredVehicles(filteredVehicles);
      } catch (error) {
        console.error('Error loading vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    if (bodyType) {
      loadVehicles();
    }
  }, [bodyType]);

  useEffect(() => {
    let filtered = vehicles;

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

    // Apply other filters (excluding body type since it's already filtered)
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
    if (filters.color) {
      filtered = filtered.filter(vehicle => 
        vehicle.color.toLowerCase().includes(filters.color!.toLowerCase())
      );
    }

    setFilteredVehicles(filtered);
  }, [vehicles, searchTerm, filters]);

  const handleFiltersChange = (newFilters: VehicleFiltersType) => {
    // Don't allow body type to be changed on this page
    const otherFilters = { ...newFilters };
    delete otherFilters.bodyType;
    setFilters(otherFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              to="/"
              className="flex items-center text-blue-600 hover:text-blue-700 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
            <Link
              to="/inventory"
              className="text-blue-600 hover:text-blue-700"
            >
              View All Vehicles
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {displayName} Vehicles
          </h1>
          <p className="text-gray-600">
            Browse our selection of {displayName.toLowerCase()} vehicles. 
            {filteredVehicles.length > 0 && (
              <span className="ml-2 font-medium">
                {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? 's' : ''} available
              </span>
            )}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search vehicles by make, model, year, or color..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Filters */}
        <VehicleFiltersComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No {displayName} Vehicles Found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || Object.keys(filters).length > 0
                ? "Try adjusting your search criteria or filters."
                : `We don't have any ${displayName.toLowerCase()} vehicles in our inventory right now.`
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleClearFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
              >
                Clear Filters
              </button>
              <Link
                to="/inventory"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 text-center"
              >
                View All Vehicles
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleBodyType; 