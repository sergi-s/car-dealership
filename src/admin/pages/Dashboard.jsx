import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { app } from '../../firebase';
import { Link } from 'react-router-dom';
import '../styles.css';

const db = getFirestore(app);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    testDrives: 0,
    inquiries: 0
  });
  const [inventoryByType, setInventoryByType] = useState([]);
  const [recentVehicles, setRecentVehicles] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch total vehicles count
        const vehiclesSnapshot = await getDocs(collection(db, 'vehicles'));
        const totalVehicles = vehiclesSnapshot.size;
        
        // Fetch pending test drives count
        const testDrivesQuery = query(collection(db, 'test_drives'), 
                                    where('status', '!=', 'completed'));
        const testDrivesSnapshot = await getDocs(testDrivesQuery);
        const testDrives = testDrivesSnapshot.size;
        
        // Fetch new inquiries
        const inquiriesQuery = query(collection(db, 'inquiries'),
                                    where('status', '!=', 'responded'));
        const inquiriesSnapshot = await getDocs(inquiriesQuery);
        const inquiries = inquiriesSnapshot.size;
        
        // Get vehicle counts by fuel type
        const vehicleData = vehiclesSnapshot.docs.map(doc => doc.data());
        const fuelTypes = {};
        vehicleData.forEach(vehicle => {
          const type = vehicle.fuelType || 'Other';
          fuelTypes[type] = (fuelTypes[type] || 0) + 1;
        });
        const fuelTypeData = Object.entries(fuelTypes).map(([name, count]) => ({ name, count }));
        setInventoryByType(fuelTypeData);
        
        // Get recent vehicles
        const recentVehiclesQuery = query(
          collection(db, 'vehicles'),
          orderBy('dateAdded', 'desc'),
          limit(5)
        );
        const recentVehiclesSnapshot = await getDocs(recentVehiclesQuery);
        const recentVehiclesList = recentVehiclesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRecentVehicles(recentVehiclesList);
        
        // Get recent inquiries
        const recentInquiriesQuery = query(
          collection(db, 'inquiries'),
          orderBy('date', 'desc'),
          limit(5)
        );
        const recentInquiriesSnapshot = await getDocs(recentInquiriesQuery);
        const recentInquiriesList = recentInquiriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRecentInquiries(recentInquiriesList);
        
        setStats({
          totalVehicles,
          testDrives,
          inquiries
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <>
      <div className="admin-header">
        <h1>Dashboard</h1>
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

      <section className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-car"></i></div>
          <div className="stat-info">
            {loading ? (
              <h3>Loading...</h3>
            ) : (
              <h3>{stats.totalVehicles}</h3>
            )}
            <p>Total Vehicles</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-calendar-check"></i></div>
          <div className="stat-info">
            {loading ? (
              <h3>Loading...</h3>
            ) : (
              <h3>{stats.testDrives}</h3>
            )}
            <p>Test Drive Requests</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-envelope"></i></div>
          <div className="stat-info">
            {loading ? (
              <h3>Loading...</h3>
            ) : (
              <h3>{stats.inquiries}</h3>
            )}
            <p>New Inquiries</p>
          </div>
        </div>
      </section>

      <section className="dashboard-charts">
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div className="recent-card" style={{ flex: 1 }}>
            <div className="card-header">
              <h3>Inventory by Type</h3>
            </div>
            <div className="card-content">
              {loading ? (
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p>Loading inventory data...</p>
                </div>
              ) : inventoryByType.length > 0 ? (
                <div style={{ height: '300px', padding: '20px' }}>
                  <table className="inventory-type-table">
                    <thead>
                      <tr>
                        <th>Fuel Type</th>
                        <th>Count</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryByType.map(item => (
                        <tr key={item.name}>
                          <td>{item.name}</td>
                          <td>{item.count}</td>
                          <td>{Math.round((item.count / stats.totalVehicles) * 100)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p>No inventory data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-recent">
        <div style={{ display: 'flex', gap: '20px' }}>
          <div className="recent-card" style={{ flex: 1 }}>
            <div className="card-header">
              <h3>Recent Vehicles</h3>
              <Link to="/admin/inventory" className="view-all">View All</Link>
            </div>
            <div className="card-content">
              {loading ? (
                <p>Loading recent vehicles...</p>
              ) : recentVehicles.length > 0 ? (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Vehicle</th>
                      <th>Price</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentVehicles.map(vehicle => (
                      <tr key={vehicle.id}>
                        <td>
                          <Link to={`/admin/inventory/edit/${vehicle.id}`}>
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </Link>
                        </td>
                        <td>${vehicle.price ? vehicle.price.toLocaleString() : 'N/A'}</td>
                        <td>
                          <span className={`status status-${vehicle.status?.toLowerCase() || 'available'}`}>
                            {vehicle.status || 'Available'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No vehicles found</p>
              )}
            </div>
          </div>
          
          <div className="recent-card" style={{ flex: 1 }}>
            <div className="card-header">
              <h3>Recent Inquiries</h3>
              <Link to="/admin/inquiries" className="view-all">View All</Link>
            </div>
            <div className="card-content">
              {loading ? (
                <p>Loading recent inquiries...</p>
              ) : recentInquiries.length > 0 ? (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Contact</th>
                      <th>Subject</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInquiries.map(inquiry => (
                      <tr key={inquiry.id}>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <p style={{ fontWeight: 600 }}>{inquiry.name}</p>
                            <p style={{ fontSize: '0.8rem', color: '#777' }}>{inquiry.email}</p>
                          </div>
                        </td>
                        <td>{inquiry.subject || inquiry.type || 'General Inquiry'}</td>
                        <td>{inquiry.date ? new Date(inquiry.date.seconds ? inquiry.date.toDate() : inquiry.date).toLocaleDateString() : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No inquiries found</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;