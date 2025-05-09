import { getRequestConfig } from "next-intl/server";
import { defaultLocale, locales } from ".";

interface Messages {
  [key: string]: any;
}

export default getRequestConfig(async ({ locale }) => {
  const supportedLocale = locales.includes(locale as any) ? locale : defaultLocale;
  const messages: Messages = (await import(`../messages/${supportedLocale}.json`)).default;
  return {
    locale: supportedLocale,
    messages,
  };
});