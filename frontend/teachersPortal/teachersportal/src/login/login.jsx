import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth';
import './login.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [credentials, setCredentials] = useState({
        username: '',
        email: '',
        password: ''
    });

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
            navigate('/dashboard');
        }, 2000); // Simulate an API call delay
    };

    return (
        <div className="login-container">
            <div className='login-form'>
                <center><h3>MATINYANI MIXED STAFF</h3></center> 
                <div className="">
                    <h2 style={{color:"blue"}}>Teachers Portal</h2>
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
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                value={credentials.email} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="form-group">
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
