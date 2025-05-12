import { NextRequest, NextResponse } from "next/server";
import { i18nMiddleware } from "./i18n/routing";
import { locales } from "./i18n";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = pathname.split("/")[1]; // Извлекаем локаль из пути

  // Проверяем, является ли локаль валидной
  if (locale && !locales.includes(locale as any)) {
    return NextResponse.rewrite(new URL("/404", request.url));
  }

  // Выполняем middleware next-intl
  return i18nMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};