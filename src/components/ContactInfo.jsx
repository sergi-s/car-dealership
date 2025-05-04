// ContactInfo.jsx
import SocialLinks from './SocialLinks.jsx';

const ContactInfo = () => {
  return (
    <div className="contact-info-container">
      <h3>Our Information</h3>
      <div className="contact-info">
        <div className="contact-info-item">
          <i className="fas fa-map-marker-alt"></i>
          <div>
            <h4>Visit Our Showroom</h4>
            <p>123 Luxury Drive<br />Beverly Hills, CA 90210</p>
          </div>
        </div>
        <div className="contact-info-item">
          <i className="fas fa-phone"></i>
          <div>
            <h4>Call Us</h4>
            <p>Sales: 1-800-555-1234<br />Service: 1-800-555-5678</p>
          </div>
        </div>
        <div className="contact-info-item">
          <i className="fas fa-envelope"></i>
          <div>
            <h4>Email Us</h4>
            <p>Sales: sales@premiummotors.com<br />Service: service@premiummotors.com</p>
          </div>
        </div>
        <div className="contact-info-item">
          <i className="fas fa-clock"></i>
          <div>
            <h4>Business Hours</h4>
            <p>Monday-Saturday: 9AM - 7PM<br />Sunday: 11AM - 5PM</p>
          </div>
        </div>
      </div>
      <SocialLinks />
    </div>
  );
};

export default ContactInfo;