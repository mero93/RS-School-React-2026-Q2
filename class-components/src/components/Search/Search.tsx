import { useState, type ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import './Search.css';

interface SearchProps {
  onSearch: (term: string) => void;
  isLoading: boolean;
  initialValue: string;
  hasError: boolean;
}

export default function Search(props: Readonly<SearchProps>) {
  const { onSearch, isLoading, initialValue, hasError } = props;
  const [inputValue, setInputValue] = useState<string>(initialValue);
  const t = useTranslations('Home.Search');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearchClick = () => {
    const trimmedTerm = inputValue.trim();
    if (trimmedTerm === initialValue && !hasError) return;
    onSearch(trimmedTerm);
  };

  return (
    <div className="search-wrapper">
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={t('placeholder')}
          disabled={isLoading}
        />
        <button
          type="button"
          className="search-button"
          onClick={handleSearchClick}
          disabled={isLoading}
        >
          {isLoading ? t('loadingBtn') : t('searchBtn')}
        </button>
      </div>
    </div>
  );
}
