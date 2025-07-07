import { Link } from 'react-router-dom';
import { Calendar, MapPin, Zap, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { Vehicle } from '../types/vehicle';
import { useTheme } from '../hooks/useTheme';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { theme } = useTheme();

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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Vehicle Image */}
      <div className="relative h-48 bg-gray-200">
        {vehicle.images && vehicle.images.length > 0 ? (
          <>
            <img
              src={vehicle.images[currentImageIndex]}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover"
            />
            
            {/* Image Navigation */}
            {vehicle.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(prev => 
                      prev > 0 ? prev - 1 : vehicle.images.length - 1
                    );
                  }}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(prev => 
                      prev < vehicle.images.length - 1 ? prev + 1 : 0
                    );
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {vehicle.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex 
                          ? 'bg-white' 
                          : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        {!vehicle.isAvailable && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
            Sold
          </div>
        )}
      </div>

      {/* Vehicle Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h3>
        
        <div 
          className="text-2xl font-bold mb-3"
          style={{ color: theme.colors.secondary[600] }}
        >
          {vehicle.salePrice && vehicle.salePrice < vehicle.price ? (
            <div>
              <span className="line-through text-gray-400 text-lg">{formatPrice(vehicle.price)}</span>
              <div style={{ color: theme.colors.error[600] }}>{formatPrice(vehicle.salePrice)}</div>
            </div>
          ) : (
            formatPrice(vehicle.price)
          )}
        </div>

        {/* Vehicle Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{vehicle.year}</span>
          </div>
          {vehicle.bodyType && vehicle.bodyType.trim() !== '' && (
            <div className="flex items-center text-sm text-gray-600">
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full capitalize">
                {vehicle.bodyType.replace('-', ' ')}
              </span>
            </div>
          )}
          {vehicle.mileage > 0 && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{formatMileage(vehicle.mileage)} miles</span>
            </div>
          )}
          {vehicle.fuelType && vehicle.fuelType.trim() !== '' && (
            <div className="flex items-center text-sm text-gray-600">
              <Zap className="h-4 w-4 mr-2" />
              <span className="capitalize">{vehicle.fuelType}</span>
            </div>
          )}
          {vehicle.transmission && vehicle.transmission.trim() !== '' && (
            <div className="flex items-center text-sm text-gray-600">
              <Settings className="h-4 w-4 mr-2" />
              <span className="capitalize">{vehicle.transmission}</span>
            </div>
          )}
        </div>

        {/* Features */}
        {vehicle.features && vehicle.features.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {vehicle.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-full"
                  style={{
                    backgroundColor: theme.colors.secondary[100],
                    color: theme.colors.secondary[800]
                  }}
                >
                  {feature}
                </span>
              ))}
              {vehicle.features.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{vehicle.features.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <Link
          to={`/vehicle/${vehicle.id}`}
          style={{
            backgroundColor: theme.colors.primary[600],
            color: 'white',
            borderRadius: theme.borderRadius.md,
            boxShadow: theme.shadows.sm,
          }}
          className="block w-full text-center py-3 px-4 hover:shadow-md transition-all font-semibold"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.primary[700];
            e.currentTarget.style.boxShadow = theme.shadows.md;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.primary[600];
            e.currentTarget.style.boxShadow = theme.shadows.sm;
          }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default VehicleCard; 