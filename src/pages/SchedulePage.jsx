import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import { app } from '../firebase';

const db = getFirestore(app);

const SchedulePage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', vehicleId: '', date: '', time: '', notes: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchVehicles = async () => {
      const snap = await getDocs(collection(db, 'vehicles'));
      setVehicles(snap.docs.map(d => ({ id: d.id, title: d.data().title || `${d.data().year} ${d.data().make} ${d.data().model}` })));
    };
    fetchVehicles();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const { firstName, lastName, email, phone, vehicleId, date, time, notes } = form;
    const vehicle = vehicles.find(v => v.id === vehicleId);
    const dateTime = new Date(`${date}T${time}`);
    const data = {
      customerName: `${firstName} ${lastName}`,
      customerEmail: email,
      customerPhone: phone,
      vehicleModel: vehicle?.title || '',
      vehicleId,
      date: dateTime,
      status: 'scheduled',
      notes
    };
    await addDoc(collection(db, 'test_drives'), data);
    setMessage('Your test drive request has been scheduled.');
    setForm({ firstName: '', lastName: '', email: '', phone: '', vehicleId: '', date: '', time: '', notes: '' });
  };

  return (
    <div className="schedule-page">
      <h1>Schedule Test Drive</h1>
      {message && <p className="success-message">{message}</p>}
      <form onSubmit={handleSubmit} className="schedule-form">
        <div className="form-group">
          <label>First Name *</label>
          <input name="firstName" value={form.firstName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Last Name *</label>
          <input name="lastName" value={form.lastName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email Address *</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Phone Number *</label>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Select Vehicle *</label>
          <select name="vehicleId" value={form.vehicleId} onChange={handleChange} required>
            <option value="">Select Vehicle</option>
            {vehicles.map(v => <option key={v.id} value={v.id}>{v.title}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Test Drive Date *</label>
          <input type="date" name="date" value={form.date} min={new Date().toISOString().split('T')[0]} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Time Slot *</label>
          <select name="time" value={form.time} onChange={handleChange} required>
            <option value="">Select Time</option>
            {['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'].map(t => <option key={t} value={`${t}:00`}>{t.replace(':00','')} {t<'12:00'?'AM':'PM'}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Additional Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows="4" />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default SchedulePage;
