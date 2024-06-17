const express = require('express');
const jwt = require('jsonwebtoken');
const Notification = require('../../public/models/notification');
const notifications = express.Router();

const verifyToken = (req, res, next) => {
    const token = req.body.token;
    if (!token) return res.status(403).send('No token provided.');
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(500).send('Failed to authenticate token.');
        
        req.userId = "Madam Mwaniki";
        req.userRole = "deputy"
        next();
    });
};

const isAuthorized = (role) => {
    return role === 'principal' || role === 'deputy' || role === 'senior teacher';
};

notifications.get('/get/notifications', async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).send('Error fetching notifications');
    }
});

notifications.post('/post/notifications', verifyToken, async (req, res) => {
    if (!isAuthorized(req.userRole)) {
        return res.status(403).send('You are not authorized to create notifications.');
    }

    const { message, dueDate } = req.body;

    if (!message || !dueDate) {
        return res.status(400).send('All fields are required');
    }

    try {
        const newNotification = new Notification({
            message,
            createdBy: req.userId,
            dueDate
        });
        await newNotification.save();
        res.status(201).json(newNotification);
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).send('Error creating notification');
    }
});

notifications.delete('/delete/notifications/:id', verifyToken, async (req, res) => {
    if (!isAuthorized(req.userRole)) {
        return res.status(403).send('You are not authorized to delete notifications.');
    }

    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.status(200).send('Notification deleted successfully');
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).send('Error deleting notification');
    }
});

module.exports = notifications;
