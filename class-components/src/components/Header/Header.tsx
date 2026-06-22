'use client';

import './Header.css';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';
import { usePathname, useSearchParams } from 'next/navigation';
import { Link } from '../../i18n/routing';

export default function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isHomePath = pathname === '/';
  const isAboutActive = pathname === '/about';

  const pageParam = Number.parseInt(searchParams.get('page') || '1', 10);

  const shouldBlockHomeClick = isHomePath && pageParam === 1;

  return (
    <nav className="global-header">
      <Link
        href="/"
        className={`nav-link ${isHomePath ? 'active' : ''} ${shouldBlockHomeClick ? 'no-click' : ''}`}
        aria-disabled={shouldBlockHomeClick}
      >
        Home
      </Link>

      <Link
        href="/about"
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
