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
    const [recipes, setRecipes] = useState<any[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const router = useRouter();
  
    useEffect(() => {
      async function fetchRecipes() {
        try {
          const res = await fetch("https://free-food-menus-api-two.vercel.app/all", { next: { revalidate: 3600 } });
          if (!res.ok) throw new Error("Failed to fetch recipes");
          const data = await res.json();
          const allRecipes = Object.values(data).flat();
          setRecipes(allRecipes);
        } catch (error) {
          console.error("Error fetching recipes:", error);
        }
      }
      fetchRecipes();
    }, []);
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
  
      if (value.trim()) {
        const filteredSuggestions = recipes
          .filter(recipe => recipe.name.toLowerCase().includes(value.toLowerCase()))
          .map(recipe => recipe.name)
          .slice(0, 5);
        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]);
      }
    };
  
    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
        setSearchQuery("");
        setSuggestions([]);
      }
    };
  
    const handleSuggestionClick = (suggestion: string) => {
      setSearchQuery(suggestion);
      router.push(`/menu?search=${encodeURIComponent(suggestion)}`);
      setSearchQuery("");
      setSuggestions([]);
    };
  
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b">
        <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/home">
              <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">Restaurant Name</span>
            </Link>
          </div>
          <div className="flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Search menu items..."
                className="w-full p-2 pl-10 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 text-gray-800"
              />
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
          <div className="flex space-x-4">
            <Link href="/menu" className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400">
              Menu
            </Link>
            <Link href="/order" className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400">
              Order
            </Link>
            <Link href="/location" className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400">
              Location
            </Link>
            <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
        </header>
        <main className="flex-grow">{children}</main>
        <footer className="border-t p-4 text-center text-gray-500">
          <p>© 2025 Recipe App. All rights reserved.</p>
        </footer>
      </div>
    );
  }