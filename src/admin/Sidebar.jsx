import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/styles.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove admin session from both storage types
    localStorage.removeItem('adminSession');
    sessionStorage.removeItem('adminSession');
    
    // Redirect to login page
    navigate('/admin/login');
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <img src="/api/placeholder/160/60" alt="Premium Motors Logo" />
      </div>
      <nav className="admin-nav">
        <ul>
          <li>
            <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/inventory" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-car"></i> Inventory
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/add-vehicle" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-plus-circle"></i> Add Vehicle
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/inquiries" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-envelope"></i> Inquiries
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/test-drives" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-calendar-alt"></i> Test Drives
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/customers" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-users"></i> Customers
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/settings" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-cog"></i> Settings
            </NavLink>
          </li>
          <li>
            <button 
              onClick={handleLogout} 
              className="logout-button"
            >
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;