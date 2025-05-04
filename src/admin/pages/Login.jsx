import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { app } from '../../firebase';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import bcrypt from 'bcryptjs';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const adminSession = localStorage.getItem('adminSession') || sessionStorage.getItem('adminSession');
    if (adminSession) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const db = getFirestore(app);
      
      // Find the admin with the provided username
      const adminsRef = collection(db, 'admins');
      const q = query(adminsRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error('Invalid username or password');
      }
      
      // Get the admin document
      const adminDoc = querySnapshot.docs[0];
      const adminData = adminDoc.data();
      
      // Verify password using bcrypt
      const passwordMatch = await bcrypt.compare(password, adminData.passwordHash);
      
      if (!passwordMatch) {
        throw new Error('Invalid username or password');
      }
      
      // Create admin session
      const adminSession = {
        id: adminDoc.id,
        username: adminData.username,
        timestamp: new Date().getTime()
      };
      
      // Store in local or session storage based on remember preference
      if (remember) {
        localStorage.setItem('adminSession', JSON.stringify(adminSession));
      } else {
        sessionStorage.setItem('adminSession', JSON.stringify(adminSession));
      }
      
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <img src="/api/placeholder/200/80" alt="Premium Motors Logo" />
      </div>
      <h2>Admin Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <div className="input-with-icon">
            <i className="fas fa-user"></i>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
        <button type="submit" className="btn-primary">Log In</button>
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