'use client';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '../i18n/navigation';
import { locales } from '../i18n';

const languageNames = {
  en: 'English',
  ru: 'Русский',
  az: 'Azərbaycan'
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: string) => {
    // Get the path without the locale prefix
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    // Navigate to the new locale path
    router.push(pathWithoutLocale || '/', { locale: newLocale });
  };

  return (
    <div className="relative inline-block text-left">
      <select
        value={locale}
        onChange={(e) => handleChange(e.target.value)}
        className="block w-full px-4 py-2 text-sm rounded-lg bg-gray-800 text-white border border-gray-700 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {languageNames[loc as keyof typeof languageNames]}
          </option>
        ))}
      </select>
    </div>
  );
} 