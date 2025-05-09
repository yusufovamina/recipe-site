import { i18nMiddleware } from "./i18n/routing";

export default i18nMiddleware;

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};