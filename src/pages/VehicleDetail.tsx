import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Zap, Settings, Phone, Mail, Car, ChevronLeft, ChevronRight } from 'lucide-react';
import { vehicleService } from '../services/vehicleService';
import type { Vehicle } from '../types/vehicle';

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const loadVehicle = async () => {
      if (!id) return;
      
      try {
        const vehicleData = await vehicleService.getVehicleById(id);
        setVehicle(vehicleData);
      } catch (error) {
        console.error('Error loading vehicle:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVehicle();
  }, [id]);

  // Keyboard navigation for images
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!vehicle || !vehicle.images || vehicle.images.length <= 1) return;
      
      if (event.key === 'ArrowLeft') {
        setSelectedImage(prev => 
          prev > 0 ? prev - 1 : vehicle.images.length - 1
        );
      } else if (event.key === 'ArrowRight') {
        setSelectedImage(prev => 
          prev < vehicle.images.length - 1 ? prev + 1 : 0
        );
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [vehicle]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-US').format(mileage);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vehicle Not Found</h2>
          <p className="text-gray-600 mb-4">The vehicle you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/inventory"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse Inventory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/inventory"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Inventory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vehicle Images */}
          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
              <div className="relative h-96 bg-gray-200">
                {vehicle.images && vehicle.images.length > 0 ? (
                  <img
                    src={vehicle.images[selectedImage]}
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <span className="text-gray-500">No Image Available</span>
                  </div>
                )}
                
                {/* Image Navigation Arrows */}
                {vehicle.images && vehicle.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(prev => 
                        prev > 0 ? prev - 1 : vehicle.images.length - 1
                      )}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={() => setSelectedImage(prev => 
                        prev < vehicle.images.length - 1 ? prev + 1 : 0
                      )}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                    
                    {/* Image Position Indicator */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                      {selectedImage + 1} of {vehicle.images.length}
                    </div>
                  </>
                )}
                
                {!vehicle.isAvailable && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded text-sm font-medium">
                    Sold
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {vehicle.images && vehicle.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {vehicle.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 bg-gray-200 rounded overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Vehicle Info */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>
              
              <div className="text-3xl font-bold text-yellow-600 mb-6">
                {vehicle.salePrice && vehicle.salePrice < vehicle.price ? (
                  <div>
                    <span className="line-through text-gray-400 text-2xl">{formatPrice(vehicle.price)}</span>
                    <div className="text-red-600">{formatPrice(vehicle.salePrice)}</div>
                  </div>
                ) : (
                  formatPrice(vehicle.price)
                )}
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{vehicle.year}</span>
                </div>
                {vehicle.bodyType && vehicle.bodyType.trim() !== '' && (
                  <div className="flex items-center text-gray-600">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full capitalize">
                      {vehicle.bodyType.replace('-', ' ')}
                    </span>
                  </div>
                )}
                {vehicle.mileage > 0 && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{formatMileage(vehicle.mileage)} miles</span>
                  </div>
                )}
                {vehicle.fuelType && vehicle.fuelType.trim() !== '' && (
                  <div className="flex items-center text-gray-600">
                    <Zap className="h-5 w-5 mr-2" />
                    <span className="capitalize">{vehicle.fuelType}</span>
                  </div>
                )}
                {vehicle.transmission && vehicle.transmission.trim() !== '' && (
                  <div className="flex items-center text-gray-600">
                    <Settings className="h-5 w-5 mr-2" />
                    <span className="capitalize">{vehicle.transmission}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{vehicle.description}</p>
              </div>

              {/* Features */}
              {vehicle.features && vehicle.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Features</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {vehicle.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-gray-600">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-yellow-600 text-white py-3 px-4 rounded-md hover:bg-yellow-700 transition-colors font-semibold">
                  <Phone className="h-5 w-5 inline mr-2" />
                  Call Now
                </button>
                <button className="w-full border border-yellow-600 text-yellow-600 py-3 px-4 rounded-md hover:bg-yellow-50 transition-colors font-semibold">
                  <Mail className="h-5 w-5 inline mr-2" />
                  Send Message
                </button>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Make:</span>
                  <span className="ml-2 font-medium">{vehicle.make}</span>
                </div>
                <div>
                  <span className="text-gray-600">Model:</span>
                  <span className="ml-2 font-medium">{vehicle.model}</span>
                </div>
                <div>
                  <span className="text-gray-600">Year:</span>
                  <span className="ml-2 font-medium">{vehicle.year}</span>
                </div>
                {vehicle.mileage > 0 && (
                  <div>
                    <span className="text-gray-600">Mileage:</span>
                    <span className="ml-2 font-medium">{formatMileage(vehicle.mileage)} miles</span>
                  </div>
                )}
                {vehicle.fuelType && vehicle.fuelType.trim() !== '' && (
                  <div>
                    <span className="text-gray-600">Fuel Type:</span>
                    <span className="ml-2 font-medium capitalize">{vehicle.fuelType}</span>
                  </div>
                )}
                {vehicle.transmission && vehicle.transmission.trim() !== '' && (
                  <div>
                    <span className="text-gray-600">Transmission:</span>
                    <span className="ml-2 font-medium capitalize">{vehicle.transmission}</span>
                  </div>
                )}
                {vehicle.bodyType && vehicle.bodyType.trim() !== '' && (
                  <div>
                    <span className="text-gray-600">Body Type:</span>
                    <span className="ml-2 font-medium capitalize">{vehicle.bodyType}</span>
                  </div>
                )}
                {vehicle.color && vehicle.color.trim() !== '' && (
                  <div>
                    <span className="text-gray-600">Color:</span>
                    <span className="ml-2 font-medium">{vehicle.color}</span>
                  </div>
                )}
                {vehicle.vin && vehicle.vin.trim() !== '' && (
                  <div>
                    <span className="text-gray-600">VIN:</span>
                    <span className="ml-2 font-medium">{vehicle.vin}</span>
                  </div>
                )}
                {vehicle.stockNumber && vehicle.stockNumber.trim() !== '' && (
                  <div>
                    <span className="text-gray-600">Stock #:</span>
                    <span className="ml-2 font-medium">{vehicle.stockNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail; 