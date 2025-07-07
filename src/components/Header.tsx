import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVehicleTypesOpen, setIsVehicleTypesOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsVehicleTypesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/inventory', label: 'Browse Inventory' },
    { path: '/about', label: 'About' },
    { path: '/reviews', label: 'Reviews' },
    { path: '/contact', label: 'Contact' },
  ];

  const vehicleTypes = [
    { path: '/vehicles/sedan', label: 'Sedan' },
    { path: '/vehicles/suv', label: 'SUV' },
    { path: '/vehicles/truck', label: 'Truck' },
    { path: '/vehicles/van', label: 'Van' },
    { path: '/vehicles/coupe', label: 'Coupe' },
    { path: '/vehicles/convertible', label: 'Convertible' },
    { path: '/vehicles/wagon', label: 'Wagon' },
    { path: '/vehicles/hatchback', label: 'Hatchback' },
    { path: '/vehicles/atv', label: 'ATV' },
    { path: '/vehicles/motorcycle', label: 'Motorcycle' },
    { path: '/vehicles/camper', label: 'Camper' },
    { path: '/vehicles/cargo-van', label: 'Cargo Van' },
    { path: '/vehicles/minivan', label: 'Minivan' },
    { path: '/vehicles/pickup', label: 'Pickup' },
    { path: '/vehicles/crew-cab', label: 'Crew Cab' },
    { path: '/vehicles/extended-cab', label: 'Extended Cab' },
    { path: '/vehicles/regular-cab', label: 'Regular Cab' },
    { path: '/vehicles/sport-utility', label: 'Sport Utility' },
    { path: '/vehicles/luxury', label: 'Luxury' },
    { path: '/vehicles/classic', label: 'Classic' },
    { path: '/vehicles/recreational', label: 'Recreational' },
    { path: '/vehicles/commercial', label: 'Commercial' },
    { path: '/vehicles/other', label: 'Other' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/images/logo.png" 
              alt="AutoMax Logo" 
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold text-gray-900">AutoMax</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-neutral-700 hover:text-primary-600 hover:bg-neutral-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Vehicle Types Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsVehicleTypesOpen(!isVehicleTypesOpen)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                  location.pathname.startsWith('/vehicles/')
                    ? 'text-yellow-600 bg-yellow-50'
                    : 'text-gray-700 hover:text-yellow-600 hover:bg-gray-50'
                }`}
              >
                <span>Vehicle Types</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isVehicleTypesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isVehicleTypesOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                  <div className="py-1">
                    {vehicleTypes.map((type) => (
                      <Link
                        key={type.path}
                        to={type.path}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          isActive(type.path)
                            ? 'text-yellow-600 bg-yellow-50'
                            : 'text-gray-700 hover:text-yellow-600 hover:bg-gray-50'
                        }`}
                        onClick={() => setIsVehicleTypesOpen(false)}
                      >
                        {type.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-yellow-600 hover:bg-gray-50"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-yellow-600 bg-yellow-50'
                      : 'text-gray-700 hover:text-yellow-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Vehicle Types in Mobile Menu */}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="px-3 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle Types
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {vehicleTypes.slice(0, 12).map((type) => (
                    <Link
                      key={type.path}
                      to={type.path}
                      className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                        isActive(type.path)
                          ? 'text-yellow-600 bg-yellow-50'
                          : 'text-gray-700 hover:text-yellow-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {type.label}
                    </Link>
                  ))}
                </div>
                {vehicleTypes.length > 12 && (
                  <Link
                    to="/inventory"
                    className="block px-3 py-2 rounded-md text-sm text-yellow-600 hover:bg-yellow-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    View All Types →
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 