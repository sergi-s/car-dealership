// PageHero.jsx
const PageHero = ({ title, subtitle, className }) => {
    return (
      <section className={`page-hero ${className || ''}`}>
        <div className="container">
          <div className="page-hero-content">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
        </div>
      </section>
    );
  };
  
  export default PageHero;