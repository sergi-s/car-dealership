// RangeSlider.jsx
import { useState, useEffect } from 'react';

const RangeSlider = ({ title, min, max, initialMin, initialMax, formatValue, nameMin, nameMax }) => {
  const [minValue, setMinValue] = useState(initialMin);
  const [maxValue, setMaxValue] = useState(initialMax);
  
  useEffect(() => {
    // Update the slider track visually
    const updateTrack = () => {
      // This would update a CSS variable or style to reflect the current range
      // For a real implementation you might need to use refs to access DOM elements
    };
    
    updateTrack();
  }, [minValue, maxValue, min, max]);
  
  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxValue - 1);
    setMinValue(value);
  };
  
  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minValue + 1);
    setMaxValue(value);
  };
  
  return (
    <div className="filter-group">
      <h3>{title}</h3>
      <div className="range-slider">
        <div className="range-values">
          <span className="min-value">{formatValue(minValue)}</span>
          <span className="max-value">{formatValue(maxValue)}</span>
        </div>
        <div className="slider-container">
          <input 
            type="range" 
            name={nameMin}
            min={min} 
            max={max} 
            value={minValue} 
            className="range-min"
            onChange={handleMinChange}
          />
          <input 
            type="range" 
            name={nameMax}
            min={min} 
            max={max} 
            value={maxValue} 
            className="range-max"
            onChange={handleMaxChange}
          />
          <div className="slider-track"></div>
        </div>
      </div>
    </div>
  );
};

export default RangeSlider;