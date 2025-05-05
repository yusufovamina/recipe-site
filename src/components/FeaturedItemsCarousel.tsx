"use client";

import Link from "next/link";
import Image from "next/image";
import { Recipe } from "../app/types";

interface FeaturedItemsCarouselProps {
  recipes: Recipe[];
}

export default function FeaturedItemsCarousel({ recipes }: FeaturedItemsCarouselProps) {
  if (!recipes || recipes.length === 0) {
    return (
      <section className="py-16 px-4 md:px-8 bg-white dark:bg-gray-900">
        <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12">Featured Items</h2>
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>No items available to display.</p>
        </div>
      </section>
    );
  }

  // Дублируем элементы, чтобы создать эффект бесконечной прокрутки
  const duplicatedRecipes = [...recipes, ...recipes];

  return (
    <section className="py-16 px-4 md:px-8 bg-white dark:bg-gray-900">
      <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12">Featured Items</h2>
      <div className="relative max-w-6xl mx-auto overflow-hidden">
        {/* Контейнер карусели */}
        <div className="carousel-container flex">
          {duplicatedRecipes.map((recipe, index) => (
            <div
              key={`${recipe.id}-${index}`}
              className="carousel-item flex-none w-full md:w-1/3 px-2"
            >
              <div className="group relative overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-800">
                <Image
                  src={recipe.img || "https://via.placeholder.com/400x300"}
                  alt={recipe.name}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="text-center text-white dark:text-gray-100">
                    <h3 className="text-xl font-semibold">{recipe.name}</h3>
                    <p className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {recipe.dsc}
                    </p>
                    <Link href={`/menu?search=${encodeURIComponent(recipe.name)}`}>
                      <button className="mt-4 px-4 py-2 bg-orange-500 text-white dark:bg-orange-600 dark:text-gray-100 rounded-lg hover:bg-orange-600 dark:hover:bg-orange-500 transition-colors duration-300">
                        View Item
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}