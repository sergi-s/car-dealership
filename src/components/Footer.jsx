// Footer.jsx
import { Link } from 'react-router-dom';
import FooterColumn from './FooterColumn';
import SocialLinks from './SocialLinks';
import NewsletterForm from './NewsletterForm';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <FooterColumn>
            <div className="footer-logo">
              <img src="/api/placeholder/160/60" alt="Premium Motors Logo" />
            </div>
            <p>Premium Motors is your trusted luxury car dealership offering exceptional vehicles and outstanding customer service.</p>
            <SocialLinks />
          </FooterColumn>
          
          <FooterColumn title="Quick Links">
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/inventory">Inventory</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/about#contact">Contact</Link></li>
              <li><Link to="/financing">Financing</Link></li>
              <li><Link to="/service">Service</Link></li>
            </ul>
          </FooterColumn>
          
          <FooterColumn title="Contact Info">
            <ul className="contact-info">
              <li><i className="fas fa-map-marker-alt"></i> 123 Luxury Drive, Beverly Hills, CA 90210</li>
              <li><i className="fas fa-phone"></i> 1-800-555-1234</li>
              <li><i className="fas fa-envelope"></i> info@premiummotors.com</li>
              <li><i className="fas fa-clock"></i> Mon-Sat: 9AM - 7PM, Sun: 11AM - 5PM</li>
            </ul>
          </FooterColumn>
          
          <FooterColumn title="Newsletter">
            <p>Subscribe to receive updates on new arrivals and special offers.</p>
            <NewsletterForm />
          </FooterColumn>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Premium Motors. All Rights Reserved.</p>
          <ul className="footer-bottom-links">
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/sitemap">Sitemap</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;