import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { app } from '../../firebase';
import '../styles.css';

const db = getFirestore(app);

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      const q = collection(db, 'inquiries');
      const snap = await getDocs(q);
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setInquiries(items);
      setLoading(false);
    };
    fetchInquiries();
  }, []);

  const handleDelete = async id => {
    if (!window.confirm('Delete this inquiry?')) return;
    await deleteDoc(doc(db, 'inquiries', id));
    setInquiries(prev => prev.filter(i => i.id !== id));
  };

  const handleMarkResponded = async id => {
    const ref = doc(db, 'inquiries', id);
    await updateDoc(ref, { status: 'responded' });
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: 'responded' } : i));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className="admin-header">
        <h1>Inquiries Management</h1>
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
          <div className="stat-icon"><i className="fas fa-envelope"></i></div>
          <div className="stat-info"><h3>48</h3><p>Total Inquiries</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-envelope-open"></i></div>
          <div className="stat-info"><h3>30</h3><p>Responded</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-clock"></i></div>
          <div className="stat-info"><h3>18</h3><p>Pending</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-chart-line"></i></div>
          <div className="stat-info"><h3>12</h3><p>Today&apos;s Inquiries</p></div>
        </div>
      </section>

      <section className="inventory-controls" style={{ margin: '20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="search-box" style={{ position: 'relative', width: '300px' }}>
            <input type="text" placeholder="Search inquiries..." style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)' }} />
            <i className="fas fa-search" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          </div>
          <div className="filter-actions" style={{ display: 'flex', gap: '10px' }}>
            <select style={{ padding: '0.75rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', backgroundColor: 'white' }}>
              <option>All Status</option>
              <option>New</option>
              <option>In Progress</option>
              <option>Responded</option>
              <option>Closed</option>
            </select>
            <select style={{ padding: '0.75rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', backgroundColor: 'white' }}>
              <option>All Types</option>
              <option>Purchase Inquiry</option>
              <option>Test Drive Request</option>
              <option>Trade-In</option>
              <option>Financing</option>
              <option>Service</option>
              <option>Other</option>
            </select>
            <select style={{ padding: '0.75rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', backgroundColor: 'white' }}>
              <option>Sort by: Newest</option>
              <option>Sort by: Oldest</option>
              <option>Sort by: Name A-Z</option>
              <option>Sort by: Name Z-A</option>
            </select>
          </div>
        </div>
      </section>

      <section className="inventory-list">
        <div className="recent-card">
          <div className="card-content">
            <table className="admin-table">
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>Contact</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Interest</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map(i => (
                  <tr key={i.id}>
                    <td><input type="checkbox" /></td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <p style={{ fontWeight: 600 }}>{i.name}</p>
                        <p style={{ fontSize: '0.8rem', color: '#777' }}>{i.email}</p>
                        <p style={{ fontSize: '0.8rem', color: '#777' }}>{i.phone}</p>
                      </div>
                    </td>
                    <td>{i.subject}</td>
                    <td>{new Date(i.date).toLocaleDateString()}</td>
                    <td>{i.type}</td>
                    <td><span className={`status status-${i.status}`}>{i.status}</span></td>
                    <td>
                      <div className="table-actions">
                        <button className="btn-icon view" title="View"><i className="fas fa-eye" /></button>
                        {i.status !== 'responded' && (
                          <button className="btn-icon edit" title="Mark Responded" onClick={() => handleMarkResponded(i.id)}><i className="fas fa-reply" /></button>
                        )}
                        <button className="btn-icon delete" title="Delete" onClick={() => handleDelete(i.id)}><i className="fas fa-trash-alt" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <select style={{ padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', marginRight: '10px' }}>
              <option>Bulk Actions</option>
              <option>Mark as Responded</option>
              <option>Mark as In Progress</option>
              <option>Delete Selected</option>
            </select>
            <button className="btn-outline" style={{ padding: '0.5rem 1rem' }}>Apply</button>
          </div>

          <div className="admin-pagination">
            <button className="page-btn prev disabled"><i className="fas fa-chevron-left" /></button>
            {[1,2,3].map(n => <button key={n} className={`page-btn${n===1?' active':''}`}>{n}</button>)}
            <button className="page-btn next"><i className="fas fa-chevron-right" /></button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Inquiries;