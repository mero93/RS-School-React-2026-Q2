import { Link, useLocation, useSearchParams } from 'react-router-dom';
import './Header.css';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';

export default function Header() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isHomePath = location.pathname === '/';
  const isAboutActive = location.pathname === '/about';

  const pageParam = Number.parseInt(searchParams.get('page') || '1', 10);

  const shouldBlockHomeClick = isHomePath && pageParam === 1;

  return (
    <nav className="global-header">
      <Link
        to="/"
        className={`nav-link ${isHomePath ? 'active' : ''} ${shouldBlockHomeClick ? 'no-click' : ''}`}
        aria-disabled={shouldBlockHomeClick}
      >
        Home
      </Link>

      <Link
        to="/about"
        className={`nav-link ${isAboutActive ? 'active no-click' : ''}`}
        aria-disabled={isAboutActive}
      >
        About
      </Link>

      <span className="spacer" />
      <ThemeSwitcher />
    </nav>
  );
}
