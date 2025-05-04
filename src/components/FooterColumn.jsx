// FooterColumn.jsx
const FooterColumn = ({ title, children }) => {
    return (
      <div className="footer-column">
        {title && <h3>{title}</h3>}
        {children}
      </div>
    );
  };
  
  export default FooterColumn;