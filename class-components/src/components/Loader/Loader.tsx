import { useTranslations } from 'next-intl';
import './Loader.css';

interface LoaderProps {
  isLoading: boolean;
}

export default function Loader(props: Readonly<LoaderProps>) {
  const { isLoading } = props;
  const t = useTranslations('Home.Loader');

  if (!isLoading) return null;

  return (
    <div className="loader-overlay">
      <div className="spinner"></div>
      <p>{t('text')}</p>
    </div>
  );
}
