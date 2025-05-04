// HomeHero.jsx
import { Link } from 'react-router-dom';

const HomeHero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1>Find Your Perfect Drive</h1>
          <p>Premium selection of luxury and performance vehicles</p>
          <div className="hero-buttons">
            <Link to="/inventory" className="btn-primary">Browse Inventory</Link>
            <Link to="/about#contact" className="btn-secondary">Contact Us</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;