// ValueCard.jsx
const ValueCard = ({ value }) => {
    return (
      <div className="value-card">
        <div className="value-icon">
          <i className={value.icon}></i>
        </div>
        <h3>{value.title}</h3>
        <p>{value.description}</p>
      </div>
    );
  };
  
  export default ValueCard;