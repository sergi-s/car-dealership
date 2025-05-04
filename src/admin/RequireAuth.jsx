import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check for admin session in local or session storage
    const adminSession = localStorage.getItem('adminSession') || sessionStorage.getItem('adminSession');
    
    if (adminSession) {
      try {
        // Parse the session data
        const session = JSON.parse(adminSession);
        
        // Check if session is valid (you could add more validation here)
        if (session && session.username && session.timestamp) {
          // Optionally implement session expiry check
          const currentTime = new Date().getTime();
          const sessionTime = session.timestamp;
          const sessionMaxAge = 24 * 60 * 60 * 1000; // 24 hours
          
          if (currentTime - sessionTime < sessionMaxAge) {
            setAuthed(true);
          } else {
            // Session expired
            localStorage.removeItem('adminSession');
            sessionStorage.removeItem('adminSession');
            setAuthed(false);
          }
        } else {
          setAuthed(false);
        }
      } catch (error) {
        console.error("Error reading admin session:", error);
        setAuthed(false);
      }
    } else {
      setAuthed(false);
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return null; // or a spinner component
  }
  if (!authed) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return children;
};

export default RequireAuth;
