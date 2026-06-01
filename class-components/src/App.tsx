import { RouterProvider } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import './App.css';
import { router } from './router/router';
import GlobalProvider from './providers/GlobalProvider';

export default function App() {
  return (
    <ErrorBoundary>
      <GlobalProvider>
        <RouterProvider router={router} />
      </GlobalProvider>
    </ErrorBoundary>
  );
}
