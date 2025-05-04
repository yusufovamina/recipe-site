"use client";

import Link from "next/link";
import Image from "next/image";
import Slider from "react-slick";
import { Recipe } from "../app/types";

interface FeaturedItemsCarouselProps {
  recipes: Recipe[];
}

export default function FeaturedItemsCarousel({ recipes }: FeaturedItemsCarouselProps) {
  console.log("Recipes in Carousel:", recipes); // Отладочный вывод

  const settings = {
    dots: true,
    infinite: recipes.length > 1, // Отключаем бесконечную прокрутку, если мало элементов
    speed: 500,
    slidesToShow: Math.min(3, recipes.length), // Не показываем больше слайдов, чем есть элементов
    slidesToScroll: 1,
    autoplay: recipes.length > 1, // Автопрокрутка только если есть несколько элементов
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, recipes.length),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

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

  return (
    <section className="py-16 px-4 md:px-8 bg-white dark:bg-gray-900">
      <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12">Featured Items</h2>
      <div className="max-w-6xl mx-auto">
        <Slider {...settings}>
          {recipes.map((recipe) => (
            <div key={recipe.id} className="px-2">
              <div className="group relative overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-800">
                <Image
                  src={recipe.image}
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
        </Slider>
      </div>
    </section>
  );
}