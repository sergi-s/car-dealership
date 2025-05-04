import React, { useState, useEffect } from 'react';
import '../styles.css';
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { app } from '../../../src/firebase';

const db = getFirestore(app);

const TestDrives = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrives = async () => {
      const q = collection(db, 'test_drives');
      const snap = await getDocs(q);
      setDrives(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchDrives();
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
            {/* TODO: implement create appointment form */}
          </div>
        )}
      </section>
    </>
  );
};

export default TestDrives;