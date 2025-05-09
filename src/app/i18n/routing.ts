import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from ".";

export const i18nMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always", // Всегда показывать локаль в URL (например, /en/sign-in)
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"], // Применяем middleware ко всем маршрутам, кроме API и статических файлов
};