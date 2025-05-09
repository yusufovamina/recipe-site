"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "../app/i18n/navigation";
import { locales } from "../app/i18n";

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();

  return (
    <div className="flex space-x-4">
      {locales.map((lang) => (
        <Link
          key={lang}
          href=""
          locale={lang}
          className={`text-sm font-medium transition-colors duration-300 ${
            locale === lang
              ? "text-orange-500"
              : "text-gray-600 dark:text-gray-400 hover:text-orange-500"
          }`}
        >
          {t(lang)}
        </Link>
      ))}
    </div>
  );
}