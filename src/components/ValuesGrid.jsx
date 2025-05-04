// ValuesGrid.jsx
import ValueCard from './ValueCard';

const ValuesGrid = () => {
  const values = [
    {
      id: 1,
      icon: 'fas fa-award',
      title: 'Excellence',
      description: 'We maintain the highest standards in every aspect of our business, from vehicle selection to customer service.'
    },
    {
      id: 2,
      icon: 'fas fa-handshake',
      title: 'Integrity',
      description: 'We believe in transparent, honest relationships with our customers, built on trust and mutual respect.'
    },
    {
      id: 3,
      icon: 'fas fa-heart',
      title: 'Passion',
      description: 'Our team shares a genuine love for exceptional automobiles and the experiences they provide.'
    },
    {
      id: 4,
      icon: 'fas fa-users',
      title: 'Community',
      description: 'We\'re committed to making a positive impact in our local community through various initiatives and partnerships.'
    }
  ];
  
  return (
    <section className="about-values">
      <div className="container">
        <h2>Our Values</h2>
        <div className="values-grid">
          {values.map(value => (
            <ValueCard key={value.id} value={value} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesGrid;