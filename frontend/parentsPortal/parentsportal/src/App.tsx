import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Componets/Layout';
import Dashboard from './Componets/pages/Dashboard';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes> 
          <Route path='/view-grades' element={<div>Grades</div>}/>
          <Route path='/attendance' element={<div>Attendance</div>}/>
          <Route path='/school-events' element={<div>School Events</div>}/>
          <Route path='/communication' element={<div>Comunication</div>}/>
          <Route path='/payments' element={<div>Payments</div>}/>
          <Route path="/" element={<Dashboard />} />
          <Route path="/support" element={<div>Support</div>} />
          <Route path="/parent-dashboard" element={<Dashboard />}/>
          <Route path="/fees" element={<div>Fees</div>} />
          <Route path="/parent-profile" element={<div>Parent Profile</div>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
