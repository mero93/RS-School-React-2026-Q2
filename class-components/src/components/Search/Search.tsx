'use client';

import { useTranslations } from 'next-intl';
import './Search.css';

export default function Search({
  initialValue,
  onSearchAction,
}: Readonly<{
  initialValue: string;
  onSearchAction: (formData: FormData) => void;
}>) {
  const t = useTranslations('Home.Search');

  return (
    <form action={onSearchAction} className="search-bar">
      <input
        className="search-input"
        name="query"
        defaultValue={initialValue}
        placeholder={t('placeholder')}
      />
      <button className="search-button" type="submit">
        {t('searchBtn')}
      </button>
    </form>
  );
}
