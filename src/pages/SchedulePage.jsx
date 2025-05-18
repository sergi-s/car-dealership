import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import { app } from '../firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';
import '../styles/styles.css';
import { Calendar } from "../components/ui/calendar";

const db = getFirestore(app);

// Day of week array matches JS Date.getDay() values
const DAYS_OF_WEEK = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const SchedulePage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', vehicleId: '', date: '', time: '', notes: '' });
  const [message, setMessage] = useState('');
  const [businessHours, setBusinessHours] = useState({});
  const [blockedDates, setBlockedDates] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch vehicles, business hours, and blocked dates
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch vehicles
        const vehiclesSnap = await getDocs(collection(db, 'vehicles'));
        setVehicles(vehiclesSnap.docs.map(d => ({ 
          id: d.id, 
          title: d.data().title || `${d.data().year} ${d.data().make} ${d.data().model}` 
        })));

        // Fetch business hours
        const hoursDoc = await getDoc(doc(db, 'settings', 'businessHours'));
        if (hoursDoc.exists()) {
          setBusinessHours(hoursDoc.data());
        }

        // Fetch blocked dates
        const blockedDatesDoc = await getDoc(doc(db, 'settings', 'blockedDates'));
        if (blockedDatesDoc.exists()) {
          setBlockedDates(blockedDatesDoc.data().dates || []);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching schedule data:", err);
        setError("Failed to load scheduling information. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate available time slots based on the selected date
  useEffect(() => {
    if (!form.date || !businessHours || Object.keys(businessHours).length === 0) {
      setAvailableTimeSlots([]);
      return;
    }
    
    // Check if date is blocked
    if (blockedDates.includes(form.date)) {
      setAvailableTimeSlots([]);
      return;
    }
    
    const date = new Date(form.date);
    const dayOfWeek = DAYS_OF_WEEK[date.getDay()];
    const daySettings = businessHours[dayOfWeek];
    
    // If the day is closed or doesn't have settings, no slots available
    if (!daySettings || !daySettings.isOpen) {
      setAvailableTimeSlots([]);
      return;
    }
    
    // Generate time slots in 1-hour intervals
    const slots = [];
    const [openHour, openMinute] = daySettings.open.split(':').map(Number);
    const [closeHour, closeMinute] = daySettings.close.split(':').map(Number);
    
    let currentHour = openHour;
    let currentMinute = openMinute;
    
    while (
      currentHour < closeHour || 
      (currentHour === closeHour && currentMinute < closeMinute)
    ) {
      const formattedHour = currentHour.toString().padStart(2, '0');
      const formattedMinute = currentMinute.toString().padStart(2, '0');
      const timeString = `${formattedHour}:${formattedMinute}`;
      
      // Format for display
      const displayHour = currentHour > 12 ? currentHour - 12 : currentHour === 0 ? 12 : currentHour;
      const ampm = currentHour >= 12 ? 'PM' : 'AM';
      const displayText = `${displayHour}:${formattedMinute.padStart(2, '0')} ${ampm}`;
      
      slots.push({ value: timeString, display: displayText });
      
      // Increment by 1 hour
      currentHour++;
    }
    
    setAvailableTimeSlots(slots);
    
    // If the previously selected time is not available in the new date, clear it
    if (form.time && !slots.some(slot => slot.value === form.time)) {
      setForm(prev => ({ ...prev, time: '' }));
    }
  }, [form.date, businessHours, blockedDates]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const { firstName, lastName, email, phone, vehicleId, date, time, notes } = form;
    const vehicle = vehicles.find(v => v.id === vehicleId);
    const dateTime = new Date(`${date}T${time}`);
    
    try {
      const data = {
        customerName: `${firstName} ${lastName}`,
        customerEmail: email,
        customerPhone: phone,
        vehicleModel: vehicle?.title || '',
        vehicleId,
        date: dateTime,
        status: 'scheduled',
        notes,
        createdAt: new Date()
      };
      
      await addDoc(collection(db, 'test_drives'), data);
      setMessage('Your test drive has been successfully scheduled. We will contact you to confirm your appointment.');
      setForm({ firstName: '', lastName: '', email: '', phone: '', vehicleId: '', date: '', time: '', notes: '' });
    } catch (err) {
      console.error("Error scheduling test drive:", err);
      setError("Failed to schedule your test drive. Please try again.");
    }
  };

  // Check if a date should be disabled (for weekends or blocked dates)
  const isDateDisabled = (date) => {
    const d = new Date(date);
    const dayOfWeek = DAYS_OF_WEEK[d.getDay()];
    
    // Check if date is blocked
    if (blockedDates.includes(date)) {
      return true;
    }
    
    // Check if day of week is disabled in business hours
    if (businessHours[dayOfWeek] && !businessHours[dayOfWeek].isOpen) {
      return true;
    }
    
    return false;
  };

  // Filter out closed days for datepicker min date
  const getFirstAvailableDate = () => {
    const today = new Date();
    let checkDate = new Date(today);
    
    // Look up to 30 days ahead to find an available date
    for (let i = 0; i < 30; i++) {
      const dateString = checkDate.toISOString().split('T')[0];
      if (!isDateDisabled(dateString)) {
        return dateString;
      }
      checkDate.setDate(checkDate.getDate() + 1);
    }
    
    return today.toISOString().split('T')[0]; // Default to today if no available date found
  };

  return (
    <>
      <Header />
      <main>
        <PageHero 
          title="Schedule a Test Drive" 
          subtitle="Experience the luxury and performance of your dream car"
          className="schedule-hero"
        />
        
        <section className="schedule-section">
          <div className="container">
            <div className="schedule-container">
              <div className="schedule-info">
                <h2>Book Your Test Drive</h2>
                <p>Select your preferred date and time, and we'll have the vehicle ready for you.</p>
                <ul className="schedule-tips">
                  <li><i className="fas fa-clock"></i> Test drives typically last 30-45 minutes</li>
                  <li><i className="fas fa-id-card"></i> Please bring your valid driver's license</li>
                  <li><i className="fas fa-car"></i> Multiple vehicles can be arranged upon request</li>
                </ul>
              </div>
              
              <div className="schedule-form-container">
                {loading ? (
                  <div className="loading">Loading scheduling information...</div>
                ) : error ? (
                  <div className="error-message">{error}</div>
                ) : (
                  <>
                    {message && <div className="success-message">{message}</div>}
                    <form onSubmit={handleSubmit} className="schedule-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="firstName">First Name *</label>
                          <input 
                            id="firstName"
                            name="firstName" 
                            value={form.firstName} 
                            onChange={handleChange} 
                            required 
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="lastName">Last Name *</label>
                          <input 
                            id="lastName"
                            name="lastName" 
                            value={form.lastName} 
                            onChange={handleChange} 
                            required 
                          />
                        </div>
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="email">Email Address *</label>
                          <input 
                            type="email" 
                            id="email"
                            name="email" 
                            value={form.email} 
                            onChange={handleChange} 
                            required 
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="phone">Phone Number *</label>
                          <input 
                            type="tel" 
                            id="phone"
                            name="phone" 
                            value={form.phone} 
                            onChange={handleChange} 
                            required 
                          />
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="vehicleId">Select Vehicle *</label>
                        <select 
                          id="vehicleId"
                          name="vehicleId" 
                          value={form.vehicleId} 
                          onChange={handleChange} 
                          required
                        >
                          <option value="">Select a Vehicle</option>
                          {vehicles.map(v => (
                            <option key={v.id} value={v.id}>{v.title}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="date">Test Drive Date *</label>
                          {/* <input 
                            type="date" 
                            id="date"
                            name="date" 
                            value={form.date} 
                            min={getFirstAvailableDate()}
                            onChange={handleChange} 
                            required 
                          /> */}
                          <Calendar
                            mode="single"
                            selected={form.date}
                            onSelect={handleChange}
                            className="rounded-md border"
                            disabled={isDateDisabled}
                          />

                          {form.date && isDateDisabled(form.date) && (
                            <p className="form-error">This date is not available for test drives.</p>
                          )}
                          {form.date && !isDateDisabled(form.date) && availableTimeSlots.length === 0 && (
                            <p className="form-info">No available time slots for this date.</p>
                          )}
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="time">Time Slot *</label>
                          <select 
                            id="time"
                            name="time" 
                            value={form.time} 
                            onChange={handleChange} 
                            required
                            disabled={!form.date || isDateDisabled(form.date) || availableTimeSlots.length === 0}
                          >
                            <option value="">Select a Time</option>
                            {availableTimeSlots.map(slot => (
                              <option key={slot.value} value={slot.value}>
                                {slot.display}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="notes">Additional Notes</label>
                        <textarea 
                          id="notes"
                          name="notes" 
                          value={form.notes} 
                          onChange={handleChange} 
                          rows="4" 
                          placeholder="Let us know if you have any specific requirements or questions..."
                        />
                      </div>
                      
                      <div className="form-actions">
                        <button type="submit" className="btn-primary" disabled={!form.date || isDateDisabled(form.date) || !form.time}>
                          Schedule Test Drive
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default SchedulePage;
