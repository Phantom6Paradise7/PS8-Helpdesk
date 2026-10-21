import { Link } from 'react-router-dom';
import realImage from '../assets/real.png';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <span className="pill-badge">CUSTOMER SUPPORT</span>
        <h1 className="home-title">
          Tell us what's<br />
          wrong. We'll<br />
          make it right.
        </h1>
        <p className="home-description">
          Raise a ticket, follow every reply, and watch a real person on our team resolve it.
        </p>
        <div className="home-actions">
          <Link to="/tickets/new" className="btn-primary home-btn">
            RAISE A TICKET
          </Link>
          <Link to="/tickets" className="btn-outline home-btn">
            TRACK MY TICKETS
          </Link>
        </div>
      </div>
      
      <div className="home-image-container">
        <div className="hero-artwork-frame">
          <img src={realImage} alt="Support team resolving a ticket" className="home-hero-img" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;