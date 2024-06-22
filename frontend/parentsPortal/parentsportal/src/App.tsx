import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Componets/Layout';
import Dashboard from './Componets/pages/Dashboard';
import { UserProvider } from './Componets/context';
import LoginPage from './Componets/pages/Login';
import ProtectedRoute from './ProtectedRoute';
import Grades from './Componets/pages/Transcripts';

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/Transcripts" element={<ProtectedRoute element={<Grades/>} />} />
            <Route path="/attendance" element={<ProtectedRoute element={<div>Attendance</div>} />} />
            <Route path="/school-events" element={<ProtectedRoute element={<div>School Events</div>} />} />
            <Route path="/communication" element={<ProtectedRoute element={<div>Communication</div>} />} />
            <Route path="/payments" element={<ProtectedRoute element={<div>Payments</div>} />} />
            <Route path="/support" element={<ProtectedRoute element={<div>Support</div>} />} />
            <Route path="/parent-dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/fees" element={<ProtectedRoute element={<div>Fees</div>} />} />
            <Route path="/parent-profile" element={<ProtectedRoute element={<div>Parent Profile</div>} />} />
          </Routes>
        </Layout>
      </Router>
    </UserProvider>
  );
};

export default App;
