import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/Navbar.css';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const role = (user?.role || '').toLowerCase();

  return (
    <nav className="navbar">
      <div className="nav-left">
        <NavLink to="/" className="nav-logo">Helpdesk.</NavLink>
      </div>

      <div className="nav-links">
        {!user && (
          <>
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>HOME</NavLink>
            <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>LOGIN</NavLink>
            <NavLink to="/register" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>REGISTER</NavLink>
          </>
        )}

        {user && role === 'customer' && (
          <>
            <NavLink to="/tickets" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>MY TICKETS</NavLink>
            <NavLink to="/tickets/new" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>NEW TICKET</NavLink>
          </>
        )}

        {user && (role === 'admin' || role === 'support') && (
          <>
            <NavLink to="/admin/tickets" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>TICKETS</NavLink>
            <NavLink to="/admin/departments" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>DEPARTMENTS</NavLink>
            <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>DASHBOARD</NavLink>
          </>
        )}
      </div>

      <div className="nav-right">
        <button 
          onClick={toggleTheme} 
          className="theme-toggle-btn" 
          aria-label="Toggle Dark and Light Mode"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          <svg className="theme-icon" viewBox="0 0 24 24" width="20" height="20" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            <path d="M12 3a9 9 0 0 0 0 18V3z" fill="currentColor" />
          </svg>
        </button>

        {!user ? (
          <NavLink to="/login" className="btn-primary nav-action-btn">LOG IN</NavLink>
        ) : (
          (role === 'admin' || role === 'support') && location.pathname !== '/admin/departments' ? (
            <div className="admin-nav-actions">
              <NavLink to="/tickets/new" className="btn-primary nav-action-btn">+ NEW TICKET</NavLink>
              <button onClick={handleLogout} className="btn-outline nav-logout-small">LOG OUT</button>
            </div>
          ) : (
            <button onClick={handleLogout} className="btn-primary nav-action-btn">LOG OUT</button>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;