import { Link } from 'react-router-dom';
import '../styles/NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page-wrapper">
      <span className="pill-badge">ERROR 404</span>
      
      <div className="massive-404-graphic">
        <span className="digit-four">4</span>
        <span className="digit-zero">0</span>
        <span className="digit-four">4</span>
      </div>
      
      <h1 className="not-found-headline">This page wandered off.</h1>
      <p className="not-found-subtext">
        The link may be broken, or the ticket was removed.
      </p>
      
      <Link to="/" className="btn-primary not-found-btn">
        BACK HOME
      </Link>

      <div className="sticker-404-pill">
        <span className="sticker-id">TKT-404</span>
        <span className="sticker-status">NOT FOUND</span>
      </div>
    </div>
  );
};

export default NotFoundPage;