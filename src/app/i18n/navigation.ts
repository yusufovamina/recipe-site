"use client";

// Импортируем необходимые утилиты
import { createNavigation } from "next-intl/navigation";
import { locales, defaultLocale } from "."; // Импорт из i18n/index.ts

// Создаём навигацию на основе конфигурации
export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  defaultLocale,
});