import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { app } from '../../firebase';
import { NavLink, Link } from 'react-router-dom';
import '../styles.css';

const db = getFirestore(app);

const Inventory = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      const q = collection(db, 'vehicles');
      const snap = await getDocs(q);
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setVehicles(items);
      setLoading(false);
    };
    fetchVehicles();
  }, []);

  const handleDelete = async id => {
    if (!window.confirm('Delete this vehicle?')) return;
    await deleteDoc(doc(db, 'vehicles', id));
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  const handleStatusChange = async (id, newStatus) => {
    const ref = doc(db, 'vehicles', id);
    await updateDoc(ref, { status: newStatus });
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <section className="inventory-list">
        <div className="recent-card">
          <div className="card-content">
            <table className="admin-table">
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>Vehicle</th>
                  <th>Stock No.</th>
                  <th>Price</th>
                  <th>Year</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map(v => (
                  <tr key={v.id}>
                    <td><input type="checkbox" /></td>
                    <td>{v.year} {v.make} {v.model}</td>
                    <td>{v.stock_number}</td>
                    <td>${v.price}</td>
                    <td>{v.year}</td>
                    <td>{v.body_type}</td>
                    <td><span className={`status status-${v.status}`}>{v.status}</span></td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/admin/inventory/edit/${v.id}`} className="btn-icon view" title="View" target="_blank"><i className="fas fa-eye" /></Link>
                        <NavLink to={`/admin/inventory/edit/${v.id}`} className="btn-icon edit" title="Edit"><i className="fas fa-edit" /></NavLink>
                        <button className="btn-icon delete" title="Delete" onClick={() => handleDelete(v.id)}><i className="fas fa-trash-alt" /></button>
                        {v.status !== 'sold' && (
                          <button className="btn-icon" title="Mark Sold" onClick={() => handleStatusChange(v.id, 'sold')}><i className="fas fa-check" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default Inventory;