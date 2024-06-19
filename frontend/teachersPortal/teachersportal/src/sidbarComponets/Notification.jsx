import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import './css//Notification.css';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [message, setMessage] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserRole(decodedToken.rank);
        }
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('https://edumax.fly.dev/noti/get/notifications');
            if (!response.ok) {
                throw new Error(`Error fetching notifications: ${response.statusText}`);
            }
            const data = await response.json();
            setNotifications(data);
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('https://edumax.fly.dev/noti/post/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message, dueDate, token })
            });
            if (!response.ok) {
                throw new Error(`Error creating notification: ${response.statusText}`);
            }
            const newNotification = await response.json();
            setNotifications([newNotification, ...notifications]);
            setMessage('');
            setDueDate('');
            setLoading(false);
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`https://edumax.fly.dev/noti/delete/notifications/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token })
            });
            if (!response.ok) {
                throw new Error(`Error deleting notification: ${response.statusText}`);
            }
            setNotifications(notifications.filter(notification => notification._id !== id));
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    return (
        <div className="notification-container">
            {['principal', 'deputy', 'senior teacher'].includes(userRole) && (
                <div className="notification-form-card">
                    <form className="notification-form" onSubmit={handleSubmit}>
                        <textarea
                            placeholder="Notification message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        ></textarea>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                        />
                        <button type="submit">Post Notification</button>
                        {loading && <div className="loading">Loading...</div>}
                        {error && <div className="error">{error}</div>}
                    </form>
                </div>
            )}
            <div className="notification-list-card">
               <center><h2 className='notification-title'>Staff Notifications</h2></center> 
                <div className="notifications-list">
                    {notifications.map(notification => (
                        <div key={notification._id} className="notification-card">
                            <p><strong>Message:</strong> {notification.message}</p>
                            <p><strong>Due Date:</strong> {new Date(notification.dueDate).toLocaleDateString()}</p>
                            <p style={{color:"green"}} ><strong >Posted On:</strong> {new Date(notification.createdAt).toLocaleString()}</p>
                            <p><strong>From {notification.createdBy}</strong></p>
                            {['principal', 'deputy', 'senior teacher'].includes(userRole) && (
                                <button onClick={() => handleDelete(notification._id)}>Delete</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            
        </div>
    );
};

export default Notification;
