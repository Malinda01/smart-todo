import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Send the login credentials to the backend
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      // 2. The backend sends back a token. Save it to the browser's local storage!
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userName', response.data.user.name);

      // 3. Redirect to the main dashboard page
      navigate('/');
      
    } catch (err) {
      // Catch invalid credentials
      setError(err.response?.data?.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h1>Mindflow</h1>
        <h2>Master your focus,<br/>one task at a time.</h2>
        <p>A cognitive assistant designed for high-achievers who value serenity and hyper-focused productivity.</p>
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <div className="auth-header">
            <h3>Welcome back</h3>
            <p>Enter your credentials to enter your flow.</p>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="name@company.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <button type="submit" className="primary-btn">
              Sign in to Dashboard →
            </button>
          </form>

          <div className="auth-links">
            <Link to="/forgot-password">Forgot password?</Link>
            <Link to="/register">Sign up</Link>
          </div>

          <div className="auth-footer">
            <p>Enterprise-grade 256-bit encryption active</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;