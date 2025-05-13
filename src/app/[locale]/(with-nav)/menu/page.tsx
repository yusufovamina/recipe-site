"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const t = useTranslations('Menu');

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
    if (session?.user?.id) {
      fetchCartItems();
    }
  }, [session]);

  const fetchCartItems = async () => {
    try {
      const response = await fetch(`/api/cart?userId=${session?.user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch cart');
      const items = await response.json();
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (recipe: Recipe) => {
    if (!session) {
      router.push('/sign-in');
      return;
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipeId: recipe.id,
          quantity: 1,
          price: recipe.price,
          name: recipe.name,
          image: recipe.image,
        }),
      });

      if (!response.ok) throw new Error('Failed to add to cart');
      fetchCartItems(); // Refresh cart items
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (recipeId: string) => {
    const cartItem = cartItems.find(item => item.recipeId === recipeId);
    if (!cartItem) return;

    try {
      const response = await fetch(`/api/cart?itemId=${cartItem.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove from cart');
      fetchCartItems(); // Refresh cart items
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
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
                    <Card key={recipe.id} className="overflow-hidden">
                      <Link href={`/recipes/${recipe.id}`}>
                        <img
                          src={recipe.image}
                          alt={recipe.name}
                          className="w-full h-48 object-cover"
                        />
                      </Link>
                      <CardContent className="p-4">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                          {recipe.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                          {recipe.description}
                        </p>
                        <p className="text-orange-500 font-bold mt-2">
                          ${recipe.price.toFixed(2)}
                        </p>
                        <div className="mt-4 flex space-x-2">
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart(recipe);
                            }}
                            className="bg-orange-500 hover:bg-orange-600"
                          >
                            {t('addToCart')}
                          </Button>
                          {cartItems.some(item => item.recipeId === recipe.id) && (
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                removeFromCart(recipe.id);
                              }}
                              variant="destructive"
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

      {cartItems.length > 0 && (
        <div className="fixed bottom-0 right-0 m-4">
          <Button
            onClick={() => router.push("/cart")}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {t('viewCart')} ({cartItems.length})
          </Button>
        </div>
      )}
    </div>
  );
}