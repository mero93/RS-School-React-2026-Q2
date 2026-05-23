import { Link, useLocation, useSearchParams } from 'react-router-dom';
import './Header.css';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';

export default function Header() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isHomePath = location.pathname === '/';
  const isAboutActive = location.pathname === '/about';

  const hasSearch = searchParams.toString().length > 0;
  const pageParam = Number.parseInt(searchParams.get('page') || '1', 10);
  
  const shouldBlockHomeClick = isHomePath && !hasSearch && pageParam === 1;

  const handleDisabledClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <nav className="global-header">
      <Link
        to="/"
        className={`nav-link ${isHomePath ? 'active' : ''} ${shouldBlockHomeClick ? 'locked' : ''}`}
        aria-disabled={shouldBlockHomeClick}
        onClick={shouldBlockHomeClick ? handleDisabledClick : undefined}
      >
        Home
      </Link>

      <Link
        to="/about"
        className={`nav-link ${isAboutActive ? 'active' : ''} ${isAboutActive ? 'locked' : ''}`}
        aria-disabled={isAboutActive}
        onClick={isAboutActive ? handleDisabledClick : undefined}
      >
        About
      </Link>
      
      <span className="spacer" />
      <ThemeSwitcher />
    </nav>
  );
}