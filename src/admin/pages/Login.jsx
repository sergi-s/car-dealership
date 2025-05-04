import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { signInWithEmailAndPassword, browserLocalPersistence, browserSessionPersistence, setPersistence } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true); // Default to remember for better UX
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the path user was trying to access before redirect to login
  const from = location.state?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const isAdmin = await checkAdminRole(user.uid);
          if (isAdmin) {
            // Store in session that user is admin to reduce DB queries
            sessionStorage.setItem('isAdmin', 'true');
            // Navigate to the original destination or dashboard
            navigate(from, { replace: true });
          } else {
            // If logged in but not admin, sign out
            await auth.signOut();
            sessionStorage.removeItem('isAdmin');
            setError('You do not have admin permissions');
          }
        } catch (error) {
          console.error('Auth state check error:', error);
          setError('Authentication verification failed. Please try again.');
        }
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [navigate, from]);

  // Function to check if the user has admin role
  const checkAdminRole = async (uid) => {
    try {
      const adminRef = doc(db, 'admins', uid);
      const adminDoc = await getDoc(adminRef);
      return adminDoc.exists() && adminDoc.data().role === 'admin';
    } catch (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Set persistence first
      const persistenceType = remember ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistenceType);

      // Sign in with Firebase Auth
      console.log('Attempting login with email:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user is admin
      const isAdmin = await checkAdminRole(user.uid);

      if (!isAdmin) {
        // Sign out if not admin
        await auth.signOut();
        sessionStorage.removeItem('isAdmin');
        throw new Error('You do not have admin permissions');
      }

      // Store admin status
      sessionStorage.setItem('isAdmin', 'true');
      
      // Navigate to the original destination or dashboard
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <img src="/api/placeholder/200/80" alt="Premium Motors Logo" />
      </div>
      <h2>Admin Login</h2>
      {from !== '/admin/dashboard' && (
        <p className="redirect-notice">
          Please log in to access <strong>{from}</strong>
        </p>
      )}
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <div className="input-with-icon">
            <i className="fas fa-user"></i>
            <input
              type="email"
              id="email"
              name="email"
              required
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-with-icon">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              id="password"
              name="password"
              required
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group form-checkbox">
          <input
            type="checkbox"
            id="remember"
            name="remember"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <label htmlFor="remember">Remember me</label>
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Logging In...' : 'Log In'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
      <div className="login-footer">
        <p>
          Forgot your password? <a href="#">Reset Password</a>
        </p>
        <p>
          Return to <Link to="/">Website</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;