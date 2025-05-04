import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth, db } from '../firebase';
import { getDoc, doc } from 'firebase/firestore';
import { setPersistence, browserLocalPersistence } from 'firebase/auth';

const RequireAuth = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Set persistence to LOCAL to keep the user logged in
    setPersistence(auth, browserLocalPersistence)
      .catch(error => {
        console.error("Error setting auth persistence:", error);
      });
      
    // Check if there's a cached admin status to avoid unnecessary DB queries
    const cachedAdminStatus = sessionStorage.getItem('isAdmin');
    
    if (cachedAdminStatus === 'true') {
      setAuthed(true);
      setLoading(false);
      return;
    }
    
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log("User authenticated:", user.email);
        // Check if the user has admin role
        try {
          const adminRef = doc(db, 'admins', user.uid);
          const adminDoc = await getDoc(adminRef);
          
          if (adminDoc.exists() && adminDoc.data().role === 'admin') {
            console.log("Admin status verified");
            setAuthed(true);
            sessionStorage.setItem('isAdmin', 'true');
          } else {
            console.warn("User is not an admin:", user.email);
            setAuthed(false);
            sessionStorage.removeItem('isAdmin');
            // Sign out if not admin
            await auth.signOut();
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          setAuthed(false);
          sessionStorage.removeItem('isAdmin');
          await auth.signOut();
        }
      } else {
        console.log("No authenticated user");
        setAuthed(false);
        sessionStorage.removeItem('isAdmin');
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Add a retry mechanism for network errors
  useEffect(() => {
    if (!authed && !loading) {
      const currentUser = auth.currentUser;
      if (currentUser) {
        console.log("Retry admin verification for:", currentUser.email);
        // Retry once after a short delay in case of transient network issues
        const retryTimeout = setTimeout(async () => {
          try {
            const adminRef = doc(db, 'admins', currentUser.uid);
            const adminDoc = await getDoc(adminRef);
            
            if (adminDoc.exists() && adminDoc.data().role === 'admin') {
              console.log("Admin status verified on retry");
              setAuthed(true);
              sessionStorage.setItem('isAdmin', 'true');
            }
          } catch (error) {
            console.error("Retry verification failed:", error);
          }
        }, 1000);
        
        return () => clearTimeout(retryTimeout);
      }
    }
  }, [loading, authed]);

  if (loading) {
    return <div className="loading">Loading authentication status...</div>; // or a spinner component
  }
  
  if (!authed) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  
  return children;
};

export default RequireAuth;
