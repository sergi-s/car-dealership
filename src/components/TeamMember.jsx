// TeamMember.jsx
const TeamMember = ({ member }) => {
    return (
      <div className="team-member">
        <div className="member-image">
          <img src={member.image} alt={member.name} />
        </div>
        <h3>{member.name}</h3>
        <p className="member-title">{member.title}</p>
        <p className="member-bio">{member.bio}</p>
      </div>
    );
  };
  
  export default TeamMember;