import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth';
import './login.css';
import tp from "../assets/teachers.webp";

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    // Function to set authentication status in local storage
    const setAuthStatus = (status) => {
        localStorage.setItem('isLoggedIn', status);
    };

    // Function to get authentication status from local storage
    const getAuthStatus = () => {
        return localStorage.getItem('isLoggedIn') === 'true';
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value
        });
    };

    const handleLogin = (event) => {
        event.preventDefault();
        setLoading(true);

        // Simulate login logic
        setTimeout(() => {
            login();
            setLoading(false);
            setAuthStatus(true); // Set authentication status in local storage upon successful login
            navigate('/dashboard');
        }, 2000); // Simulate an API call delay
    };

    return (
        <div className="login-container">
            <div className='login-form'>
            <center> <img src={tp} alt="logo" className='login-icon'></img>
               <h6 style={{margin:0,marginBottom : "7%"}}>MATINYANI MIXED STAFF</h6></center> 
               <hr style={{marginBottom:"15%"}} ></hr>
                <div className="" style={{marginBottom:"10%"}} >
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="username">Username:</label>
                            <input 
                                type="text" 
                                id="username" 
                                name="username" 
                                value={credentials.username} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="form-group" style={{marginBottom:"15%"}}>
                            <label htmlFor="password">Password:</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                value={credentials.password} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    {loading && <div className="spinner">Loading...</div>}
                </div>
                      <center><p style={{marginBottom:"15%",cursor:"pointer"}}>Forgot Your Password ?</p></center>
                <hr></hr>
                <footer className='footer' style={{marginTop:"20px"}}>
                    <div>
                        <center>
                            <a href='https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox?compose=DmwnWtMmVNSlrNvwFZsxGBDxxrXDpQdXcjZJMRcJNjFgrFLPStGSHrKKFgmxwNlDjQtHmgqzRkRG' style={{fontSize:"0.9rem",color:"white"}}>
                                Systems Developed by Blackie-Networks
                            </a>
                        </center>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LoginPage;
