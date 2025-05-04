// VehicleDetailPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { vehicleService } from '../services/vehicleService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/vehicleDetail.css';

const VehicleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const galleryRef = useRef(null);
  const thumbnailsRef = useRef(null);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      setLoading(true);
      try {
        const vehicleData = await vehicleService.getVehicleById(id);
        setVehicle(vehicleData);
      } catch (error) {
        console.error('Error fetching vehicle details:', error);
        // Redirect to inventory page if vehicle not found
        navigate('/inventory');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [id, navigate]);

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

  const scrollToImage = (index) => {
    setActiveImage(index);
    if (galleryRef.current) {
      const scrollContainer = galleryRef.current;
      const imageElement = scrollContainer.children[index];
      if (imageElement) {
        scrollContainer.scrollTo({
          left: imageElement.offsetLeft,
          behavior: 'smooth'
        });
      }
    }

    // Scroll thumbnails if necessary
    if (thumbnailsRef.current) {
      const thumbnailsContainer = thumbnailsRef.current;
      const thumbnailElement = thumbnailsContainer.children[index];
      if (thumbnailElement) {
        thumbnailsContainer.scrollTo({
          left: thumbnailElement.offsetLeft - thumbnailsContainer.offsetWidth / 2 + thumbnailElement.offsetWidth / 2,
          behavior: 'smooth'
        });
      }
    }
  };

  const nextImage = () => {
    if (!vehicle) return;
    const images = vehicle.images || [vehicle.image];
    const nextIndex = (activeImage + 1) % images.length;
    scrollToImage(nextIndex);
  };

  const prevImage = () => {
    if (!vehicle) return;
    const images = vehicle.images || [vehicle.image];
    const prevIndex = (activeImage - 1 + images.length) % images.length;
    scrollToImage(prevIndex);
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="vehicle-detail loading">
          <div className="container">
            <div className="loading-spinner"></div>
            <div className="loading-message">Loading vehicle details...</div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const images = vehicle.images || [vehicle.image];

  return (
    <>
      <Header />
      <main className="vehicle-detail-page">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> &gt; <Link to="/inventory">Inventory</Link> &gt; <span>{vehicle.title}</span>
          </div>

          <div className="vehicle-detail-grid">
            <div className="vehicle-gallery-container">
              <div className="gallery-controls">
                <button className="gallery-nav prev" onClick={prevImage}>
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button className="gallery-nav next" onClick={nextImage}>
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
              
              <div className="main-image-wrapper">
                <div className="main-image-slider" ref={galleryRef}>
                  {images.map((img, index) => (
                    <div key={index} className={`main-image ${index === activeImage ? 'active' : ''}`}>
                      <img src={img || '/api/placeholder/800/600'} alt={`${vehicle.title} - View ${index + 1}`} />
                    </div>
                  ))}
                </div>
                {vehicle.badge && <span className="badge">{vehicle.badge}</span>}
              </div>
              
              {images.length > 1 && (
                <div className="thumbnail-gallery-wrapper">
                  <div className="thumbnail-gallery" ref={thumbnailsRef}>
                    {images.map((img, index) => (
                      <div 
                        key={index}
                        className={`thumbnail ${index === activeImage ? 'active' : ''}`}
                        onClick={() => scrollToImage(index)}
                      >
                        <img src={img} alt={`${vehicle.title} thumbnail ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="vehicle-info">
              <div className="vehicle-header">
                <h1>{vehicle.title}</h1>
                <p className="vehicle-price">{formatPrice(vehicle.price)}</p>
                {vehicle.msrp && vehicle.msrp > vehicle.price && (
                  <p className="msrp">MSRP: <span>{formatPrice(vehicle.msrp)}</span> <span className="savings">Save {formatPrice(vehicle.msrp - vehicle.price)}</span></p>
                )}
              </div>

              <div className="vehicle-meta">
                <div className="meta-item">
                  <i className="fas fa-calendar-alt"></i>
                  <span>Year</span>
                  <strong>{vehicle.year}</strong>
                </div>
                <div className="meta-item">
                  <i className="fas fa-tachometer-alt"></i>
                  <span>Mileage</span>
                  <strong>{formatMileage(vehicle.mileage)}</strong>
                </div>
                <div className="meta-item">
                  <i className={vehicle.fuelType === 'Electric' ? 'fas fa-bolt' : 'fas fa-gas-pump'}></i>
                  <span>Fuel</span>
                  <strong>{vehicle.fuelType}</strong>
                </div>
                <div className="meta-item">
                  <i className="fas fa-cog"></i>
                  <span>Transmission</span>
                  <strong>{vehicle.transmission}</strong>
                </div>
              </div>

              <div className="vehicle-actions">
                <button className="btn-primary"><i className="fas fa-phone"></i> Contact Us</button>
                <Link to={`/schedule?vehicleId=${vehicle.id}`} className="btn-secondary"><i className="fas fa-calendar-check"></i> Schedule Test Drive</Link>
              </div>
            </div>
          </div>

          <div className="vehicle-tabs">
            <div className="tabs-navigation">
              <button className="tab-button active">Details</button>
              <button className="tab-button">Features</button>
              <button className="tab-button">Specifications</button>
            </div>
          </div>

          <div className="vehicle-details-section">
            <h2>Vehicle Details</h2>
            <div className="details-grid">
              <div className="details-column">
                <div className="detail-item">
                  <span className="label">Make:</span>
                  <span className="value">{vehicle.make}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Model:</span>
                  <span className="value">{vehicle.model}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Exterior Color:</span>
                  <span className="value">
                    <span className="color-swatch" style={{background: mapColorName(vehicle.extColor || vehicle.exterior_color)}}></span>
                    {vehicle.extColor || vehicle.exterior_color || 'Not specified'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Interior Color:</span>
                  <span className="value">
                    <span className="color-swatch" style={{background: mapColorName(vehicle.intColor || vehicle.interior_color)}}></span>
                    {vehicle.intColor || vehicle.interior_color || 'Not specified'}
                  </span>
                </div>
              </div>
              <div className="details-column">
                <div className="detail-item">
                  <span className="label">VIN:</span>
                  <span className="value">{vehicle.vin || 'Not available'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Stock #:</span>
                  <span className="value">{vehicle.stock_number || 'Not available'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Drivetrain:</span>
                  <span className="value">{vehicle.drivetrain || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Body Type:</span>
                  <span className="value">{vehicle.body_type || 'Not specified'}</span>
                </div>
              </div>
            </div>
          </div>

          {vehicle.description && (
            <div className="vehicle-description-section">
              <h2>Description</h2>
              <div className="description-content">{vehicle.description}</div>
            </div>
          )}

          {vehicle.features && vehicle.features.length > 0 && (
            <div className="vehicle-features-section">
              <h2>Features & Options</h2>
              <ul className="features-list">
                {vehicle.features.map((feature, index) => (
                  <li key={index}><i className="fas fa-check"></i> {feature}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="similar-vehicles">
            <h2>You May Also Like</h2>
            <p>Check out our other vehicles that might interest you.</p>
            <div className="action-buttons">
              <Link to="/inventory" className="btn-outline"><i className="fas fa-car"></i> Browse Inventory</Link>
              <button className="btn-outline"><i className="fas fa-share-alt"></i> Share Vehicle</button>
              <button className="btn-outline"><i className="fas fa-print"></i> Print Details</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

// Helper function to map color names to CSS colors
function mapColorName(colorName) {
  if (!colorName) return '#eeeeee';
  
  const colorMap = {
    'black': '#000000',
    'white': '#ffffff',
    'silver': '#c0c0c0',
    'gray': '#808080',
    'red': '#ff0000',
    'blue': '#0000ff',
    'navy': '#000080',
    'green': '#008000',
    'beige': '#f5f5dc',
    'brown': '#a52a2a',
    'tan': '#d2b48c',
    'yellow': '#ffff00',
    'orange': '#ffa500',
    'purple': '#800080',
    'burgundy': '#800020'
  };
  
  const normalizedColor = colorName.toLowerCase();
  
  for (const [key, value] of Object.entries(colorMap)) {
    if (normalizedColor.includes(key)) {
      return value;
    }
  }
  
  return '#eeeeee'; // Default color if no match found
}

export default VehicleDetailPage;