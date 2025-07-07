import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminHeader from './components/AdminHeader';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import About from './pages/About';
import Contact from './pages/Contact';
import VehicleDetail from './pages/VehicleDetail';
import VehicleBodyType from './pages/VehicleBodyType';
import Admin from './pages/Admin';
import AdminVehicles from './pages/AdminVehicles';
import AdminVehicleForm from './pages/AdminVehicleForm';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminWorkingHours from './pages/AdminWorkingHours';
import AdminContactMessages from './pages/AdminContactMessages';
import AdminReviews from './pages/AdminReviews';
import AdminLogin from './pages/AdminLogin';
import Reviews from './pages/Reviews';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Home />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/inventory" element={
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Inventory />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/about" element={
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <About />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/contact" element={
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Contact />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/reviews" element={
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Reviews />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/vehicle/:id" element={
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <VehicleDetail />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/vehicles/:bodyType" element={
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <VehicleBodyType />
              </main>
              <Footer />
            </div>
          } />
          
          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <div className="min-h-screen flex flex-col">
                <AdminHeader />
                <main className="flex-1">
                  <Admin />
                </main>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/admin/vehicles" element={
            <ProtectedRoute>
              <div className="min-h-screen flex flex-col">
                <AdminHeader />
                <main className="flex-1">
                  <AdminVehicles />
                </main>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/admin/vehicles/new" element={
            <ProtectedRoute>
              <div className="min-h-screen flex flex-col">
                <AdminHeader />
                <main className="flex-1">
                  <AdminVehicleForm />
                </main>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/admin/vehicles/:id" element={
            <ProtectedRoute>
              <div className="min-h-screen flex flex-col">
                <AdminHeader />
                <main className="flex-1">
                  <AdminVehicleForm />
                </main>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute>
              <div className="min-h-screen flex flex-col">
                <AdminHeader />
                <main className="flex-1">
                  <AdminAnalytics />
                </main>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/admin/working-hours" element={
            <ProtectedRoute>
              <div className="min-h-screen flex flex-col">
                <AdminHeader />
                <main className="flex-1">
                  <AdminWorkingHours />
                </main>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/admin/contact-messages" element={
            <ProtectedRoute>
              <div className="min-h-screen flex flex-col">
                <AdminHeader />
                <main className="flex-1">
                  <AdminContactMessages />
                </main>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/admin/reviews" element={
            <ProtectedRoute>
              <div className="min-h-screen flex flex-col">
                <AdminHeader />
                <main className="flex-1">
                  <AdminReviews />
                </main>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
