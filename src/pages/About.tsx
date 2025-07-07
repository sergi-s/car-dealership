import { Car, Award, Users, Clock, MapPin, Phone, Mail } from 'lucide-react';
import WorkingHoursDisplay from '../components/WorkingHoursDisplay';
import { useTheme } from '../hooks/useTheme';

const About = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About AutoMax</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Your trusted partner for quality vehicles and exceptional service since 2010
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                AutoMax was founded in 2010 with a simple mission: to provide quality vehicles 
                and exceptional service to our community. What started as a small family-owned 
                dealership has grown into one of the most trusted names in the automotive industry.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Over the years, we've helped thousands of customers find their perfect vehicle, 
                whether it's a reliable family car, a powerful truck for work, or a stylish SUV 
                for adventure. Our commitment to quality, transparency, and customer satisfaction 
                has never wavered.
              </p>
              <p className="text-lg text-gray-600">
                Today, we continue to uphold the values that made us successful: integrity, 
                quality, and putting our customers first. Every vehicle in our inventory 
                undergoes a thorough inspection, and every customer receives personalized 
                attention from our experienced team.
              </p>
            </div>
            <div className="relative">
              <div className="bg-yellow-600 rounded-lg p-8 text-white">
                <Car className="h-16 w-16 mb-4" />
                <h3 className="text-2xl font-bold mb-4">Quality Guaranteed</h3>
                <p className="text-yellow-100">
                  All vehicles undergo a comprehensive 150-point inspection and come with 
                  our quality guarantee. We stand behind every vehicle we sell.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and ensure we provide the best 
              experience for our customers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality</h3>
              <p className="text-gray-600">
                We never compromise on quality. Every vehicle meets our high standards 
                before joining our inventory.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Integrity</h3>
              <p className="text-gray-600">
                Honest, transparent, and fair in all our dealings. Your trust is our 
                most valuable asset.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Service</h3>
              <p className="text-gray-600">
                Exceptional customer service is our priority. We're here to help you 
                every step of the way.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Car className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">
                We stay ahead of industry trends and technology to provide you with 
                the best options available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the dedicated professionals who make AutoMax the trusted choice 
              for quality vehicles and exceptional service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-24 h-24 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-12 w-12 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">John Smith</h3>
              <p className="text-yellow-600 font-medium mb-2">General Manager</p>
              <p className="text-gray-600">
                With over 15 years of experience, John leads our team with expertise 
                and dedication to customer satisfaction.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-24 h-24 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-12 w-12 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sarah Johnson</h3>
              <p className="text-yellow-600 font-medium mb-2">Sales Manager</p>
              <p className="text-gray-600">
                Sarah's passion for helping customers find their perfect vehicle 
                makes her an invaluable member of our team.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-24 h-24 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-12 w-12 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mike Davis</h3>
              <p className="text-yellow-600 font-medium mb-2">Service Manager</p>
              <p className="text-gray-600">
                Mike ensures every vehicle meets our quality standards and provides 
                expert service to keep your vehicle running smoothly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Visit Us</h2>
            <p className="text-lg text-gray-600">
              Come see our inventory in person and meet our team.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div 
                className="rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: theme.colors.secondary[100] }}
              >
                <MapPin 
                  className="h-8 w-8" 
                  style={{ color: theme.colors.secondary[600] }}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">
                123 Auto Drive<br />
                City, State 12345
              </p>
            </div>
            
            <div className="text-center">
              <div 
                className="rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: theme.colors.secondary[100] }}
              >
                <Phone 
                  className="h-8 w-8" 
                  style={{ color: theme.colors.secondary[600] }}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600">
                (555) 123-4567<br />
                (555) 123-4568
              </p>
            </div>
            
            <div className="text-center">
              <div 
                className="rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: theme.colors.secondary[100] }}
              >
                <Mail 
                  className="h-8 w-8" 
                  style={{ color: theme.colors.secondary[600] }}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">
                info@automax.com<br />
                sales@automax.com
              </p>
            </div>
          </div>
          
          {/* Working Hours */}
          <div className="mt-12 max-w-2xl mx-auto">
            <WorkingHoursDisplay />
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 