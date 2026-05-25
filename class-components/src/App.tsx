import { RouterProvider } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import './App.css';
import { router } from './router/router';
import ThemeProvider from './providers/ThemeProvider';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
