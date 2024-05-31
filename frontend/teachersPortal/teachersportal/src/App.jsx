// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './Auth';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from './login/login.jsx';
import RegisterPage from './login/Register.jsx';
import Dashboard from './dashboard.jsx';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
