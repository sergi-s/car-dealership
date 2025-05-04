import React, { useState } from 'react';
import '../styles.css';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence, signOut } from 'firebase/auth';
import { app } from '../../firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth(app);
    const db = getFirestore(app);
    try {
      // Set persistence based on 'Remember me' checkbox
      await setPersistence(
        auth,
        remember ? browserLocalPersistence : browserSessionPersistence
      );
      // Sign in and verify admin privileges
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;
      // Verify user is in admins collection (read-only)
      const adminSnap = await getDoc(doc(db, 'admins', user.uid));
      if (!adminSnap.exists()) {
        await signOut(auth);
        throw new Error('Access denied: not an admin');
      }
      navigate('/admin/dashboard');
    } catch (err) {
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