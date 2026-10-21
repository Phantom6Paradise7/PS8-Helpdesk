import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api/authApi';
import '../styles/AuthPages.css';

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });
  const [registerError, setRegisterError] = useState(null);
  const [registerSuccess, setRegisterSuccess] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const response = await loginUser(loginData);
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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerData.password.length < 8) {
      setRegisterError('Password must be at least 8 characters long.');
      return;
    }

    setIsRegistering(true);
    setRegisterError(null);
    setRegisterSuccess(null);

    try {
      const response = await registerUser(registerData);
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      setRegisterSuccess('Account created successfully!');

      const userRole = (response.user.role || '').toLowerCase();
      if (userRole === 'customer') {
        navigate('/tickets');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setRegisterError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <header className="auth-header">
        <span className="pill-badge">ACCOUNT</span>
        <h1 className="auth-title">Welcome in.</h1>
      </header>

      <div className="auth-cards-grid">
        <div className="auth-card">
          <h2 className="auth-card-title">Log in</h2>
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
        </div>

        <div className="auth-card">
          <h2 className="auth-card-title">Register</h2>
          <p className="auth-card-subtitle">New here? Create an account.</p>

          {registerError && <div className="auth-error">{registerError}</div>}
          {registerSuccess && <div className="auth-success">{registerSuccess}</div>}

          <form className="auth-form" onSubmit={handleRegisterSubmit}>
            <div className="auth-field">
              <label className="auth-field-label">FULL NAME</label>
              <input
                type="text"
                name="name"
                value={registerData.name}
                onChange={handleRegisterChange}
                placeholder="Your name"
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-field-label">EMAIL</label>
              <input
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-field-label">PASSWORD</label>
              <input
                type="password"
                name="password"
                value={registerData.password}
                onChange={handleRegisterChange}
                placeholder="At least 8 characters"
                required
                minLength="8"
              />
            </div>

            <div className="auth-field">
              <label className="auth-field-label">ROLE</label>
              <select
                name="role"
                value={registerData.role}
                onChange={handleRegisterChange}
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
                <option value="support">Support</option>
              </select>
            </div>

            <button type="submit" className="btn-primary auth-submit-btn" disabled={isRegistering}>
              {isRegistering ? 'CREATING...' : 'CREATE ACCOUNT'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
