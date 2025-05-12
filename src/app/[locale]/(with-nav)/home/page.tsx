'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Recipe } from '../../../types';
import FeaturedItemsCarousel from '@/components/FeaturedItemsCarousel';

async function getRecipes(): Promise<Recipe[]> {
  const res = await fetch("https://free-food-menus-api-two.vercel.app/best-foods?limit=3");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export default function HomePage() {
  const t = useTranslations('Home');
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    getRecipes().then(setRecipes).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <section className="relative flex items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: "url('/tasty-pizza-near-ingredients.jpg')" }}>
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
        <div className="relative text-center text-white z-10">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            {t('title')} <span className="text-orange-500">Delicious</span> {t('menu')}
          </h1>
          <p className="mt-4 text-lg md:text-xl">{t('subtitle')}</p>
          <Link href="/menu">
            <button className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105">
              {t('explore')}
            </button>
          </Link>
        </div>
      </section>

      <FeaturedItemsCarousel recipes={recipes} />
    </div>
  );
}
