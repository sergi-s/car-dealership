// InventoryResults.jsx
import { useState } from 'react';
import VehicleGrid from './VehicleGrid';
import Pagination from './Pagination';

const InventoryResults = ({ vehicles, totalCount, sorting, onSortChange, onPageChange, currentPage, pageSize }) => {
  const [viewMode, setViewMode] = useState('grid');
  
  const handleSortChange = (e) => {
    const [field, direction] = e.target.value.split('-');
    onSortChange(field, direction);
  };
  
  const toggleView = (view) => {
    setViewMode(view);
  };
  
  const totalPages = Math.ceil(totalCount / pageSize);
  return (
    <section className="inventory-results">
      <div className="container">
        <div className="results-header">
          <div className="results-count">
            <p><strong>{totalCount}</strong> vehicles found</p>
          </div>
          <div className="results-sort">
            <label htmlFor="sort">Sort by:</label>
            <select id="sort" name="sort" value={`${sorting.field}-${sorting.direction}`} onChange={handleSortChange}>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="year-desc">Year: Newest First</option>
              <option value="year-asc">Year: Oldest First</option>
              <option value="mileage-asc">Mileage: Low to High</option>
              <option value="make-asc">Make: A-Z</option>
            </select>
          </div>
          <div className="results-view">
            <button 
              className={`view-toggle ${viewMode === 'grid' ? 'active' : ''}`} 
              onClick={() => toggleView('grid')}
            >
              <i className="fas fa-th"></i>
            </button>
            <button 
              className={`view-toggle ${viewMode === 'list' ? 'active' : ''}`} 
              onClick={() => toggleView('list')}
            >
              <i className="fas fa-list"></i>
            </button>
          </div>
        </div>
        
        <VehicleGrid vehicles={vehicles} viewMode={viewMode} />
        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={onPageChange} />
      </div>
    </section>
  );
};

export default InventoryResults;