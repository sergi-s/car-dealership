import { Car, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Car 
                className="h-8 w-8" 
                style={{ color: theme.colors.secondary[400] }}
              />
              <span className="text-xl font-bold">AutoMax</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Your trusted partner for quality vehicles. We offer a wide selection of cars, 
              trucks, and SUVs with competitive financing options and exceptional customer service.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 transition-colors"
                style={{ 
                  '--tw-hover-color': theme.colors.secondary[400],
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.colors.secondary[400];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#9ca3af'; // gray-400
                }}
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 transition-colors"
                style={{ 
                  '--tw-hover-color': theme.colors.secondary[400],
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.colors.secondary[400];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#9ca3af'; // gray-400
                }}
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 transition-colors"
                style={{ 
                  '--tw-hover-color': theme.colors.secondary[400],
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.colors.secondary[400];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#9ca3af'; // gray-400
                }}
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/inventory" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Browse Inventory
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Financing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin 
                  className="h-5 w-5" 
                  style={{ color: theme.colors.secondary[400] }}
                />
                <span className="text-gray-300">123 Auto Drive, City, State 12345</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone 
                  className="h-5 w-5" 
                  style={{ color: theme.colors.secondary[400] }}
                />
                <span className="text-gray-300">(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail 
                  className="h-5 w-5" 
                  style={{ color: theme.colors.secondary[400] }}
                />
                <span className="text-gray-300">info@automax.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 AutoMax. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 