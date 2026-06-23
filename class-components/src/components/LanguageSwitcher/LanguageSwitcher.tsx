'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '../../i18n/routing';
import { useSearchParams } from 'next/navigation';
import './LanguageSwitcher.css';

export default function LanguageSwitcher() {
  const currentLocale = useLocale();
  const t = useTranslations('Global.LanguageSwitcher');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const toggleLanguage = () => {
    const nextLocale = currentLocale === 'en' ? 'de' : 'en';
    const currentParams = searchParams.toString();
    const targetUrl = currentParams ? `${pathname}?${currentParams}` : pathname;

    router.replace(targetUrl, { locale: nextLocale });
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="lang-toggle-btn"
      title={t('label')}
    >
      {currentLocale === 'en' ? 'EN' : 'DE'}
    </button>
  );
}
