import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './adminLogin.css'; // Import CSS file for styling
import Body from '../src/Body';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [body , setBody] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const url = 'https://edumax.fly.dev/login';
        const uri = 'http://localhost:3000/login'
      const response = await axios.post(url, { username, password });
      console.log(response.data)
      if (response.data.success) {
        localStorage.setItem('authToken', response.data.token);
        navigate('/dashboard'); 
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/admin/forgot-password', { email });
      if (response.data.success) {
        setMessage('Password reset link sent to your email.');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="admin-login-container">
      <h2>Edumax Admin Login</h2>
      {forgotPassword ? (
        <form onSubmit={handleForgotPassword} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
          <button type="submit">Send Reset Link</button>
          <button type="button" onClick={() => setForgotPassword(false)}>Back to Login</button>
        </form>
      ) : (
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit">Login</button>
          <button type="button" onClick={() => setForgotPassword(true)}>Forgot Password?</button>
        </form>
      )}
    </div>
  );
};

export default AdminLogin;
