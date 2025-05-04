import React, { useState, useEffect } from 'react';
import '../styles.css';
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { app } from '../../../src/firebase';

const db = getFirestore(app);

const TestDrives = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

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
                    {['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'].map(t=><option key={t} value={`${t}:00`}>{t.replace(':00','')} {t<'12:00'?'AM':'PM'}</option>)}
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
      </section>
    </>
  );
};

export default TestDrives;