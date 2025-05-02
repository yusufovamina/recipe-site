import Link from "next/link";
import Image from "next/image";
import { Recipe } from "../../types";

async function getRecipes() {
  try {
    const res = await fetch("https://free-food-menus-api-two.vercel.app/best-foods?limit=3", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Failed to fetch recipes");
    const data = await res.json();
    return data as Recipe[]; // API возвращает массив напрямую
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
      <section className="py-16 px-4 md:px-8 bg-white dark:bg-gray-900">
        <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12">Featured Items</h2>
        {recipes.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>Failed to load items. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto bg-white dark:bg-gray-900">
            {recipes.slice(0, 3).map((recipe) => (
              <div key={recipe.id} className="group relative overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-800">
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
            ))}
          </div>
        )}
      </section>
    </div>
  );
}