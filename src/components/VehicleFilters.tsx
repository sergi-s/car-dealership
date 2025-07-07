import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import type { VehicleFilters } from '../types/vehicle';
import { useTheme } from '../hooks/useTheme';

interface VehicleFiltersProps {
  filters: VehicleFilters;
  onFiltersChange: (filters: VehicleFilters) => void;
  onClearFilters: () => void;
}

const VehicleFiltersComponent = ({ filters, onFiltersChange, onClearFilters }: VehicleFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme } = useTheme();

  const handleFilterChange = (key: keyof VehicleFilters, value: string | number | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter 
            className="h-5 w-5" 
            style={{ color: theme.colors.secondary[600] }}
          />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4" />
              <span>Clear All</span>
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ 
              color: theme.colors.secondary[600],
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = theme.colors.secondary[700];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = theme.colors.secondary[600];
            }}
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        </div>
      </div>

      {/* Basic Filters (Always Visible) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Make */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
          <input
            type="text"
            value={filters.make || ''}
            onChange={(e) => handleFilterChange('make', e.target.value || undefined)}
            placeholder="e.g., Toyota"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
            style={{
              '--tw-ring-color': theme.colors.secondary[500],
            } as React.CSSProperties}
          />
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
          <input
            type="text"
            value={filters.model || ''}
            onChange={(e) => handleFilterChange('model', e.target.value || undefined)}
            placeholder="e.g., Camry"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
            style={{
              '--tw-ring-color': theme.colors.secondary[500],
            } as React.CSSProperties}
          />
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
          <input
            type="number"
            value={filters.priceMax || ''}
            onChange={(e) => handleFilterChange('priceMax', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="e.g., 25000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
            style={{
              '--tw-ring-color': theme.colors.secondary[500],
            } as React.CSSProperties}
          />
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Year Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Year</label>
              <input
                type="number"
                value={filters.yearMin || ''}
                onChange={(e) => handleFilterChange('yearMin', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="e.g., 2020"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{
                  '--tw-ring-color': theme.colors.secondary[500],
                } as React.CSSProperties}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Year</label>
              <input
                type="number"
                value={filters.yearMax || ''}
                onChange={(e) => handleFilterChange('yearMax', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="e.g., 2024"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{
                  '--tw-ring-color': theme.colors.secondary[500],
                } as React.CSSProperties}
              />
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
              <select
                value={filters.fuelType || ''}
                onChange={(e) => handleFilterChange('fuelType', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{
                  '--tw-ring-color': theme.colors.secondary[500],
                } as React.CSSProperties}
              >
                <option value="">All Types</option>
                <option value="gasoline">Gasoline</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
              <select
                value={filters.transmission || ''}
                onChange={(e) => handleFilterChange('transmission', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{
                  '--tw-ring-color': theme.colors.secondary[500],
                } as React.CSSProperties}
              >
                <option value="">All Transmissions</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>

            {/* Body Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Body Type</label>
              <select
                value={filters.bodyType || ''}
                onChange={(e) => handleFilterChange('bodyType', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{
                  '--tw-ring-color': theme.colors.secondary[500],
                } as React.CSSProperties}
              >
                <option value="">All Body Types</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="truck">Truck</option>
                <option value="coupe">Coupe</option>
                <option value="convertible">Convertible</option>
                <option value="wagon">Wagon</option>
                <option value="hatchback">Hatchback</option>
                <option value="van">Van</option>
                <option value="atv">ATV</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="camper">Camper</option>
                <option value="cargo-van">Cargo Van</option>
                <option value="minivan">Minivan</option>
                <option value="pickup">Pickup</option>
                <option value="crew-cab">Crew Cab</option>
                <option value="extended-cab">Extended Cab</option>
                <option value="regular-cab">Regular Cab</option>
                <option value="sport-utility">Sport Utility</option>
                <option value="luxury">Luxury</option>
                <option value="classic">Classic</option>
                <option value="recreational">Recreational</option>
                <option value="commercial">Commercial</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                type="text"
                value={filters.color || ''}
                onChange={(e) => handleFilterChange('color', e.target.value || undefined)}
                placeholder="e.g., Red"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{
                  '--tw-ring-color': theme.colors.secondary[500],
                } as React.CSSProperties}
              />
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
              <input
                type="number"
                value={filters.priceMin || ''}
                onChange={(e) => handleFilterChange('priceMin', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="e.g., 10000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{
                  '--tw-ring-color': theme.colors.secondary[500],
                } as React.CSSProperties}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleFiltersComponent; 