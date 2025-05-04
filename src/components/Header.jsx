// Header.jsx
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import HeaderCTA from './HeaderCTA';

const Header = () => {
  return (
    <header>
      <div className="container">
        <div className="logo">
          <img src="/api/placeholder/200/80" alt="Premium Motors Logo" />
        </div>
        <Navigation />
        <HeaderCTA />
      </div>
    </header>
  );
};

export default Header;