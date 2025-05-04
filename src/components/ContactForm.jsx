// ContactForm.jsx
import { useState } from 'react';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '../firebase';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: 'purchase',
    message: '',
    consent: false
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const db = getFirestore(app);
      await addDoc(collection(db, 'inquiries'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      console.log('Inquiry submitted:', formData);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        interest: 'purchase',
        message: '',
        consent: false
      });
    } catch (error) {
      console.error('Error submitting inquiry:', error);
    }
  };
  
  return (
    <div className="contact-form-container">
      <h3>Send Us a Message</h3>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={formData.name}
            onChange={handleChange}
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input 
            type="tel" 
            id="phone" 
            name="phone" 
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="interest">I'm interested in</label>
          <select 
            id="interest" 
            name="interest"
            value={formData.interest}
            onChange={handleChange}
          >
            <option value="purchase">Purchasing a vehicle</option>
            <option value="test-drive">Scheduling a test drive</option>
            <option value="trade-in">Trading in my vehicle</option>
            <option value="service">Service appointment</option>
            <option value="financing">Financing options</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea 
            id="message" 
            name="message" 
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="form-group form-checkbox">
          <input 
            type="checkbox" 
            id="consent" 
            name="consent"
            checked={formData.consent}
            onChange={handleChange}
            required 
          />
          <label htmlFor="consent">I consent to Premium Motors collecting and storing my data as per the Privacy Policy.</label>
        </div>
        <button type="submit" className="btn-primary">Send Message</button>
      </form>
    </div>
  );
};

export default ContactForm;