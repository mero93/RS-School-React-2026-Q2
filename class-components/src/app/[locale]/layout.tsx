import React from 'react';
import '../index.css';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import Header from '../../components/Header/Header';
import GlobalProvider from '../../providers/GlobalProvider';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({ children, params }: Readonly<LayoutProps>) {
  const { locale } = await params;

  return (
    <html lang={locale || 'en'}>
        <head></head>
      <body>
        <ErrorBoundary>
          <GlobalProvider>
            <div className="app-layout-root">
              <Header />
              <main className="app-content-frame">
                {children}
              </main>
            </div>
          </GlobalProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}