"use client"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
  } from "@/components/ui/navigation-menu";
  import { Button } from "@/components/ui/button";
  import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Recipe } from "../../../types";
  
  export default function WithNavLayout({ children }: { children: React.ReactNode }) {
    const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const router = useRouter();

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
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    }
    fetchRecipes();
  }, []);

  // Обработка изменения ввода
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Фильтрация подсказок
    if (value.trim()) {
      const filteredSuggestions = recipes
        .filter(recipe => recipe.name.toLowerCase().includes(value.toLowerCase()))
        .map(recipe => recipe.name)
        .slice(0, 5); // Ограничиваем количество подсказок до 5
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Обработка отправки формы
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`);
      setSuggestions([]); 
      setSearchQuery(""); 
    }
  };

  // Обработка выбора подсказки
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    router.push(`/recipes?search=${encodeURIComponent(suggestion)}`);
    setSuggestions([]);
    setSearchQuery(""); 
  };
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b">
          <div className="container mx-auto p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Recipe App</h1>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/home" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/recipes" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Recipes
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/favorites" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Favorites
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
            
              </NavigationMenuList>
            </NavigationMenu>

            {/* Поиск */}
          <div className="flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Search recipes (e.g., pizza)"
                className="w-full p-2 pl-10 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 text-gray-800"
              />
              {/* Иконка поиска */}
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {/* Подсказки */}
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
            </form>
          </div>

            <div className="space-x-2">
              <Button variant="outline" asChild>
                <Link href="/sign-in">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Register</Link>
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-grow">{children}</main>
        <footer className="border-t p-4 text-center text-gray-500">
          <p>© 2025 Recipe App. All rights reserved.</p>
        </footer>
      </div>
    );
  }