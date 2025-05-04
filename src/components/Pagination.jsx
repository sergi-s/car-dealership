// Pagination.jsx
import { useState } from 'react';

const Pagination = ({ totalPages, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (onPageChange) onPageChange(page);
  };
  
  const renderPageButtons = () => {
    const buttons = [];
    
    // First page
    buttons.push(
      <button 
        key={1}
        className={`page-btn ${currentPage === 1 ? 'active' : ''}`}
        onClick={() => handlePageChange(1)}
      >
        1
      </button>
    );
    
    // Show ellipsis if needed
    if (currentPage > 3) {
      buttons.push(<span key="ellipsis-1" className="page-ellipsis">...</span>);
    }
    
    // Current page neighborhood
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue; // Skip first and last page as they're handled separately
      buttons.push(
        <button 
          key={i}
          className={`page-btn ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    
    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      buttons.push(<span key="ellipsis-2" className="page-ellipsis">...</span>);
    }
    
    // Last page
    if (totalPages > 1) {
      buttons.push(
        <button 
          key={totalPages}
          className={`page-btn ${currentPage === totalPages ? 'active' : ''}`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }
    
    return buttons;
  };
  
  return (
    <div className="pagination">
      <button 
        className={`page-btn prev ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <i className="fas fa-chevron-left"></i>
      </button>
      
      {renderPageButtons()}
      
      <button 
        className={`page-btn next ${currentPage === totalPages ? 'disabled' : ''}`}
        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default Pagination;