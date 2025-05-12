import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './app/i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales: locales,
  // Used when no locale matches
  defaultLocale: defaultLocale,
  // This is the default: linking will generate paths with the locale as prefix
  localePrefix: 'always'
});

export const config = {
  // Skip all paths that should not be internationalized. This example skips the
  // folders "api", "_next" and all files with an extension (e.g. favicon.ico)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}; 