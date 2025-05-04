// FeaturedVehicles.jsx
import { Link } from 'react-router-dom';
import VehicleCard from './VehicleCard';
import { useState, useEffect } from 'react';
import { vehicleService } from '../services/vehicleService';

const FeaturedVehicles = () => {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchFeaturedVehicles = async () => {
      try {
        // Get vehicles with 'Featured' badge
        const filters = { badge: 'Featured' };
        const result = await vehicleService.getVehicles(filters, { field: 'dateAdded', direction: 'desc' }, 3, 1);
        setFeaturedVehicles(result.vehicles);
      } catch (error) {
        console.error('Error fetching featured vehicles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedVehicles();
  }, []);
  
  return (
    <section className="featured-vehicles">
      <div className="container">
        <h2>Featured Vehicles</h2>
        {loading ? (
          <div className="loading">Loading featured vehicles...</div>
        ) : (
          <>
            <div className="vehicle-grid">
              {featuredVehicles.map(vehicle => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
            <div className="view-all">
              <Link to="/inventory" className="btn-secondary">View All Vehicles</Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedVehicles;