'use client';

import { Link } from '../../i18n/routing';
import { useTranslations } from 'next-intl';
import './not-found.css';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <div className="not-found-container" id="center">
      <div className="hero">
        <h1 className="error-code">404</h1>
      </div>
      <h2 className="not-found-heading">{t('heading')}</h2>
      <p className="not-found-text">{t('text')}</p>
      <Link href="/" className="counter">
        {t('link')}
      </Link>
    </div>
  );
}
