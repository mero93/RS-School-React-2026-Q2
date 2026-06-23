'use client';

import { useTranslations } from 'next-intl';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { SEARCH_STORAGE_KEY } from './SearchPersistence';
import './Search.css';

export default function Search({
  initialValue,
  onSearchAction,
}: Readonly<{
  initialValue: string;
  onSearchAction: (formData: FormData) => void;
}>) {
  const t = useTranslations('Home.Search');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleCombinedAction = (formData: FormData) => {
    const query = ((formData.get('query') as string) || '')
      .trim()
      .replace(/\s+/g, ' ');

    if (query) {
      localStorage.setItem(SEARCH_STORAGE_KEY, query);
    } else {
      localStorage.removeItem(SEARCH_STORAGE_KEY);
    }

    onSearchAction(formData);

    const params = new URLSearchParams(searchParams.toString());
    if (query) params.set('search', query);
    else params.delete('search');
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form action={handleCombinedAction} className="search-bar">
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
