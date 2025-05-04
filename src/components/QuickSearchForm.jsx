// QuickSearchForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QuickSearchForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    price: '',
    bodyType: ''
  });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (formData.make) params.set('make', formData.make);
    if (formData.model) params.set('model', formData.model);
    if (formData.price) params.set('maxPrice', formData.price);
    if (formData.bodyType) params.set('body_type', formData.bodyType);
    navigate(`/inventory?${params.toString()}`);
  };
  
  return (
    <section className="quick-search">
      <div className="container">
        <h2>Quick Search</h2>
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="make">Make</label>
            <select id="make" name="make" value={formData.make} onChange={handleChange}>
              <option value="">All Makes</option>
              <option value="audi">Audi</option>
              <option value="bmw">BMW</option>
              <option value="mercedes">Mercedes-Benz</option>
              <option value="lexus">Lexus</option>
              <option value="porsche">Porsche</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="model">Model</label>
            <select id="model" name="model" disabled={!formData.make} onChange={handleChange}>
              <option value="">Select Make First</option>
              {/* Conditional model options based on selected make */}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="price">Max Price</label>
            <select id="price" name="price" value={formData.price} onChange={handleChange}>
              <option value="">No Limit</option>
              <option value="30000">$30,000</option>
              <option value="50000">$50,000</option>
              <option value="75000">$75,000</option>
              <option value="100000">$100,000</option>
              <option value="150000">$150,000+</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="body-type">Body Type</label>
            <select id="body-type" name="bodyType" value={formData.bodyType} onChange={handleChange}>
              <option value="">All Types</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="coupe">Coupe</option>
              <option value="convertible">Convertible</option>
              <option value="truck">Truck</option>
            </select>
          </div>
          <button type="submit" className="btn-primary">Search</button>
        </form>
      </div>
    </section>
  );
};

export default QuickSearchForm;