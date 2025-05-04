import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import imgbbService from '../../services/imgbbService';
import vehicleService from '../../services/vehicleService';
import '../styles.css';

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [images, setImages] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const uploads = images.map(f => imgbbService.uploadImage(f));
      const newUrls = await Promise.all(uploads);
      const photos = [...existingPhotos, ...newUrls];
      await vehicleService.updateVehicle(id, { ...formData, photos });
      navigate('/admin/inventory');
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      {/* ... reuse AddVehicle form fields, binding value={formData.field} onChange={handleChange} ... */}
      <h2>Edit Vehicle</h2>
      {/* Vehicle Photos preview */}
      <div className="form-row">
        {existingPhotos.map((url,i) => <img key={i} src={url} alt="existing" style={{width:80,height:60,objectFit:'cover',marginRight:8}} />)}
      </div>
      <div className="form-row">
        <input type="file" multiple accept="image/*" onChange={handleImageChange} />
      </div>
      {/* ...existing form sections... */}
      <div className="form-actions">
        <button type="button" className="btn-outline" onClick={() => navigate('/admin/inventory')}>Cancel</button>
        <button type="submit" className="btn-primary">Save Changes</button>
      </div>
    </form>
  );
};

export default EditVehicle;