// App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import InventoryPage from './pages/InventoryPage';
import AboutPage from './pages/AboutPage';
import SchedulePage from './pages/SchedulePage';
import VehicleDetailPage from './pages/VehicleDetailPage';
import AdminLayout from './admin/AdminLayout';
import RequireAuth from './admin/RequireAuth';
import LoginPage from './admin/pages/Login';
import DashboardPage from './admin/pages/Dashboard';
import InventoryPageAdmin from './admin/pages/Inventory';
import AddVehiclePage from './admin/pages/AddVehicle';
import EditVehiclePage from './admin/pages/EditVehicle';
import InquiriesPage from './admin/pages/Inquiries';
import TestDrivesPage from './admin/pages/TestDrives';
import CustomersPage from './admin/pages/Customers';
import SettingsPage from './admin/pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/inventory/:id" element={<VehicleDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        {/* Add more routes as needed */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route element={<RequireAuth><AdminLayout /></RequireAuth>}>
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/inventory" element={<InventoryPageAdmin />} />
          <Route path="/admin/add-vehicle" element={<AddVehiclePage />} />
          <Route path="/admin/inventory/edit/:id" element={<EditVehiclePage />} />
          <Route path="/admin/inquiries" element={<InquiriesPage />} />
          <Route path="/admin/test-drives" element={<TestDrivesPage />} />
          <Route path="/admin/customers" element={<CustomersPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;