import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth';
import './login.css';
import tp from "../assets/teachers.webp";
import RegisterPage from './Register';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [notification, setNotification] = useState('');
    const [showRegister, setShowRegister] = useState(false);

    const setAuthStatus = (status) => {
        localStorage.setItem('isLoggedIn', status);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value
        });
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('https://edumax.fly.dev/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });
            const data = await response.json();
            setLoading(false);
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username',credentials.username)
                setAuthStatus(true);
                navigate('/dashboard');
            } else {
                setNotification(data.message || "Username not found in the system");
            }
        } catch (error) {
            setLoading(false);
            setNotification("Error occurred while logging in");
        }
    };

    const toggleRegister = () => {
        setShowRegister(!showRegister);
    };

    return (
        <div className="register-container">
            {showRegister ? (
                <RegisterPage onClose={toggleRegister} />
            ) : (
                <div className='login-form'>
                    <center><img src={tp} alt="logo" className='login-icon' />
                    <h6 style={{ margin: 0, marginBottom: "7%" }}>MATINYANI MIXED STAFF</h6>
                    </center>
                   
                    <hr style={{ marginBottom: "15%" }} />
                    <div className="" style={{ marginBottom: "10%" }}>
                        <form onSubmit={handleLogin} className='login-form-item'>
                            <div className="login-form-group">
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
                            <div className="login-form-group" style={{ marginBottom: "15%" }}>
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
                            <button type="submit" disabled={loading} className='button'>
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                     <center>
                     {loading && <div className="spinning"></div>}
                        </center>   
                     <center>
                     {notification && <p style={{ color: "red", fontSize: "0.9rem" }}>{notification}</p>} 
                        </center>  
                    </div>
                    <center>
                        <p style={{ marginBottom: "7%", cursor: "pointer" }} onClick={toggleRegister}>
                            Register
                        </p>
                        <p style={{ marginBottom: "10%", cursor: "pointer" }}>Forgot Your Password ?</p>
                    </center>
                    <hr />
                    <footer className='footer' style={{ marginTop: "20px" }}>
                        <div>
                            <center>
                                <a href='https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox?compose=DmwnWtMmVNSlrNvwFZsxGBDxxrXDpQdXcjZJMRcJNjFgrFLPStGSHrKKFgmxwNlDjQtHmgqzRkRG' style={{ fontSize: "0.9rem", color: "white" }}>
                                    Systems Developed by Blackie-Networks
                                </a>
                            </center>
                        </div>
                    </footer>
                </div>
            )}
        </div>
    );
};

export default LoginPage;
