import Link from "next/link";
import Image from "next/image";
import { Recipe } from "../../types";
import FeaturedItemsCarousel from "@/components/FeaturedItemsCarousel";

async function getRecipes() {
  try {
    const res = await fetch("https://free-food-menus-api-two.vercel.app/best-foods?limit=3", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Failed to fetch recipes");
    const data = await res.json();
    return data as Recipe[];
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
}

export default async function HomePage() {
  const recipes = await getRecipes();

  const deliciousLetters = "Delicious".split("");

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center h-screen bg-cover bg-center"
        style={{
          backgroundImage: "url('/tasty-pizza-near-ingredients.jpg')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
        
        {/* Text Overlay */}
        <div className="relative text-center text-white z-10">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Discover{" "}
            <span className="text-orange-500 inline-flex">
              {deliciousLetters.map((letter, index) => (
                <span
                  key={index}
                  className={`animate-letterFadeIn animation-delay-${(index + 1) * 100}`}
                >
                  {letter}
                </span>
              ))}
            </span>{" "}
            Menu
          </h1>
          <p className="mt-4 text-lg md:text-xl opacity-0 animate-fadeIn animation-delay-500">
            Explore a world of flavors with our menu.
          </p>
          <Link href="/menu">
            <button className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105">
              Explore our menu
            </button>
          </Link>
        </div>
      </section>

      {/* Featured Items Section */}
      <FeaturedItemsCarousel recipes={recipes} />
    </div>
  );
}