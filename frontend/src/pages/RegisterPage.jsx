import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/authApi';
import '../styles/AuthPages.css';

const RegisterPage = ({ setUser }) => {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });
  const [registerError, setRegisterError] = useState(null);
  const [registerSuccess, setRegisterSuccess] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerData.password.length < 6) {
      setRegisterError('Password must be at least 6 characters long.');
      return;
    }

    setIsRegistering(true);
    setRegisterError(null);
    setRegisterSuccess(null);

    try {
      const payload = {
        name: registerData.name.trim(),
        email: registerData.email.trim(),
        password: registerData.password,
        role: registerData.role
      };
      const response = await registerUser(payload);
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
      <div className="auth-single-container">
        <header className="auth-header auth-header-center">
          <span className="pill-badge">ACCOUNT</span>
          <h1 className="auth-title">Register.</h1>
        </header>

        <div className="auth-card auth-single-card">
          <h2 className="auth-card-title">Create account</h2>
          <p className="auth-card-subtitle">Get started with Helpdesk today.</p>

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
                placeholder="At least 6 characters"
                required
                minLength="6"
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

          <div className="auth-switch-prompt">
            <span>Already have an account?</span>
            <Link to="/login" className="auth-switch-link">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;