import type { ReactNode } from 'react';
import ThemeProvider from './ThemeProvider';
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
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider>{children}</ThemeProvider>
    </NextIntlClientProvider>
  );
}
