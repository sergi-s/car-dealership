import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car, ArrowRight, Star, Shield, Clock, Users } from 'lucide-react';
import VehicleCard from '../components/VehicleCard';
import BodyTypeIcons from '../components/BodyTypeIcons';
import { vehicleService } from '../services/vehicleService';
import type { Vehicle } from '../types/vehicle';

const Home = () => {
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedVehicles = async () => {
      try {
        const vehicles = await vehicleService.getFeaturedVehicles();
        setFeaturedVehicles(vehicles);
      } catch (error) {
        console.error('Error loading featured vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedVehicles();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/main-banner-220818.jpg)' }}
        ></div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Find Your Perfect
                <span className="text-yellow-300"> Vehicle</span>
              </h1>
              <p className="text-xl mb-8 text-yellow-100">
                Discover quality cars, trucks, and SUVs with competitive financing options. 
                Your trusted partner for all your automotive needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/inventory"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                >
                  Browse Inventory
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/about"
                  className="border-2 border-white text-white hover:bg-white hover:text-yellow-900 px-8 py-3 rounded-lg font-semibold transition-colors duration-200 text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-600 rounded-lg transform rotate-3"></div>
                <div className="relative bg-white rounded-lg p-8 transform -rotate-1">
                  <Car className="h-32 w-32 text-yellow-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                    Quality Guaranteed
                  </h3>
                  <p className="text-gray-600 text-center">
                    All vehicles undergo thorough inspection and come with our quality guarantee.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose AutoMax?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing exceptional service and quality vehicles to our customers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Vehicles</h3>
              <p className="text-gray-600">
                All vehicles are thoroughly inspected and meet our high quality standards.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Warranty Included</h3>
              <p className="text-gray-600">
                Every vehicle comes with a comprehensive warranty for your peace of mind.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Process</h3>
              <p className="text-gray-600">
                Streamlined buying process to get you on the road faster.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Support</h3>
              <p className="text-gray-600">
                Our team of experts is here to help you find the perfect vehicle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Body Type Icons Section */}
      <BodyTypeIcons />

      {/* Featured Vehicles Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Featured Vehicles
              </h2>
              <p className="text-gray-600">
                Check out our latest arrivals and most popular vehicles.
              </p>
            </div>
            <Link
              to="/inventory"
              className="text-yellow-600 hover:text-yellow-700 font-semibold flex items-center"
            >
              View All Vehicles
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}

          {!loading && featuredVehicles.length === 0 && (
            <div className="text-center py-12">
              <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Vehicles Available</h3>
              <p className="text-gray-600">
                Check back soon for our latest inventory updates.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-yellow-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Perfect Vehicle?
          </h2>
          <p className="text-xl mb-8 text-yellow-100">
            Browse our extensive inventory and find the vehicle that fits your lifestyle and budget.
          </p>
          <Link
            to="/inventory"
            className="bg-white text-yellow-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center"
          >
            Start Browsing
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 