import './Loader.css';

interface LoaderProps {
  isLoading: boolean;
}

export default function Loader(props: Readonly<LoaderProps>) {
  const { isLoading } = props;

  if (!isLoading) return null;

  return (
    <div className="loader-overlay">
      <div className="spinner"></div>
      <p>Loading Comics data...</p>
    </div>
  );
}
