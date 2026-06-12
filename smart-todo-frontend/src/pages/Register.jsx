import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate(); // Used to redirect the user

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    try {
      // 1. Send the POST request to our backend
      await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password
      });

      // 2. If successful, redirect the user to the login page
      navigate('/login');
      
    } catch (err) {
      // 3. If the backend throws an error (like "Email already exists"), display it
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h1>Mindflow</h1>
        <h2>Begin your journey,<br/>one task at a time.</h2>
        <p>A cognitive assistant designed for high-achievers who value serenity and hyper-focused productivity.</p>
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <div className="auth-header">
            <h3>Create an account</h3>
            <p>Enter your details to get started.</p>
          </div>

          {/* Display error message if it exists */}
          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Full Name</label>
              <input 
                type="text" 
                placeholder="Malinda Amarakoon" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>

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
              Sign Up →
            </button>
          </form>

          <div className="auth-links">
            <span style={{color: "var(--text-muted)", fontSize: "0.9rem"}}>Already have an account?</span>
            <Link to="/login">Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;