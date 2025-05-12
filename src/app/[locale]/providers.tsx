import {NextIntlClientProvider} from 'next-intl';
import {ReactNode} from 'react';

type Props = {
  locale: string;
  messages: IntlMessages;
  children: ReactNode;
};

export default function Providers({children, locale, messages}: Props) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
} 