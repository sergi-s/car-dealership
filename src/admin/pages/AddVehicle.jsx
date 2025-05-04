import React, { useState } from 'react';
import '../styles.css';
import { useNavigate } from 'react-router-dom';
import { uploadImage } from '../../services/imgbbService';
import vehicleService from '../../services/vehicleService';

const AddVehicle = () => {
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [formData, setFormData] = useState({});
    const [images, setImages] = useState([]);
    const navigate = useNavigate();

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
            // upload images
            const uploadPromises = images.map(file => uploadImage(file));
            const urls = await Promise.all(uploadPromises);
            const payload = { ...formData, photos: urls };
            await vehicleService.createVehicle(payload);
            navigate('/admin/inventory');
        } catch (err) {
            console.error(err);
            alert('Error saving vehicle.');
        }
    };

    return (
        <>
            <div className="admin-header">
                <h1>Add New Vehicle</h1>
                <div className="admin-user">
                    <div className="admin-user-image">
                        <img src="/api/placeholder/40/40" alt="Admin User" />
                    </div>
                    <div className="admin-user-info">
                        <h4>John Smith</h4>
                        <p>Administrator</p>
                    </div>
                </div>
            </div>

            <section>
                <form className="admin-form" onSubmit={handleSubmit}>
                    {/* Vehicle Information */}
                    <h2>Vehicle Information</h2>
                    {/* Basic Information Row */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="make">Make *</label>
                            <select id="make" name="make" required value={make} onChange={e => { setMake(e.target.value); handleChange(e); }}>
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
                            <select id="model" name="model" required value={model} onChange={e => { setModel(e.target.value); handleChange(e); }}>
                                <option value="">Select Model</option>
                                {/* TODO: options based on make */}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="year">Year *</label>
                            <select id="year" name="year" required value={year} onChange={e => { setYear(e.target.value); handleChange(e); }}>
                                <option value="">Select Year</option>
                                {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>
                    {/* Body Type, Trim, Stock Number */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="body_type">Body Type *</label>
                            <select id="body_type" name="body_type" required onChange={handleChange}>
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
                            <input type="text" id="trim" name="trim" placeholder="e.g. Sport, Premium" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="stock_number">Stock Number *</label>
                            <input type="text" id="stock_number" name="stock_number" required onChange={handleChange} />
                        </div>
                    </div>
                    {/* VIN, Condition, Status */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="vin">VIN *</label>
                            <input type="text" id="vin" name="vin" required placeholder="Vehicle Identification Number" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="condition">Condition *</label>
                            <select id="condition" name="condition" required onChange={handleChange}>
                                <option value="">Select Condition</option>
                                <option value="new">New</option>
                                <option value="used">Used</option>
                                <option value="certified">Certified Pre-Owned</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="status">Status *</label>
                            <select id="status" name="status" required onChange={handleChange}>
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
                            <input type="number" id="price" name="price" required placeholder="e.g. 45000" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="msrp">MSRP (USD)</label>
                            <input type="number" id="msrp" name="msrp" placeholder="e.g. 48000" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <div className="form-checkbox">
                                <input type="checkbox" id="special_offer" name="special_offer" onChange={handleChange} />
                                <label htmlFor="special_offer">Mark as special offer</label>
                            </div>
                        </div>
                    </div>
                    {/* Vehicle Features */}
                    <h2>Vehicle Features</h2>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="mileage">Mileage *</label>
                            <input type="number" id="mileage" name="mileage" required placeholder="e.g. 12500" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="fuel_type">Fuel Type *</label>
                            <select id="fuel_type" name="fuel_type" required onChange={handleChange}>
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
                            <select id="transmission" name="transmission" required onChange={handleChange}>
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
                            <select id="drive_train" name="drive_train" required onChange={handleChange}>
                                <option value="">Select Drive Train</option>
                                <option value="fwd">FWD</option>
                                <option value="rwd">RWD</option>
                                <option value="awd">AWD</option>
                                <option value="4wd">4WD</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="engine">Engine</label>
                            <input type="text" id="engine" name="engine" placeholder="e.g. 3.0L V6 Twin Turbo" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="horsepower">Horsepower</label>
                            <input type="number" id="horsepower" name="horsepower" placeholder="e.g. 335" onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="exterior_color">Exterior Color *</label>
                            <input type="text" id="exterior_color" name="exterior_color" required onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="interior_color">Interior Color *</label>
                            <input type="text" id="interior_color" name="interior_color" required onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="passengers">Passengers</label>
                            <input type="number" id="passengers" name="passengers" min="1" max="15" onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="doors">Doors</label>
                            <input type="number" id="doors" name="doors" min="2" max="5" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="mpg_city">MPG City</label>
                            <input type="number" id="mpg_city" name="mpg_city" step="0.1" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="mpg_highway">MPG Highway</label>
                            <input type="number" id="mpg_highway" name="mpg_highway" step="0.1" onChange={handleChange} />
                        </div>
                    </div>
                    {/* Vehicle Photos */}
                    <h2>Vehicle Photos</h2>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="photos">Vehicle Photos</label>
                            <input type="file" id="photos" name="photos" accept="image/*" multiple onChange={handleImageChange} />
                        </div>
                    </div>
                    {/* Vehicle Description */}
                    <h2>Vehicle Description</h2>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea id="description" name="description" rows="6" placeholder="Enter detailed description..." onChange={handleChange} />
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
                                <input type="checkbox" id={f.id} name="features" value={f.id} onChange={handleChange} />
                                <label htmlFor={f.id}>{f.label}</label>
                            </div>
                        ))}
                    </div>
                    {/* Additional Options */}
                    <h2>Additional Options</h2>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="warranty">Warranty Information</label>
                            <textarea id="warranty" name="warranty" rows="3" placeholder="Describe warranty coverage..." onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-checkbox">
                            <input type="checkbox" id="certified_pre_owned" name="certified_pre_owned" onChange={handleChange} />
                            <label htmlFor="certified_pre_owned">Certified Pre-Owned</label>
                        </div>
                        <div className="form-checkbox">
                            <input type="checkbox" id="new_arrival" name="new_arrival" onChange={handleChange} />
                            <label htmlFor="new_arrival">New Arrival</label>
                        </div>
                    </div>
                    {/* Form Actions */}
                    <div className="form-actions">
                        <button type="reset" className="btn-outline">Cancel</button>
                        <button type="button" className="btn-secondary" onClick={() => navigate('/admin/inventory')}>Save as Draft</button>
                        <button type="submit" className="btn-primary">Publish Vehicle</button>
                    </div>
                </form>
            </section>
        </>
    );
};

export default AddVehicle;
