import { Link, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const location = useLocation();

  const isHomeActive = location.pathname === '/' && !location.search;
  const isAboutActive = location.pathname === '/about';

  return (
    <nav className="global-header">
      {isHomeActive ? (
        <span className="nav-link active">Home</span>
      ) : (
        <Link to="/" className="nav-link">
          Home
        </Link>
      )}

      {isAboutActive ? (
        <span className="nav-link active">About</span>
      ) : (
        <Link to="/about" className="nav-link">
          About
        </Link>
      )}
    </nav>
  );
}
