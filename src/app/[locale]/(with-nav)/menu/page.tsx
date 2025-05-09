"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MenuPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const [recipes, setRecipes] = useState<any[]>([]);
  const [cart, setCart] = useState<{ id: number; name: string; price: number; quantity: number }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const router = useRouter();

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
            fetch(`https://free-food-menus-api-two.vercel.app${url}`, { next: { revalidate: 3600 } })
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
      }
    }
    fetchRecipes();
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const filteredRecipes = recipes.filter(
    recipe =>
      (!searchQuery || 
        recipe.name.toLowerCase().includes(searchQuery) ||
        recipe.description.toLowerCase().includes(searchQuery)) &&
      (!selectedCategory || recipe.category === selectedCategory)
  );

  const addToCart = (recipe: any) => {
    const existingItem = cart.find(item => item.id === recipe.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === recipe.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { id: recipe.id, name: recipe.name, price: recipe.price, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const categories = ["Main Dishes", "Appetizers", "Drinks", "Desserts"];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-16 px-4 md:px-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">Our Menu</h1>
      <div className="flex justify-center mb-6 space-x-4">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg ${selectedCategory === null ? "bg-orange-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"}`}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg ${selectedCategory === category ? "bg-orange-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"}`}
          >
            {category}
          </button>
        ))}
      </div>
      {filteredRecipes.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">No items found. Try a different search!</p>
      ) : (
        <div className="max-w-6xl mx-auto">
          {categories.map(category => {
            const categoryRecipes = filteredRecipes.filter(recipe => recipe.category === category);
            if (categoryRecipes.length === 0) return null;
            return (
              <div key={category} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryRecipes.map((recipe) => (
                    <Link href={`/recipes/${recipe.id}`} key={recipe.id}>
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                        <img
                          src={recipe.image}
                          alt={recipe.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="p-4">
                          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{recipe.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400 mt-2">{recipe.description}</p>
                          <p className="text-orange-500 font-bold mt-2">${recipe.price.toFixed(2)}</p>
                          <div className="mt-4 flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(recipe);
                              }}
                              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                            >
                              Add to Cart
                            </button>
                            {cart.find(item => item.id === recipe.id) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFromCart(recipe.id);
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {cart.length > 0 && (
        <div className="mt-8 max-w-6xl mx-auto bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Cart</h2>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2">
              <span className="text-gray-800 dark:text-gray-100">{item.name} x{item.quantity}</span>
              <span className="text-orange-500">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <button
            onClick={() => router.push("/order")}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}