import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles.css';

const Dashboard = () => (
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
        <div className="stat-info"><h3>132</h3><p>Total Vehicles</p></div>
      </div>
      <div className="stat-card">
        <div className="stat-icon"><i className="fas fa-eye"></i></div>
        <div className="stat-info"><h3>2,458</h3><p>Website Visits (Last 7 days)</p></div>
      </div>
      <div className="stat-card">
        <div className="stat-icon"><i className="fas fa-calendar-check"></i></div>
        <div className="stat-info"><h3>24</h3><p>Test Drive Requests</p></div>
      </div>
      <div className="stat-card">
        <div className="stat-icon"><i className="fas fa-envelope"></i></div>
        <div className="stat-info"><h3>18</h3><p>New Inquiries</p></div>
      </div>
    </section>

    <section className="dashboard-charts">
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div className="recent-card" style={{ flex: 2 }}>
          <div className="card-header">
            <h3>Website Traffic</h3>
            <select>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 3 Months</option>
            </select>
          </div>
          <div className="card-content">
            <div style={{ height: '300px', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
              <p style={{ color: '#777' }}>Traffic Chart Placeholder</p>
            </div>
          </div>
        </div>
        <div className="recent-card" style={{ flex: 1 }}>
          <div className="card-header">
            <h3>Inventory by Type</h3>
          </div>
          <div className="card-content">
            <div style={{ height: '300px', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
              <p style={{ color: '#777' }}>Pie Chart Placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* TODO: Add recent activity and popular listings tables based on HTML */}
  </>
);

export default Dashboard;