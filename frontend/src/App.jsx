import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TicketsPage from './pages/TicketsPage';
import NewTicketPage from './pages/NewTicketPage';
import EditTicketPage from './pages/EditTicketPage';
import TicketDetailPage from './pages/TicketDetailPage';
import AdminTicketsPage from './pages/AdminTicketsPage';
import AdminDepartments from './pages/AdminDepartmentsPage';
import AdminDashboard from './pages/AdminDashboardPage';
import PresentationPage from './pages/PresentationPage';
import NotFoundPage from './pages/NotFoundPage';

import './styles/index.css';

function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user]);

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/register" element={<RegisterPage setUser={setUser} />} />
          <Route path="/presentation" element={<PresentationPage />} />
          <Route path="/sih-ppt" element={<PresentationPage />} />

          <Route element={<ProtectedRoute user={user} allowedRoles={['customer', 'admin', 'support']} />}>
            <Route path="/tickets" element={<TicketsPage user={user} />} />
            <Route path="/tickets/new" element={<NewTicketPage user={user} />} />
            <Route path="/tickets/:id/edit" element={<EditTicketPage user={user} />} />
            <Route path="/tickets/:id" element={<TicketDetailPage user={user} />} />
          </Route>

          <Route element={<ProtectedRoute user={user} allowedRoles={['admin', 'support']} />}>
            <Route path="/admin/tickets" element={<AdminTicketsPage user={user} />} />
            <Route path="/admin/departments" element={<AdminDepartments user={user} />} />
            <Route path="/admin/dashboard" element={<AdminDashboard user={user} />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;