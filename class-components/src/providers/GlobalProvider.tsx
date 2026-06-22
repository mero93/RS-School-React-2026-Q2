import type { ReactNode } from 'react';
import ThemeProvider from './ThemeProvider';
import { queryClient } from '../query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { NextIntlClientProvider, type AbstractIntlMessages } from 'next-intl';

interface GlobalProviderProps {
  children: ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}

export default function GlobalProvider({
  children,
  locale,
  messages,
}: Readonly<GlobalProviderProps>) {
  return (
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ThemeProvider>{children}</ThemeProvider>
      </NextIntlClientProvider>
    </QueryClientProvider>
  );
}
