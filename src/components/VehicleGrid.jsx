// VehicleGrid.jsx
import VehicleCard from './VehicleCard';

const VehicleGrid = ({ vehicles, viewMode }) => {
  return (
    <div className={`vehicle-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
      {vehicles.map(vehicle => (
        <VehicleCard 
          key={vehicle.id} 
          vehicle={{...vehicle, compareButton: true}} 
        />
      ))}
    </div>
  );
};

export default VehicleGrid;