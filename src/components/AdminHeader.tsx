import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Car, Menu, X, Settings, BarChart3, Clock, MessageSquare, Star } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const AdminHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: BarChart3 },
    { path: '/admin/vehicles', label: 'Vehicles', icon: Car },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin/working-hours', label: 'Working Hours', icon: Clock },
    { path: '/admin/contact-messages', label: 'Contact Messages', icon: MessageSquare },
    { path: '/admin/reviews', label: 'Reviews', icon: Star },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/admin" className="flex items-center space-x-2">
            <img 
              src="/images/logo.png" 
              alt="AutoMax Logo" 
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold">AutoMax Admin</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-yellow-400 bg-gray-800'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Admin Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-300 hover:text-white text-sm"
            >
              View Site
            </Link>
            <div className="w-px h-6 bg-gray-700"></div>
            <button 
              onClick={handleLogout}
              className="text-gray-300 hover:text-white text-sm"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900 border-t border-gray-700">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive(item.path)
                        ? 'text-yellow-400 bg-gray-800'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-gray-700">
                <Link
                  to="/"
                  className="flex items-center px-3 py-2 text-gray-300 hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  View Site
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-gray-300 hover:text-white"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader; 