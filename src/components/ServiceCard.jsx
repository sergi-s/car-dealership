// ServiceCard.jsx
const ServiceCard = ({ service }) => {
    return (
      <div className="service-card">
        <div className="service-icon">
          <i className={service.icon}></i>
        </div>
        <h3>{service.title}</h3>
        <p>{service.description}</p>
      </div>
    );
  };
  
  export default ServiceCard;