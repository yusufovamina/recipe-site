"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Recipe } from "../../types";

// Список популярных ингредиентов для автодополнения
const popularIngredients = [
  "tomato", "cheese", "chicken", "basil", "garlic", "onion", "cream", "olive oil",
  "pizza dough", "pasta", "beef", "pepper", "salt", "sugar", "butter", "egg", "flour"
];

export default function RecipesPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [inputIngredients, setInputIngredients] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Загружаем рецепты при монтировании компонента
  useEffect(() => {
    async function fetchRecipes() {
      try {
        const res = await fetch("https://dummyjson.com/recipes", {
          next: { revalidate: 3600 },
        });
        if (!res.ok) throw new Error("Failed to fetch recipes");
        const data = await res.json();
        setRecipes(data.recipes);
        setFilteredRecipes(data.recipes); // Изначально показываем все рецепты
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    }
    fetchRecipes();
  }, []);

  // Фильтрация по поисковому запросу из URL
  useEffect(() => {
    if (searchQuery) {
      const filtered = recipes.filter(
        recipe =>
          recipe.name.toLowerCase().includes(searchQuery) ||
          recipe.ingredients.includes(searchQuery)
      );
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes(recipes); // Если нет поискового запроса, показываем все рецепты
    }
  }, [searchQuery, recipes]);

  // Обработка изменения ввода ингредиентов
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setInputIngredients(value);

    // Разбиваем введённые ингредиенты на массив
    const userIngredients = value.split(",").map(item => item.trim()).filter(item => item);

    // Фильтрация рецептов
    if (userIngredients.length > 0) {
      const filtered = recipes.filter(recipe =>
        recipe.ingredients.some(ingredient =>
          userIngredients.some(userIngredient =>
            ingredient.toLowerCase().includes(userIngredient)
          )
        )
      );
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes(recipes); // Если ингредиенты не введены, показываем все рецепты
    }

    // Автодополнение
    if (value) {
      const lastIngredient = userIngredients[userIngredients.length - 1] || value;
      const filteredSuggestions = popularIngredients.filter(ingredient =>
        ingredient.toLowerCase().startsWith(lastIngredient) && ingredient.toLowerCase() !== lastIngredient
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Обработка выбора подсказки
  const handleSuggestionClick = (suggestion: string) => {
    const ingredientsArray = inputIngredients.split(",").map(item => item.trim()).filter(item => item);
    ingredientsArray.pop(); // Удаляем последний (незавершённый) ингредиент
    ingredientsArray.push(suggestion);
    setInputIngredients(ingredientsArray.join(", ") + ", ");
    setSuggestions([]);

    // Фильтрация рецептов после выбора подсказки
    const userIngredients = ingredientsArray.map(item => item.toLowerCase());
    const filtered = recipes.filter(recipe =>
      recipe.ingredients.some(ingredient =>
        userIngredients.some(userIngredient =>
          ingredient.toLowerCase().includes(userIngredient)
        )
      )
    );
    setFilteredRecipes(filtered);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-16 px-4 md:px-8">
      {/* Заголовок */}
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12">
        {searchQuery ? `Search Results for "${searchQuery}"` : "Find Recipes by Ingredients"}
      </h1>

      {/* Поисковая секция по ингредиентам (показываем только если нет searchQuery) */}
      {!searchQuery && (
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              value={inputIngredients}
              onChange={handleInputChange}
              placeholder="Enter ingredients (e.g., tomato, cheese, chicken)"
              className="w-full p-4 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 text-gray-800"
            />
            {/* Подсказки автодополнения */}
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-auto">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="p-3 cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-600 dark:text-gray-200 text-gray-800"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
            Separate ingredients with commas (e.g., tomato, cheese, chicken)
          </p>
        </div>
      )}

      {/* Сетка рецептов */}
      {filteredRecipes.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>No recipes found. Try a different search term or ingredients!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto bg-white dark:bg-gray-900">
          {filteredRecipes.map((recipe, index) => (
            <div
              key={recipe.id}
              className="group relative overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-800 opacity-0 animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Image
                src={recipe.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&auto=format&fit=crop"}
                alt={recipe.name}
                width={400}
                height={300}
                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="text-center text-white dark:text-gray-100">
                  <h3 className="text-xl font-semibold">{recipe.name}</h3>
                  <p className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {recipe.cuisine}
                  </p>
                  <Link href={`/recipes/${recipe.id}`}>
                    <button className="mt-4 px-4 py-2 bg-orange-500 text-white dark:bg-orange-600 dark:text-gray-100 rounded-lg hover:bg-orange-600 dark:hover:bg-orange-500 transition-colors duration-300">
                      View Recipe
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}