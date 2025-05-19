// components/Sidebar.jsx
const Sidebar = ({ isOpen, onClose, children }) => {
  const handleOverlayClick = (e) => {
    // Only close if clicked directly on the overlay (not inside the sidebar)
    if (e.target.classList.contains("sidebar-overlay")) {
      onClose();
    }
  };

  return (
    <div
      className={`sidebar-overlay ${isOpen ? "open" : ""}`}
      onClick={handleOverlayClick}
    >
      <div className="sidebar">
        <div className="sidebar-header">
          <button className="sidebar-close" onClick={onClose}>
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
