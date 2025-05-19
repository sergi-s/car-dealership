// FeaturedVehicles.jsx
import { Link } from "react-router-dom";
import VehicleCard from "./VehicleCard";
import { useState, useEffect } from "react";
import vehicleService from "../services/vehicleService";

const FeaturedVehicles = () => {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedVehicles = async () => {
      try {
        // Get vehicles with 'Featured' badge
        const filters = { badge: "Featured" };
        const result = await vehicleService.getVehicles(
          filters,
          { field: "dateAdded", direction: "desc" },
          3,
          1
        );
        setFeaturedVehicles(result.vehicles);
      } catch (error) {
        console.error("Error fetching featured vehicles:", error);
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
              {featuredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
            <div className="view-all">
              {/* <Link to="/inventory" className="btn-secondary">
                View All Vehicles
              </Link> */}
              <Link to="/inventory" className="btn-animated">
                <span className="bg-span">
                  <svg
                    className="icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
                <span className="text-span">View All Vehicles</span>
                <span className="invisible-span">View All Vehicles</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedVehicles;
