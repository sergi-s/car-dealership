// ServicesGrid.jsx
import ServiceCard from './ServiceCard';

const ServicesGrid = () => {
  const services = [
    {
      id: 1,
      icon: 'fas fa-car',
      title: 'New Vehicles',
      description: 'Explore our selection of brand new luxury vehicles with full manufacturer warranty.'
    },
    {
      id: 2,
      icon: 'fas fa-certificate',
      title: 'Certified Pre-Owned',
      description: 'Quality pre-owned vehicles that have passed our rigorous 150-point inspection.'
    },
    {
      id: 3,
      icon: 'fas fa-tools',
      title: 'Service & Maintenance',
      description: 'Factory-trained technicians to keep your vehicle in perfect condition.'
    },
    {
      id: 4,
      icon: 'fas fa-money-bill-wave',
      title: 'Financing Options',
      description: 'Competitive financing and lease options tailored to your needs.'
    }
  ];
  
  return (
    <section className="services">
      <div className="container">
        <h2>Our Services</h2>
        <div className="services-grid">
          {services.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;