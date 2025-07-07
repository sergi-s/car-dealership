import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Car
} from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Vehicle } from '../types/vehicle';

const AdminAnalytics = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const vehiclesRef = collection(db, 'vehicles');
      const snapshot = await getDocs(vehiclesRef);
      const vehiclesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Vehicle[];
      
      setVehicles(vehiclesData);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate analytics
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter(v => v.isAvailable).length;
  const soldVehicles = totalVehicles - availableVehicles;
  const totalValue = vehicles.reduce((sum, v) => sum + v.price, 0);
  const averagePrice = totalVehicles > 0 ? totalValue / totalVehicles : 0;

  // Vehicle makes distribution
  const makeDistribution = vehicles.reduce((acc, vehicle) => {
    acc[vehicle.make] = (acc[vehicle.make] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topMakes = Object.entries(makeDistribution)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-2 text-gray-600">Business insights and performance metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Inventory</p>
                <p className="text-2xl font-bold text-gray-900">{totalVehicles}</p>
                <p className="text-xs text-gray-500">vehicles</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">{availableVehicles}</p>
                <p className="text-xs text-gray-500">
                  {totalVehicles > 0 ? `${((availableVehicles / totalVehicles) * 100).toFixed(1)}%` : '0%'} of total
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sold</p>
                <p className="text-2xl font-bold text-gray-900">{soldVehicles}</p>
                <p className="text-xs text-gray-500">
                  {totalVehicles > 0 ? `${((soldVehicles / totalVehicles) * 100).toFixed(1)}%` : '0%'} of total
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${Math.round(averagePrice).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">per vehicle</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Make Distribution */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Top Vehicle Makes</h2>
            </div>
            <div className="p-6">
              {topMakes.length > 0 ? (
                <div className="space-y-4">
                  {topMakes.map(([make, count]) => (
                    <div key={make} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{make}</span>
                      <div className="flex items-center space-x-4">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(count / totalVehicles) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8 text-right">
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No vehicles found</p>
              )}
            </div>
          </div>

          {/* Price Range Distribution */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Price Distribution</h2>
            </div>
            <div className="p-6">
              {vehicles.length > 0 ? (
                <div className="space-y-4">
                  {[
                    { label: 'Under $10k', filter: (v: Vehicle) => v.price < 10000 },
                    { label: '$10k - $25k', filter: (v: Vehicle) => v.price >= 10000 && v.price < 25000 },
                    { label: '$25k - $50k', filter: (v: Vehicle) => v.price >= 25000 && v.price < 50000 },
                    { label: '$50k - $100k', filter: (v: Vehicle) => v.price >= 50000 && v.price < 100000 },
                    { label: 'Over $100k', filter: (v: Vehicle) => v.price >= 100000 },
                  ].map(({ label, filter }) => {
                    const count = vehicles.filter(filter).length;
                    return (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{label}</span>
                        <div className="flex items-center space-x-4">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${(count / totalVehicles) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No vehicles found</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            {vehicles.length > 0 ? (
              <div className="space-y-4">
                {vehicles
                  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                  .slice(0, 5)
                  .map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </p>
                        <p className="text-xs text-gray-500">
                          Updated {new Date(vehicle.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          vehicle.isAvailable
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {vehicle.isAvailable ? 'Available' : 'Sold'}
                        </span>
                        <span className="text-sm text-gray-600">
                          ${vehicle.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics; 