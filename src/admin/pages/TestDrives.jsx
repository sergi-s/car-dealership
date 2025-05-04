import React, { useState, useEffect } from 'react';
import '../styles.css';
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc, addDoc, getDoc, setDoc } from 'firebase/firestore';
import { app } from '../../../src/firebase';

const db = getFirestore(app);

const DEFAULT_BUSINESS_HOURS = {
  monday: { open: '09:00', close: '18:00', isOpen: true },
  tuesday: { open: '09:00', close: '18:00', isOpen: true },
  wednesday: { open: '09:00', close: '18:00', isOpen: true },
  thursday: { open: '09:00', close: '18:00', isOpen: true },
  friday: { open: '09:00', close: '18:00', isOpen: true },
  saturday: { open: '10:00', close: '16:00', isOpen: true },
  sunday: { open: '00:00', close: '00:00', isOpen: false },
};

const DAYS_OF_WEEK = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const TestDrives = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessHours, setBusinessHours] = useState(DEFAULT_BUSINESS_HOURS);
  const [blockedDates, setBlockedDates] = useState([]);
  const [newBlockDate, setNewBlockDate] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // form state
  const [customerType, setCustomerType] = useState('existing');
  const [customers, setCustomers] = useState([]);
  const [existingCustomer, setExistingCustomer] = useState('');
  const [newCustomer, setNewCustomer] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [vehiclesList, setVehiclesList] = useState([]);
  const [vehicleId, setVehicleId] = useState('');
  const [testDate, setTestDate] = useState('');
  const [testTime, setTestTime] = useState('');
  const [salesAssociate, setSalesAssociate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchDrives = async () => {
      const q = collection(db, 'test_drives');
      const snap = await getDocs(q);
      setDrives(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchDrives();
  }, []);

  // fetch customers and vehicles
  useEffect(() => {
    const fetchData = async () => {
      const custSnap = await getDocs(collection(db, 'customers'));
      setCustomers(custSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      const vehSnap = await getDocs(collection(db, 'vehicles'));
      setVehiclesList(vehSnap.docs.map(d => ({ id: d.id, title: d.data().title || `${d.data().year} ${d.data().make} ${d.data().model}` })));
    };
    fetchData();
  }, []);

  // Fetch business hours and blocked dates
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const hoursDoc = await getDoc(doc(db, 'settings', 'businessHours'));
        if (hoursDoc.exists()) {
          setBusinessHours(hoursDoc.data());
        } else {
          // Initialize default settings if none exist
          await setDoc(doc(db, 'settings', 'businessHours'), DEFAULT_BUSINESS_HOURS);
        }
        
        const blockedDatesDoc = await getDoc(doc(db, 'settings', 'blockedDates'));
        if (blockedDatesDoc.exists()) {
          setBlockedDates(blockedDatesDoc.data().dates || []);
        } else {
          await setDoc(doc(db, 'settings', 'blockedDates'), { dates: [] });
        }
      } catch (error) {
        console.error("Error fetching business hours settings:", error);
      }
    };
    
    fetchSettings();
  }, []);

  // Generate available time slots based on the selected date
  useEffect(() => {
    if (!testDate) {
      setAvailableTimeSlots([]);
      return;
    }
    
    // Check if date is blocked
    if (blockedDates.includes(testDate)) {
      setAvailableTimeSlots([]);
      return;
    }
    
    const date = new Date(testDate);
    const dayOfWeek = DAYS_OF_WEEK[date.getDay()];
    const daySettings = businessHours[dayOfWeek];
    
    // If the day is closed, no slots available
    if (!daySettings.isOpen) {
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
      slots.push(`${formattedHour}:${formattedMinute}`);
      
      // Increment by 1 hour
      currentHour++;
    }
    
    setAvailableTimeSlots(slots);
  }, [testDate, businessHours, blockedDates]);

  const handleDelete = async id => {
    if (!window.confirm('Cancel this test drive?')) return;
    await deleteDoc(doc(db, 'test_drives', id));
    setDrives(prev => prev.filter(d => d.id !== id));
  };

  const handleMarkCompleted = async id => {
    const ref = doc(db, 'test_drives', id);
    await updateDoc(ref, { status: 'completed' });
    setDrives(prev => prev.map(d => d.id === id ? { ...d, status: 'completed' } : d));
  };

  // Save business hours settings
  const saveBusinessHours = async () => {
    try {
      await setDoc(doc(db, 'settings', 'businessHours'), businessHours);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch (error) {
      console.error("Error saving business hours:", error);
      alert("Failed to save business hours settings");
    }
  };

  // Update a specific day's business hours
  const updateDayHours = (day, field, value) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  // Add a blocked date
  const addBlockedDate = async () => {
    if (!newBlockDate || blockedDates.includes(newBlockDate)) {
      return;
    }
    
    const updatedBlockedDates = [...blockedDates, newBlockDate];
    try {
      await setDoc(doc(db, 'settings', 'blockedDates'), { dates: updatedBlockedDates });
      setBlockedDates(updatedBlockedDates);
      setNewBlockDate('');
    } catch (error) {
      console.error("Error adding blocked date:", error);
      alert("Failed to add blocked date");
    }
  };

  // Remove a blocked date
  const removeBlockedDate = async (dateToRemove) => {
    const updatedBlockedDates = blockedDates.filter(date => date !== dateToRemove);
    try {
      await setDoc(doc(db, 'settings', 'blockedDates'), { dates: updatedBlockedDates });
      setBlockedDates(updatedBlockedDates);
    } catch (error) {
      console.error("Error removing blocked date:", error);
      alert("Failed to remove blocked date");
    }
  };

  // handle form submission
  const handleCreateDrive = async e => {
    e.preventDefault();
    let customer = {};
    if (customerType === 'existing') {
      const sel = customers.find(c => c.id === existingCustomer);
      customer = { name: sel ? `${sel.firstName} ${sel.lastName}` : '', email: sel?.email || '', phone: sel?.phone || '' };
    } else {
      customer = { name: `${newCustomer.firstName} ${newCustomer.lastName}`, email: newCustomer.email, phone: newCustomer.phone };
    }
    const selectedVehicle = vehiclesList.find(v => v.id === vehicleId);
    const dateTime = new Date(`${testDate}T${testTime}`);
    const data = { customerName: customer.name, customerEmail: customer.email, customerPhone: customer.phone, vehicleModel: selectedVehicle?.title || '', vehicleId, date: dateTime, salesAssociate, status: 'scheduled', notes };
    const docRef = await addDoc(collection(db, 'test_drives'), data);
    setDrives(prev => [...prev, { id: docRef.id, ...data }]);
    setActiveTab('appointments');
    // reset form
    setExistingCustomer('');
    setNewCustomer({ firstName: '', lastName: '', email: '', phone: '' });
    setVehicleId('');
    setTestDate('');
    setTestTime('');
    setSalesAssociate('');
    setNotes('');
  };

  return (
    <>
      <div className="admin-header">
        <h1>Test Drive Management</h1>
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

      <section className="dashboard-stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-car"></i></div>
          <div className="stat-info"><h3>38</h3><p>Total Test Drives</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-calendar-check"></i></div>
          <div className="stat-info"><h3>24</h3><p>Completed</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-calendar-day"></i></div>
          <div className="stat-info"><h3>14</h3><p>Upcoming</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-calendar"></i></div>
          <div className="stat-info"><h3>3</h3><p>Today&apos;s Test Drives</p></div>
        </div>
      </section>

      <section className="calendar-view" style={{ margin: '20px 0' }}>
        <div className="tab-navigation">
          <button className={activeTab === 'appointments' ? 'active' : ''} onClick={() => setActiveTab('appointments')}>Appointments</button>
          <button className={activeTab === 'calendar' ? 'active' : ''} onClick={() => setActiveTab('calendar')}>Calendar View</button>
          <button className={activeTab === 'create' ? 'active' : ''} onClick={() => setActiveTab('create')}>Create Appointment</button>
          <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>Schedule Settings</button>
        </div>

        {activeTab === 'appointments' && (
          <div className="tab-content">
            {loading ? <p>Loading...</p> : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th><input type="checkbox" /></th>
                    <th>Customer</th>
                    <th>Vehicle</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drives.map(d => (
                    <tr key={d.id}>
                      <td><input type="checkbox" /></td>
                      <td>{d.customerName}</td>
                      <td>{d.vehicleModel}</td>
                      <td>{new Date(d.date).toLocaleString()}</td>
                      <td><span className={`status status-${d.status}`}>{d.status}</span></td>
                      <td>
                        <div className="table-actions">
                          <button className="btn-icon delete" onClick={() => handleDelete(d.id)} title="Cancel"><i className="fas fa-trash-alt" /></button>
                          {d.status !== 'completed' && (
                            <button className="btn-icon" onClick={() => handleMarkCompleted(d.id)} title="Mark Completed"><i className="fas fa-check" /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="tab-content">
            {/* TODO: implement calendar UI */}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="tab-content">
            <form onSubmit={handleCreateDrive} className="admin-form">
              <h2>Schedule Test Drive</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Customer Type *</label>
                  <select value={customerType} onChange={e => setCustomerType(e.target.value)} required>
                    <option value="existing">Existing Customer</option>
                    <option value="new">New Customer</option>
                  </select>
                </div>
                {customerType === 'existing' ? (
                  <div className="form-group">
                    <label>Select Customer</label>
                    <select value={existingCustomer} onChange={e => setExistingCustomer(e.target.value)} required>
                      <option value="">Select Customer</option>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
                    </select>
                  </div>
                ) : (
                  <div className="new-customer-fields">
                    <div className="form-row">
                      <div className="form-group">
                        <label>First Name *</label>
                        <input type="text" value={newCustomer.firstName} onChange={e => setNewCustomer(prev => ({ ...prev, firstName: e.target.value }))} required />
                      </div>
                      <div className="form-group">
                        <label>Last Name *</label>
                        <input type="text" value={newCustomer.lastName} onChange={e => setNewCustomer(prev => ({ ...prev, lastName: e.target.value }))} required />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Email Address *</label>
                        <input type="email" value={newCustomer.email} onChange={e => setNewCustomer(prev => ({ ...prev, email: e.target.value }))} required />
                      </div>
                      <div className="form-group">
                        <label>Phone Number *</label>
                        <input type="tel" value={newCustomer.phone} onChange={e => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))} required />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Vehicle *</label>
                <select value={vehicleId} onChange={e => setVehicleId(e.target.value)} required>
                  <option value="">Select Vehicle</option>
                  {vehiclesList.map(v => <option key={v.id} value={v.id}>{v.title}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date *</label>
                  <input type="date" value={testDate} onChange={e => setTestDate(e.target.value)} min={new Date().toISOString().split('T')[0]} required />
                </div>
                <div className="form-group">
                  <label>Time Slot *</label>
                  <select value={testTime} onChange={e => setTestTime(e.target.value)} required>
                    <option value="">Select Time</option>
                    {availableTimeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Sales Associate *</label>
                  <select value={salesAssociate} onChange={e => setSalesAssociate(e.target.value)} required>
                    <option value="">Select Associate</option>
                    <option>Alexandra Chen</option>
                    <option>Michael Rodriguez</option>
                    <option>Jennifer Williams</option>
                    <option>David Parker</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Additional Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows="4" />
              </div>
              <div className="form-actions">
                <button type="reset" className="btn-outline" onClick={() => { setExistingCustomer(''); setNewCustomer({ firstName: '', lastName: '', email: '', phone: '' }); }}>Reset</button>
                <button type="submit" className="btn-primary">Schedule Test Drive</button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="tab-content">
            <h2>Schedule Settings</h2>
            <div className="settings-section">
              <h3>Business Hours</h3>
              {DAYS_OF_WEEK.map(day => (
                <div key={day} className="form-row">
                  <div className="form-group">
                    <label>{day.charAt(0).toUpperCase() + day.slice(1)} Open</label>
                    <input
                      type="time"
                      value={businessHours[day].open}
                      onChange={e => updateDayHours(day, 'open', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>{day.charAt(0).toUpperCase() + day.slice(1)} Close</label>
                    <input
                      type="time"
                      value={businessHours[day].close}
                      onChange={e => updateDayHours(day, 'close', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>{day.charAt(0).toUpperCase() + day.slice(1)} Open?</label>
                    <input
                      type="checkbox"
                      checked={businessHours[day].isOpen}
                      onChange={e => updateDayHours(day, 'isOpen', e.target.checked)}
                    />
                  </div>
                </div>
              ))}
              <button className="btn-primary" onClick={saveBusinessHours}>Save Business Hours</button>
              {settingsSaved && <p>Settings saved successfully!</p>}
            </div>
            <div className="settings-section">
              <h3>Blocked Dates</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Add Blocked Date</label>
                  <input
                    type="date"
                    value={newBlockDate}
                    onChange={e => setNewBlockDate(e.target.value)}
                  />
                </div>
                <button className="btn-primary" onClick={addBlockedDate}>Add</button>
              </div>
              <ul>
                {blockedDates.map(date => (
                  <li key={date}>
                    {date}
                    <button className="btn-icon delete" onClick={() => removeBlockedDate(date)} title="Remove">
                      <i className="fas fa-trash-alt" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default TestDrives;