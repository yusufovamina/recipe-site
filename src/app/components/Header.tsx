import { useTranslations } from 'next-intl';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const t = useTranslations('Header');

  return (
    <header className="bg-gray-900 text-white py-4 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-xl font-bold hover:text-gray-300">
          {t('title')}
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link href="/" className="hover:text-gray-300">
            {t('home')}
          </Link>
          <Link href="/recipes" className="hover:text-gray-300">
            {t('recipes')}
          </Link>
          <Link href="/about" className="hover:text-gray-300">
            {t('about')}
          </Link>
        </nav>
      </div>
      <LanguageSwitcher />
    </header>
  );
} 