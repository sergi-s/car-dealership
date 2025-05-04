import React from 'react';
import Sidebar from './Sidebar';
import '../styles/styles.css';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => (
  <div className="admin-layout">
    <Sidebar />
    <main className="admin-content">
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;