"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useCartStore } from '@/lib/store/cartStore';

interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
}

interface CartItem {
  id: string;
  recipeId: string;
  quantity: number;
  price: number;
  name?: string;
}

export default function MenuPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const t = useTranslations('Menu');
  const { addItem, removeItem, items } = useCartStore();

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const endpoints = {
          "Main Dishes": ["/bbqs", "/best-foods", "/burgers", "/fried-chicken", "/pizzas", "/porks", "/steaks"],
          "Appetizers": ["/breads", "/sandwiches", "/sausages"],
          "Drinks": ["/drinks"],
          "Desserts": ["/chocolates", "/desserts", "/ice-cream"],
        };

        const fetchPromises = Object.entries(endpoints).flatMap(([category, urls]) =>
          urls.map(url =>
            fetch(`https://free-food-menus-api-two.vercel.app${url}`)
              .then(res => {
                if (!res.ok) throw new Error(`Failed to fetch ${url}`);
                return res.json();
              })
              .then(data => ({
                category,
                items: data,
              }))
          )
        );

        const results = await Promise.all(fetchPromises);
        const allRecipes = results.flatMap(result =>
          Object.values(result.items).flat().map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.dsc,
            image: item.img || "https://via.placeholder.com/300x200",
            price: item.price ? item.price / 4 : Math.floor(Math.random() * 20) + 10,
            category: result.category,
          }))
        );
        setRecipes(allRecipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  const handleAddToCart = (recipe: Recipe) => {
    if (!session) {
      router.push('/sign-in');
      return;
    }

    addItem({
      id: recipe.id,
      name: recipe.name,
      price: recipe.price,
      image: recipe.image,
      quantity: 1,
    });
  };

  const handleRemoveFromCart = (recipeId: string) => {
    removeItem(recipeId);
  };

  const filteredRecipes = recipes.filter(
    recipe =>
      (!searchQuery || 
        recipe.name.toLowerCase().includes(searchQuery) ||
        recipe.description.toLowerCase().includes(searchQuery)) &&
      (!selectedCategory || recipe.category === selectedCategory)
  );

  const categories = ["Main Dishes", "Appetizers", "Drinks", "Desserts"];

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-16 px-4 md:px-8">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-16 px-4 md:px-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
        {t('title')}
      </h1>
      
      <div className="flex justify-center mb-6 space-x-4">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg ${
            selectedCategory === null
              ? "bg-orange-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          {t('all')}
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === category
                ? "bg-orange-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredRecipes.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">{t('noResults')}</p>
      ) : (
        <div className="max-w-6xl mx-auto">
          {categories.map(category => {
            const categoryRecipes = filteredRecipes.filter(
              recipe => recipe.category === category
            );
            if (categoryRecipes.length === 0) return null;

            return (
              <div key={category} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryRecipes.map((recipe) => (
                    <Card key={recipe.id} className="group overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white dark:bg-gray-800">
                      <Link href={`/recipes/${recipe.id}`}>
                        <div className="relative">
                          <img
                            src={recipe.image}
                            alt={recipe.name}
                            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </Link>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 group-hover:text-orange-500 transition-colors duration-300">
                              {recipe.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2 h-10">
                              {recipe.description}
                            </p>
                          </div>
                          <span className="text-lg font-bold text-orange-500">
                            ${recipe.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddToCart(recipe);
                            }}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105"
                          >
                            {items.some(item => item.id === recipe.id) ? t('addMore') : t('addToCart')}
                          </Button>
                          {items.some(item => item.id === recipe.id) && (
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                handleRemoveFromCart(recipe.id);
                              }}
                              variant="outline"
                              className="text-red-500 hover:text-white hover:bg-red-500 border-red-500 rounded-full transition-all duration-300"
                            >
                              {t('remove')}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}