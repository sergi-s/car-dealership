// InventoryFilterPanel.jsx
import { useState, useEffect } from "react";
import FilterGroup from "./FilterGroup";
import RangeSlider from "./RangeSlider";
import ColorOptions from "./ColorOptions";
import vehicleService from "../services/vehicleService";

// Helper to convert option values into labels
const formatLabel = (val) =>
  val
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const InventoryFilterPanel = ({ onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [currentFilters, setCurrentFilters] = useState({});
  const [filterCounts, setFilterCounts] = useState({});

  useEffect(() => {
    const loadCounts = async () => {
      const counts = await vehicleService.getFilterCounts(
        [
          "body_type",
          "make",
          "fuel",
          "transmission",
          "drivetrain",
          "certified",
          "new",
          "special",
        ],
        currentFilters
      );
      setFilterCounts(counts);
    };
    loadCounts();
  }, [currentFilters]);

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
    setCurrentFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFormReset = () => {
    setActiveFilters([]);
    setCurrentFilters({});
    onFilterChange({});
  };

  return (
    <div>
      <div className="container">
        <div className="filter-toggle">
          <button className="btn-filter-toggle" onClick={togglePanel}>
            <i className="fas fa-filter"></i> Filters{" "}
            <span className="filter-count">{activeFilters.length}</span>
          </button>
        </div>

        <div className={`filter-panel ${isExpanded ? "expanded" : ""}`}>
          <form className="filter-form" onSubmit={handleFormSubmit}>
            <FilterGroup
              title="Vehicle Type"
              options={Object.entries(filterCounts.body_type || {}).map(
                ([value, count]) => ({
                  value,
                  label: formatLabel(value),
                  count,
                })
              )}
              name="body_type"
            />

            <FilterGroup
              title="Make"
              options={Object.entries(filterCounts.make || {}).map(
                ([value, count]) => ({
                  value,
                  label: formatLabel(value),
                  count,
                })
              )}
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
              nameMin="minYear"
              nameMax="maxYear"
              formatValue={(val) => val.toString()}
            />

            <RangeSlider
              title="Price Range"
              min={0}
              max={200000}
              initialMin={30000}
              initialMax={150000}
              nameMin="minPrice"
              nameMax="maxPrice"
              formatValue={(val) =>
                `$${new Intl.NumberFormat().format(val)}${
                  val === 200000 ? "+" : ""
                }`
              }
            />

            <RangeSlider
              title="Mileage"
              min={0}
              max={100000}
              initialMin={0}
              initialMax={50000}
              nameMin="minMileage"
              nameMax="maxMileage"
              formatValue={(val) => `${new Intl.NumberFormat().format(val)} mi`}
            />

            <FilterGroup
              title="Fuel Type"
              options={Object.entries(filterCounts.fuel || {}).map(
                ([value, count]) => ({
                  value,
                  label: formatLabel(value),
                  count,
                })
              )}
              name="fuel"
            />

            <FilterGroup
              title="Transmission"
              options={Object.entries(filterCounts.transmission || {}).map(
                ([value, count]) => ({
                  value,
                  label: formatLabel(value),
                  count,
                })
              )}
              name="transmission"
            />

            <FilterGroup
              title="Drive Train"
              options={Object.entries(filterCounts.drivetrain || {}).map(
                ([value, count]) => ({
                  value,
                  label: formatLabel(value),
                  count,
                })
              )}
              name="drivetrain"
            />

            <ColorOptions
              title="Color"
              colors={[
                { value: "black", color: "#000000", title: "Black" },
                { value: "white", color: "#FFFFFF", title: "White" },
                { value: "silver", color: "#C0C0C0", title: "Silver" },
                { value: "gray", color: "#808080", title: "Gray" },
                { value: "red", color: "#FF0000", title: "Red" },
                { value: "blue", color: "#0000FF", title: "Blue" },
                { value: "green", color: "#008000", title: "Green" },
                { value: "brown", color: "#A52A2A", title: "Brown" },
              ]}
              name="exterior_color"
            />

            {/* Other filters (boolean flags) */}
            {(() => {
              const otherDefs = [
                { name: "certified", label: "Certified Pre-Owned" },
                { name: "new", label: "New Arrivals" },
                { name: "special", label: "Special Offers" },
              ];
              return (
                <FilterGroup
                  title="Other"
                  options={otherDefs.map(({ name, label }) => ({
                    value: "true",
                    label,
                    count: filterCounts[name]?.true || 0,
                    name,
                  }))}
                  useIndividualNames={true}
                />
              );
            })()}

            <div className="filter-actions">
              <button type="submit" className="btn-primary">
                Apply Filters
              </button>
              <button
                type="reset"
                className="btn-secondary"
                onClick={handleFormReset}
              >
                Reset All
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InventoryFilterPanel;
