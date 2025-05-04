// CTASection.jsx
import { Link } from 'react-router-dom';

const CTASection = ({ title, description, buttonText, buttonLink }) => {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-content">
          <h2>{title}</h2>
          <p>{description}</p>
          <Link to={buttonLink} className="btn-primary">{buttonText}</Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;