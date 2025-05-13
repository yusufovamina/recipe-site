'use client';

import { NextIntlClientProvider } from 'next-intl';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

type Props = {
  locale: string;
  messages: IntlMessages;
  children: ReactNode;
};

export default function Providers({ children, locale, messages }: Props) {
  return (
    <SessionProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </SessionProvider>
  );
} 