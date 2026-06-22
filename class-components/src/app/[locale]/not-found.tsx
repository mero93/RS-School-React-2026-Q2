import { Link } from 'react-router-dom';
import './not-found.css';

export default function NotFound() {
  return (
    <div className="not-found-container" id="center">
      <div className="hero">
        <h1 className="error-code">404</h1>
      </div>
      <h2 className="not-found-heading">Page not found</h2>
      <p className="not-found-text">
        Page not found. Return to home page and continue browsing comics
      </p>
      <Link to="/" className="counter">
        Return to Comics
      </Link>
    </div>
  );
}
