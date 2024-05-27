import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AuthProvider } from './Auth';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from './login/login.jsx';
import Dashboard from './dashboard.jsx';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                    <Routes>
                        <Route path="/" element={<LoginPage />} />
                        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                    </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
