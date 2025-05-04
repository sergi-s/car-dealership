// HeaderCTA.jsx
import { Link } from 'react-router-dom';

const HeaderCTA = () => {
  return (
    <div className="header-cta">
      <a href="tel:1-800-555-1234" className="phone">
        <i className="fas fa-phone"></i> 1-800-555-1234
      </a>
      <Link to="/schedule" className="btn-primary">Schedule Test Drive</Link>
    </div>
  );
};

export default HeaderCTA;