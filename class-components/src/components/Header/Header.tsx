'use client';

import './Header.css';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { usePathname, useSearchParams } from 'next/navigation';
import { Link } from '../../i18n/routing';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import rsLogo from '../../assets/images/rs-logo.png';

export default function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('Global.Header');

  const isHomePath = pathname === '/';
  const isAboutActive = pathname === '/about';
  const pageParam = Number.parseInt(searchParams.get('page') || '1', 10);
  const shouldBlockHomeClick = isHomePath && pageParam === 1;

  return (
    <nav className="global-header">
      <div className="logo">
        <Image
          src={rsLogo}
          alt="RS School Logo"
          width={50}
          height={50}
          priority
        />
      </div>
      <Link
        href="/"
        className={`nav-link ${isHomePath ? 'active' : ''} ${shouldBlockHomeClick ? 'no-click' : ''}`}
        aria-disabled={shouldBlockHomeClick}
      >
        {t('navHome')}
      </Link>

      <Link
        href="/about"
        className={`nav-link ${isAboutActive ? 'active no-click' : ''}`}
        aria-disabled={isAboutActive}
      >
        {t('navAbout')}
      </Link>

      <span className="spacer" />
      <div className="header-controls">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
    </nav>
  );
}
