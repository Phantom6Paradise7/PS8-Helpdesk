import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/authApi';
import '../styles/AuthPages.css';

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const payload = {
        email: loginData.email.trim(),
        password: loginData.password
      };
      const response = await loginUser(payload);
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);

      const userRole = (response.user.role || '').toLowerCase();
      if (userRole === 'customer') {
        navigate('/tickets');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setLoginError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-single-container">
        <header className="auth-header auth-header-center">
          <span className="pill-badge">ACCOUNT</span>
          <h1 className="auth-title">Log in.</h1>
        </header>

        <div className="auth-card auth-single-card">
          <h2 className="auth-card-title">Welcome back</h2>
          <p className="auth-card-subtitle">Pick up where you left off.</p>

          {loginError && <div className="auth-error">{loginError}</div>}

          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <div className="auth-field">
              <label className="auth-field-label">EMAIL</label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-field-label">PASSWORD</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                placeholder="Your password"
                required
              />
            </div>

            <button type="submit" className="btn-primary auth-submit-btn" disabled={isLoggingIn}>
              {isLoggingIn ? 'LOGGING IN...' : 'LOG IN'}
            </button>
          </form>

          <div className="auth-switch-prompt">
            <span>New here? Create an account.</span>
            <Link to="/register" className="auth-switch-link">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
