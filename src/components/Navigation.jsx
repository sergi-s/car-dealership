// Navigation.jsx
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav>
      <ul className="main-nav">
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">Home</Link>
        </li>
        <li className={location.pathname === '/inventory' ? 'active' : ''}>
          <Link to="/inventory">Inventory</Link>
        </li>
        <li className={location.pathname === '/about' ? 'active' : ''}>
          <Link to="/about">About Us</Link>
        </li>
        <li className={location.pathname === '/schedule' ? 'active' : ''}>
          <Link to="/schedule">Schedule Test Drive</Link>
        </li>
        <li>
          <Link to="/admin/login" className="admin-link">Admin</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;