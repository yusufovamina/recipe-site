import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from '.';

export default getRequestConfig(async ({ locale }) => {
  // Use defaultLocale if locale is undefined
  const currentLocale = locale || defaultLocale;
  
  // Validate that the incoming locale is valid
  if (!locales.includes(currentLocale as any)) {
    throw new Error(`Locale '${currentLocale}' is not supported`);
  }

  return {
    locale: currentLocale,
    messages: (await import(`../messages/${currentLocale}.json`)).default,
    timeZone: 'UTC'
  };
});