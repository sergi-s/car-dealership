// InventoryFilterPanel.jsx
import { useState } from 'react';
import FilterGroup from './FilterGroup';
import RangeSlider from './RangeSlider';
import ColorOptions from './ColorOptions';

const InventoryFilterPanel = ({ onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

  const togglePanel = () => {
    setIsExpanded(!isExpanded);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newFilters = {};
    for (let [key, value] of formData.entries()) {
      if (newFilters[key]) {
        newFilters[key] = Array.isArray(newFilters[key])
          ? [...newFilters[key], value]
          : [newFilters[key], value];
      } else {
        newFilters[key] = value;
      }
    }
    setActiveFilters(Object.keys(newFilters));
    onFilterChange(newFilters);
  };

  const handleFormReset = () => {
    setActiveFilters([]);
    onFilterChange({});
  };

  return (
    <section className="inventory-filter">
      <div className="container">
        <div className="filter-toggle">
          <button className="btn-filter-toggle" onClick={togglePanel}>
            <i className="fas fa-filter"></i> Filters <span className="filter-count">{activeFilters.length}</span>
          </button>
        </div>

        <div className={`filter-panel ${isExpanded ? 'expanded' : ''}`}>
          <form className="filter-form" onSubmit={handleFormSubmit}>
            <FilterGroup
              title="Vehicle Type"
              options={[
                { value: 'sedan', label: 'Sedan', count: 42 },
                { value: 'suv', label: 'SUV', count: 36 },
                { value: 'coupe', label: 'Coupe', count: 24 },
                { value: 'convertible', label: 'Convertible', count: 18 },
                { value: 'truck', label: 'Truck', count: 12 }
              ]}
              name="body_type"
            />

            <FilterGroup
              title="Make"
              options={[
                { value: 'audi', label: 'Audi', count: 28 },
                { value: 'bmw', label: 'BMW', count: 32 },
                { value: 'mercedes', label: 'Mercedes-Benz', count: 30 },
                { value: 'porsche', label: 'Porsche', count: 18 },
                { value: 'lexus', label: 'Lexus', count: 24 }
              ]}
              name="make"
              showMoreButton={true}
            />

            {/* Model dropdown - dependent on make selection */}
            <div className="filter-group">
              <h3>Model</h3>
              <select className="filter-select" name="model" disabled>
                <option value="">Select Make First</option>
              </select>
            </div>

            <RangeSlider
              title="Year"
              min={2000}
              max={2025}
              initialMin={2018}
              initialMax={2025}
              nameMin="minYear" nameMax="maxYear"
              formatValue={val => val.toString()}
            />

            <RangeSlider
              title="Price Range"
              min={0}
              max={200000}
              initialMin={30000}
              initialMax={150000}
              nameMin="minPrice" nameMax="maxPrice"
              formatValue={val => `$${new Intl.NumberFormat().format(val)}${val === 200000 ? '+' : ''}`}
            />

            <RangeSlider
              title="Mileage"
              min={0}
              max={100000}
              initialMin={0}
              initialMax={50000}
              nameMin="minMileage" nameMax="maxMileage"
              formatValue={val => `${new Intl.NumberFormat().format(val)} mi`}
            />

            <FilterGroup
              title="Fuel Type"
              options={[
                { value: 'gasoline', label: 'Gasoline', count: 68 },
                { value: 'diesel', label: 'Diesel', count: 24 },
                { value: 'hybrid', label: 'Hybrid', count: 18 },
                { value: 'electric', label: 'Electric', count: 12 }
              ]}
              name="fuel"
            />

            <FilterGroup
              title="Transmission"
              options={[
                { value: 'automatic', label: 'Automatic', count: 98 },
                { value: 'manual', label: 'Manual', count: 24 }
              ]}
              name="transmission"
            />

            <FilterGroup
              title="Drive Train"
              options={[
                { value: 'awd', label: 'AWD', count: 42 },
                { value: 'fwd', label: 'FWD', count: 28 },
                { value: 'rwd', label: 'RWD', count: 54 },
                { value: '4wd', label: '4WD', count: 8 }
              ]}
              name="drivetrain"
            />

            <ColorOptions
              title="Color"
              colors={[
                { value: 'black', color: '#000000', title: 'Black' },
                { value: 'white', color: '#FFFFFF', title: 'White' },
                { value: 'silver', color: '#C0C0C0', title: 'Silver' },
                { value: 'gray', color: '#808080', title: 'Gray' },
                { value: 'red', color: '#FF0000', title: 'Red' },
                { value: 'blue', color: '#0000FF', title: 'Blue' },
                { value: 'green', color: '#008000', title: 'Green' },
                { value: 'brown', color: '#A52A2A', title: 'Brown' }
              ]}
              name="exterior_color"
            />

            <FilterGroup
              title="Other"
              options={[
                { value: 'true', label: 'Certified Pre-Owned', count: 45, name: 'certified' },
                { value: 'true', label: 'New Arrivals', count: 28, name: 'new' },
                { value: 'true', label: 'Special Offers', count: 15, name: 'special' }
              ]}
              useIndividualNames={true}
            />

            <div className="filter-actions">
              <button type="submit" className="btn-primary">Apply Filters</button>
              <button type="reset" className="btn-secondary" onClick={handleFormReset}>Reset All</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default InventoryFilterPanel;