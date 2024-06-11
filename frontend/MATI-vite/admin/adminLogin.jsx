import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners'; // Import spinner component
import './adminLogin.css'; // Import CSS file for styling

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [screenError, setScreenError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Spinner state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (window.innerWidth < 1200) {
      setScreenError('This system cannot be opened using small devices due to its functionality. Consider using larger screens and devices such as desktops or laptops.');
      return;
    }
    setIsLoading(true); // Show spinner
    try {
      const url = 'http://localhost:3000/admin/login/';
      const response = await axios.post(url, { username, password });
      setIsLoading(false); // Hide spinner
      if (response.data.success) {
        console.log(response.data)
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', username); 
        localStorage.setItem('loginTime', new Date().toISOString());
        navigate('/dashboard'); 
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setIsLoading(false); // Hide spinner
      console.log(err)
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
      <center><p className="admin-login-title">Edumax Admin Login</p></center>
      {forgotPassword ? (
        <form onSubmit={handleForgotPassword} className="admin-forgot-password-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
          <div className="button-group">
            <button type="submit" className="submit-button">Send Reset Link</button>
            <button type="button" onClick={() => setForgotPassword(false)} className="secondary-button">Back to Login</button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="admin-form-group">
            <label htmlFor="username" className="form-label">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-inputs"
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="password" className="form-label">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <hr></hr>
          {error && <div className="error-message">{error}</div>}
          {isLoading && (
            <div className="spinner-container">
              <ClipLoader color="#007bff" loading={isLoading} size={50} />
              <p className="spinner-text">Please wait, verifying admin...</p>
            </div>
          )}
          {screenError && <div className="error-message">{screenError}</div>}
          <div className="button-group">
            <button type="submit" className="submit-button">Login</button>
          </div>
          <div className="forgot-password-link">
            <a href="#" onClick={() => setForgotPassword(true)}>Forgot Password?</a>
          </div>
        </form>
      )}
      <hr></hr>
      <footer className="admin-login-footer">
        <div>
          <center>
            <a href='https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox?compose=DmwnWtMmVNSlrNvwFZsxGBDxxrXDpQdXcjZJMRcJNjFgrFLPStGSHrKKFgmxwNlDjQtHmgqzRkRG' className="footer-link">System Developed by Blackie-Networks</a>
          </center>
        </div>
      </footer>
    </div>
  );
};

export default AdminLogin;
