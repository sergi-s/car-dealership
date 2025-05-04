// TeamGrid.jsx
import TeamMember from './TeamMember';

const TeamGrid = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Jonathan Reynolds',
      title: 'Founder & CEO',
      bio: 'With over 35 years in the luxury automotive industry, Jonathan\'s vision and leadership have shaped Premium Motors into the respected institution it is today.',
      image: '/api/placeholder/300/300'
    },
    {
      id: 2,
      name: 'Alexandra Chen',
      title: 'Sales Director',
      bio: 'Alexandra brings 15 years of expertise in luxury sales and customer relations, ensuring that every client receives personalized, attentive service.',
      image: '/api/placeholder/300/300'
    },
    {
      id: 3,
      name: 'Marcus Taylor',
      title: 'Service Manager',
      bio: 'A certified master technician with expertise across multiple luxury brands, Marcus leads our service department with precision and care.',
      image: '/api/placeholder/300/300'
    },
    {
      id: 4,
      name: 'Sophia Martinez',
      title: 'Customer Experience Director',
      bio: 'Sophia ensures that every interaction with Premium Motors exceeds expectations, from the showroom to post-purchase support.',
      image: '/api/placeholder/300/300'
    }
  ];
  
  return (
    <section className="about-team">
      <div className="container">
        <h2>Meet Our Leadership Team</h2>
        <div className="team-grid">
          {teamMembers.map(member => (
            <TeamMember key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamGrid;