"use client";

import { useTranslations } from "next-intl";

export default function NotFoundPage() {
  const t = useTranslations("NotFound");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
          {t("title")}
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          {t("message")}
        </p>
      </div>
    </div>
  );
}