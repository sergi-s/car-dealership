// VehicleCard.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const VehicleCard = ({ vehicle }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const toggleFavorite = (e) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const formatMileage = (mileage) => {
    return new Intl.NumberFormat('en-US').format(mileage) + ' mi';
  };
  
  return (
    <div className="vehicle-card">
      <div className="vehicle-image">
        <img src={vehicle.image} alt={vehicle.title} />
        {vehicle.badge && <span className="badge">{vehicle.badge}</span>}
        <button className="btn-favorite" onClick={toggleFavorite}>
          <i className={isFavorite ? 'fas fa-heart' : 'far fa-heart'}></i>
        </button>
      </div>
      <div className="vehicle-info">
        <h3>{vehicle.title}</h3>
        <p className="price">{formatPrice(vehicle.price)}</p>
        <ul className="specs">
          <li>
            <i className="fas fa-tachometer-alt"></i> {formatMileage(vehicle.mileage)}
          </li>
          <li>
            {vehicle.fuelType === 'Electric' ? 
              <i className="fas fa-bolt"></i> : 
              <i className="fas fa-gas-pump"></i>} {vehicle.fuelType}
          </li>
          <li><i className="fas fa-cog"></i> {vehicle.transmission}</li>
          {vehicle.drivetrain && (
            <li><i className="fas fa-road"></i> {vehicle.drivetrain}</li>
          )}
        </ul>
        <div className="vehicle-actions">
          <Link to={`/inventory/${vehicle.id}`} className="btn-secondary">View Details</Link>
          {vehicle.compareButton && (
            <Link to={`/compare/${vehicle.id}`} className="btn-outline">Compare</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;