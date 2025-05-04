// FilterGroup.jsx
import { useState } from 'react';

const FilterGroup = ({ title, options, name, showMoreButton = false, useIndividualNames = false }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Display only first 5 options if not expanded and showMoreButton is true
  const visibleOptions = showMoreButton && !expanded ? options.slice(0, 5) : options;
  
  return (
    <div className="filter-group">
      <h3>{title}</h3>
      <div className="filter-options">
        {visibleOptions.map((option, index) => (
          <label key={index} className="filter-checkbox">
            <input 
              type="checkbox" 
              name={useIndividualNames ? option.name || name : name} 
              value={option.value} 
            />
            <span className="checkbox-label">{option.label}</span>
            <span className="checkbox-count">{option.count}</span>
          </label>
        ))}
      </div>
      {showMoreButton && options.length > 5 && (
        <button 
          type="button" 
          className="btn-show-more" 
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show Less' : 'Show More'}
        </button>
      )}
    </div>
  );
};

export default FilterGroup;