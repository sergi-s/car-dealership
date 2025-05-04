// MapSection.jsx
const MapSection = () => {
    return (
      <section className="map-section">
        <div className="map-container">
          {/* In a real application, this would be replaced with a Google Maps or similar component */}
          <img 
            src="/api/placeholder/1200/400" 
            alt="Map location of Premium Motors" 
            className="location-map"
          />
        </div>
      </section>
    );
  };
  
  export default MapSection;