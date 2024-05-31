import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import tp from "../assets/teachers.webp";

const RegisterPage = ({ onClose }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState('');
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
        email: '',
        name: '',
        gender: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value
        });
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('https://edumax.fly.dev/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });
            const data = await response.json();
            setLoading(false);
            if (response.ok) {
                setNotification('User registered successfully');
                navigate('/');
                onClose(); // Close the registration modal
            } else {
                setNotification(data.message);
            }
        } catch (error) {
            setLoading(false);
            setNotification('Error registering user');
        }
    };

    return (
        <div className="register-container">
            <div className='register-form-container'>
                <center><img src={tp} alt="logo"style={{margin:0}} className='register-icon' />
                <h6 style={{ margin: 0, marginBottom: "5%" }}>MATINYANI MIXED STAFF</h6>
                </center>
                <h6 className="h6">Registration Form</h6>
                <center><p style={{color:"green",margin:0,fontSize:"0.7rem"}}>Make sure Your email is in  School System</p></center>
                <hr className="separator" />
                <form onSubmit={handleRegister} >
                    <div className="login-form-group">
                        <label htmlFor="email" className="label">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="login-form-group">
                        <label htmlFor="username" className="label">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="login-form-group">
                        <label htmlFor="password" className="label">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="login-form-group">
                        <label htmlFor="name" className="label">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={credentials.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="login-form-group">
                        <label htmlFor="gender" className="label">Gender:</label>
                        <select
                            id="gender"
                            name="gender"
                            className='register-select'
                            value={credentials.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <center>
                    <button type="submit" className="register-button" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                    </center>   
                </form>
              <center>
              {loading && <div className="spinner">Loading...</div>}
                {notification && <p className="notification">{notification}</p>} 
              <button className="register-button" onClick={onClose}>Close</button>
                </center>  
            </div>
        </div>
    );
};

export default RegisterPage;
