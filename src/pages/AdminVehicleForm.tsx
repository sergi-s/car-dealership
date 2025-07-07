import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  Upload,
  X,
  Plus
} from 'lucide-react';
import { doc, getDoc, addDoc, updateDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Vehicle } from '../types/vehicle';

const AdminVehicleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [vehicle, setVehicle] = useState<Partial<Vehicle>>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    salePrice: undefined,
    mileage: 0,
    fuelType: 'gasoline',
    transmission: 'automatic',
    bodyType: 'sedan',
    color: '',
    description: '',
    images: [],
    features: [],
    vin: '',
    stockNumber: '',
    isAvailable: true
  });

  useEffect(() => {
    if (isEditing && id) {
      fetchVehicle();
    }
  }, [id, isEditing]);

  const fetchVehicle = async () => {
    if (!id) {
      alert('Vehicle ID is required');
      navigate('/admin/vehicles');
      return;
    }
    
    setLoading(true);
    try {
      const vehicleDoc = await getDoc(doc(db, 'vehicles', id));
      if (vehicleDoc.exists()) {
        setVehicle({ id: vehicleDoc.id, ...vehicleDoc.data() });
      } else {
        alert('Vehicle not found');
        navigate('/admin/vehicles');
      }
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      alert('Error fetching vehicle');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const vehicleData = {
        ...vehicle,
        updatedAt: new Date(),
        createdAt: isEditing ? vehicle.createdAt : new Date()
      };

      if (isEditing && id) {
        await updateDoc(doc(db, 'vehicles', id), vehicleData);
      } else {
        await addDoc(collection(db, 'vehicles'), vehicleData);
      }
      
      navigate('/admin/vehicles');
    } catch (error) {
      console.error('Error saving vehicle:', error);
      alert('Error saving vehicle');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Vehicle, value: string | number | boolean | undefined) => {
    setVehicle(prev => ({ ...prev, [field]: value }));
  };

  const addFeature = () => {
    const feature = prompt('Enter a feature:');
    if (feature && feature.trim()) {
      setVehicle(prev => ({
        ...prev,
        features: [...(prev.features || []), feature.trim()]
      }));
    }
  };

  const removeFeature = (index: number) => {
    setVehicle(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }));
  };

  const addImage = () => {
    const imageUrl = prompt('Enter image URL:');
    if (imageUrl && imageUrl.trim()) {
      setVehicle(prev => ({
        ...prev,
        images: [...(prev.images || []), imageUrl.trim()]
      }));
    }
  };

  const removeImage = (index: number) => {
    setVehicle(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/vehicles')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Vehicles
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
                </h1>
                <p className="mt-2 text-gray-600">
                  {isEditing ? 'Update vehicle information' : 'Add a new vehicle to your inventory'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Make</label>
                  <input
                    type="text"
                    required
                    value={vehicle.make}
                    onChange={(e) => handleInputChange('make', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Model</label>
                  <input
                    type="text"
                    required
                    value={vehicle.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Year</label>
                  <input
                    type="number"
                    required
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    value={vehicle.year}
                    onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={vehicle.price}
                    onChange={(e) => handleInputChange('price', parseInt(e.target.value))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sale Price ($) (Optional)</label>
                  <input
                    type="number"
                    min="0"
                    value={vehicle.salePrice || ''}
                    onChange={(e) => handleInputChange('salePrice', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter sale price for discounts"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mileage</label>
                  <input
                    type="number"
                    min="0"
                    value={vehicle.mileage}
                    onChange={(e) => handleInputChange('mileage', parseInt(e.target.value))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Color</label>
                  <input
                    type="text"
                    value={vehicle.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
                  <select
                    value={vehicle.fuelType}
                    onChange={(e) => handleInputChange('fuelType', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="gasoline">Gasoline</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Transmission</label>
                  <select
                    value={vehicle.transmission}
                    onChange={(e) => handleInputChange('transmission', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="automatic">Automatic</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Body Type</label>
                  <select
                    value={vehicle.bodyType}
                    onChange={(e) => handleInputChange('bodyType', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">VIN (Optional)</label>
                  <input
                    type="text"
                    value={vehicle.vin}
                    onChange={(e) => handleInputChange('vin', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter VIN if available"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock Number (Optional)</label>
                  <input
                    type="text"
                    value={vehicle.stockNumber}
                    onChange={(e) => handleInputChange('stockNumber', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter stock number if available"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                <textarea
                  rows={4}
                  value={vehicle.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter vehicle description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={vehicle.isAvailable}
                      onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Available for sale</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Features</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {vehicle.features?.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={addFeature}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </button>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Images</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {vehicle.images?.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Vehicle ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addImage}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Upload className="h-4 w-4 mr-2" />
                Add Image URL
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/vehicles')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : (isEditing ? 'Update Vehicle' : 'Add Vehicle')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminVehicleForm; 