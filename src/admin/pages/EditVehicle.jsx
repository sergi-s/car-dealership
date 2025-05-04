import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { uploadImage } from '../../services/imgbbService';
import vehicleService from '../../services/vehicleService';
import '../styles.css';

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [images, setImages] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await vehicleService.getVehicleById(id);
        setFormData(data);
        setExistingPhotos(data.photos || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert('Vehicle not found');
        navigate('/admin/inventory');
      }
    };
    load();
  }, [id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = e => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const uploads = images.map(f => uploadImage(f));
      const newUrls = await Promise.all(uploads);
      const photos = [...existingPhotos, ...newUrls];
      await vehicleService.updateVehicle(id, { ...formData, photos });
      setViewMode(true);
      alert('Vehicle updated successfully');
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  if (loading) return <p>Loading...</p>;

  const renderField = (label, value) => (
    <div className="view-field">
      <div className="view-label">{label}:</div>
      <div className="view-value">{value || 'Not specified'}</div>
    </div>
  );

  return (
    <>
      <div className="admin-header">
        <h1>{viewMode ? 'Vehicle Details' : 'Edit Vehicle'}</h1>
        <div className="admin-actions">
          {viewMode ? (
            <button 
              onClick={() => setViewMode(false)} 
              className="btn-primary"
            >
              Edit Vehicle
            </button>
          ) : (
            <button 
              onClick={() => setViewMode(true)} 
              className="btn-outline"
            >
              Cancel Edit
            </button>
          )}
          <button 
            onClick={() => navigate('/admin/inventory')} 
            className="btn-secondary"
          >
            Back to Inventory
          </button>
        </div>
      </div>
      
      {viewMode ? (
        <section className="vehicle-details">
          {/* Vehicle Image Gallery */}
          <div className="photo-gallery">
            {existingPhotos.length > 0 ? (
              <div className="photos-grid">
                {existingPhotos.map((url, i) => (
                  <div key={i} className="photo-item">
                    <img src={url} alt={`${formData.make} ${formData.model}`} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-photos">No photos available</div>
            )}
          </div>

          {/* Basic Vehicle Information */}
          <div className="details-section">
            <h2>Vehicle Information</h2>
            <div className="details-grid">
              {renderField('Make', formData.make)}
              {renderField('Model', formData.model)}
              {renderField('Year', formData.year)}
              {renderField('Body Type', formData.body_type)}
              {renderField('Trim', formData.trim)}
              {renderField('Stock Number', formData.stock_number)}
              {renderField('VIN', formData.vin)}
              {renderField('Condition', formData.condition)}
              {renderField('Status', formData.status)}
            </div>
          </div>

          {/* Price Information */}
          <div className="details-section">
            <h2>Price Information</h2>
            <div className="details-grid">
              {renderField('Price', formData.price ? `$${formData.price.toLocaleString()}` : 'Not specified')}
              {renderField('MSRP', formData.msrp ? `$${formData.msrp.toLocaleString()}` : 'Not specified')}
              {renderField('Special Offer', formData.special_offer ? 'Yes' : 'No')}
            </div>
          </div>

          {/* Vehicle Features */}
          <div className="details-section">
            <h2>Vehicle Features</h2>
            <div className="details-grid">
              {renderField('Mileage', formData.mileage ? `${formData.mileage.toLocaleString()} miles` : 'Not specified')}
              {renderField('Fuel Type', formData.fuel_type)}
              {renderField('Transmission', formData.transmission)}
              {renderField('Drive Train', formData.drive_train)}
              {renderField('Engine', formData.engine)}
              {renderField('Horsepower', formData.horsepower)}
              {renderField('Exterior Color', formData.exterior_color)}
              {renderField('Interior Color', formData.interior_color)}
              {renderField('Passengers', formData.passengers)}
              {renderField('Doors', formData.doors)}
              {renderField('MPG City', formData.mpg_city)}
              {renderField('MPG Highway', formData.mpg_highway)}
            </div>
          </div>

          {/* Description */}
          <div className="details-section">
            <h2>Description</h2>
            <div className="vehicle-description">
              {formData.description || 'No description available.'}
            </div>
          </div>

          {/* Features & Options */}
          <div className="details-section">
            <h2>Features & Options</h2>
            <div className="features-list">
              {formData.features && formData.features.length > 0 ? (
                <ul className="feature-grid">
                  {formData.features.map((feature, index) => (
                    <li key={index} className="feature-item">✓ {feature}</li>
                  ))}
                </ul>
              ) : (
                <p>No features specified.</p>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="details-section">
            <h2>Additional Information</h2>
            <div className="details-grid">
              {renderField('Warranty', formData.warranty)}
              {renderField('Certified Pre-Owned', formData.certified_pre_owned ? 'Yes' : 'No')}
              {renderField('New Arrival', formData.new_arrival ? 'Yes' : 'No')}
            </div>
          </div>
        </section>
      ) : (
        <form className="admin-form" onSubmit={handleSubmit}>
          {/* Vehicle Information */}
          <h2>Vehicle Information</h2>
          {/* Basic Information Row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="make">Make *</label>
              <select id="make" name="make" required value={formData.make || ''} onChange={handleChange}>
                <option value="">Select Make</option>
                <option value="audi">Audi</option>
                <option value="bmw">BMW</option>
                <option value="mercedes">Mercedes-Benz</option>
                <option value="porsche">Porsche</option>
                <option value="lexus">Lexus</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="model">Model *</label>
              <select id="model" name="model" required value={formData.model || ''} onChange={handleChange}>
                <option value="">Select Model</option>
                {/* TODO: options based on make */}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="year">Year *</label>
              <select id="year" name="year" required value={formData.year || ''} onChange={handleChange}>
                <option value="">Select Year</option>
                {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map(y => 
                  <option key={y} value={y}>{y}</option>
                )}
              </select>
            </div>
          </div>
          
          {/* Body Type, Trim, Stock Number */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="body_type">Body Type *</label>
              <select id="body_type" name="body_type" required value={formData.body_type || ''} onChange={handleChange}>
                <option value="">Select Body Type</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="coupe">Coupe</option>
                <option value="convertible">Convertible</option>
                <option value="wagon">Wagon</option>
                <option value="hatchback">Hatchback</option>
                <option value="truck">Truck</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="trim">Trim</label>
              <input type="text" id="trim" name="trim" value={formData.trim || ''} placeholder="e.g. Sport, Premium" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="stock_number">Stock Number *</label>
              <input type="text" id="stock_number" name="stock_number" required value={formData.stock_number || ''} onChange={handleChange} />
            </div>
          </div>
          
          {/* VIN, Condition, Status */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="vin">VIN *</label>
              <input type="text" id="vin" name="vin" required value={formData.vin || ''} placeholder="Vehicle Identification Number" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="condition">Condition *</label>
              <select id="condition" name="condition" required value={formData.condition || ''} onChange={handleChange}>
                <option value="">Select Condition</option>
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value="certified">Certified Pre-Owned</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select id="status" name="status" required value={formData.status || ''} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
          
          {/* Price Information */}
          <h2>Price Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price (USD) *</label>
              <input type="number" id="price" name="price" required value={formData.price || ''} placeholder="e.g. 45000" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="msrp">MSRP (USD)</label>
              <input type="number" id="msrp" name="msrp" value={formData.msrp || ''} placeholder="e.g. 48000" onChange={handleChange} />
            </div>
            <div className="form-group">
              <div className="form-checkbox">
                <input type="checkbox" id="special_offer" name="special_offer" checked={formData.special_offer || false} onChange={handleChange} />
                <label htmlFor="special_offer">Mark as special offer</label>
              </div>
            </div>
          </div>
          
          {/* Vehicle Features */}
          <h2>Vehicle Features</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="mileage">Mileage *</label>
              <input type="number" id="mileage" name="mileage" required value={formData.mileage || ''} placeholder="e.g. 12500" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="fuel_type">Fuel Type *</label>
              <select id="fuel_type" name="fuel_type" required value={formData.fuel_type || ''} onChange={handleChange}>
                <option value="">Select Fuel Type</option>
                <option value="gasoline">Gasoline</option>
                <option value="diesel">Diesel</option>
                <option value="hybrid">Hybrid</option>
                <option value="electric">Electric</option>
                <option value="plug-in-hybrid">Plug-in Hybrid</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="transmission">Transmission *</label>
              <select id="transmission" name="transmission" required value={formData.transmission || ''} onChange={handleChange}>
                <option value="">Select Transmission</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
                <option value="semi-auto">Semi-Automatic</option>
                <option value="cvt">CVT</option>
                <option value="dual-clutch">Dual-Clutch</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="drive_train">Drive Train *</label>
              <select id="drive_train" name="drive_train" required value={formData.drive_train || ''} onChange={handleChange}>
                <option value="">Select Drive Train</option>
                <option value="fwd">FWD</option>
                <option value="rwd">RWD</option>
                <option value="awd">AWD</option>
                <option value="4wd">4WD</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="engine">Engine</label>
              <input type="text" id="engine" name="engine" value={formData.engine || ''} placeholder="e.g. 3.0L V6 Twin Turbo" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="horsepower">Horsepower</label>
              <input type="number" id="horsepower" name="horsepower" value={formData.horsepower || ''} placeholder="e.g. 335" onChange={handleChange} />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="exterior_color">Exterior Color *</label>
              <input type="text" id="exterior_color" name="exterior_color" required value={formData.exterior_color || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="interior_color">Interior Color *</label>
              <input type="text" id="interior_color" name="interior_color" required value={formData.interior_color || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="passengers">Passengers</label>
              <input type="number" id="passengers" name="passengers" min="1" max="15" value={formData.passengers || ''} onChange={handleChange} />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="doors">Doors</label>
              <input type="number" id="doors" name="doors" min="2" max="5" value={formData.doors || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="mpg_city">MPG City</label>
              <input type="number" id="mpg_city" name="mpg_city" step="0.1" value={formData.mpg_city || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="mpg_highway">MPG Highway</label>
              <input type="number" id="mpg_highway" name="mpg_highway" step="0.1" value={formData.mpg_highway || ''} onChange={handleChange} />
            </div>
          </div>
          
          {/* Vehicle Photos */}
          <h2>Vehicle Photos</h2>
          <div className="form-row">
            {/* Display existing photos */}
            <div className="existing-photos">
              {existingPhotos.map((url, i) => (
                <div key={i} className="photo-thumbnail">
                  <img src={url} alt={`Vehicle ${i+1}`} style={{ width: 80, height: 60, objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="photos">Add More Photos</label>
              <input type="file" id="photos" name="photos" accept="image/*" multiple onChange={handleImageChange} />
            </div>
          </div>
          
          {/* Vehicle Description */}
          <h2>Vehicle Description</h2>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea 
              id="description" 
              name="description" 
              rows="6" 
              value={formData.description || ''} 
              placeholder="Enter detailed description..." 
              onChange={handleChange} 
            />
          </div>
          
          {/* Features & Options */}
          <h2>Features & Options</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px', marginBottom: '20px' }}>
            {[
              { id: 'navigation', label: 'Navigation System' },
              { id: 'bluetooth', label: 'Bluetooth' },
              { id: 'leather', label: 'Leather Seats' },
              { id: 'sunroof', label: 'Sunroof/Moonroof' },
              { id: 'heated_seats', label: 'Heated Seats' },
              { id: 'ac', label: 'A/C' },
              { id: 'usb', label: 'USB Ports' },
              { id: 'alloy_wheels', label: 'Alloy Wheels' },
              { id: 'backup_camera', label: 'Backup Camera' },
              { id: 'parking_sensors', label: 'Parking Sensors' },
              { id: 'cruise_control', label: 'Cruise Control' },
              { id: 'keyless_entry', label: 'Keyless Entry' }
            ].map(f => (
              <div key={f.id} className="form-checkbox">
                <input 
                  type="checkbox" 
                  id={f.id} 
                  name="features" 
                  value={f.id} 
                  checked={(formData.features || []).includes(f.id)}
                  onChange={handleChange} 
                />
                <label htmlFor={f.id}>{f.label}</label>
              </div>
            ))}
          </div>
          
          {/* Additional Options */}
          <h2>Additional Options</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="warranty">Warranty Information</label>
              <textarea 
                id="warranty" 
                name="warranty" 
                rows="3" 
                value={formData.warranty || ''} 
                placeholder="Describe warranty coverage..." 
                onChange={handleChange} 
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-checkbox">
              <input 
                type="checkbox" 
                id="certified_pre_owned" 
                name="certified_pre_owned" 
                checked={formData.certified_pre_owned || false} 
                onChange={handleChange} 
              />
              <label htmlFor="certified_pre_owned">Certified Pre-Owned</label>
            </div>
            <div className="form-checkbox">
              <input 
                type="checkbox" 
                id="new_arrival" 
                name="new_arrival" 
                checked={formData.new_arrival || false} 
                onChange={handleChange} 
              />
              <label htmlFor="new_arrival">New Arrival</label>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="btn-outline" onClick={() => setViewMode(true)}>Cancel</button>
            <button type="submit" className="btn-primary">Save Changes</button>
          </div>
        </form>
      )}
    </>
  );
};

export default EditVehicle;