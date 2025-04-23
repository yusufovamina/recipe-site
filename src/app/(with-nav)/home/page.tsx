import Link from "next/link";
import Image from "next/image";
import { Recipe } from "../../types";

async function getRecipes() {
  try {
    const res = await fetch("https://dummyjson.com/recipes?limit=3", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Failed to fetch recipes");
    const data = await res.json();
    return data.recipes as Recipe[];
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
}

export default async function HomePage() {
  const recipes = await getRecipes();

  // Разбиваем слово "Delicious" на массив букв
  const deliciousLetters = "Delicious".split("");

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154347-be6161a56a0c?q=80&w=2070&auto=format&fit=crop')",
        }}
      >
        {/* Rotating Circle with Plates */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[500px] h-[500px] animate-spin-slow">
            {/* Plate 1 (Salad) */}
            <div
              className="absolute w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center"
              style={{
                top: "10%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            {/* Plate 2 (Fries) */}
            <div
              className="absolute w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center"
              style={{
                top: "50%",
                left: "90%",
                transform: "translate(-50%, -50%)",
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1596627117709-8e38dd8d8215?q=80&w=400&auto=format&fit=crop')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            {/* Plate 3 (Chicken) */}
            <div
              className="absolute w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center"
              style={{
                top: "90%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1626647479879-2f9d2e1122a7?q=80&w=400&auto=format&fit=crop')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            {/* Plate 4 (Rice) */}
            <div
              className="absolute w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center"
              style={{
                top: "50%",
                left: "10%",
                transform: "translate(-50%, -50%)",
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1603133872878-684f208fb85b?q=80&w=400&auto=format&fit=crop')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>
        </div>

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
            Recipes
          </h1>
          <p className="mt-4 text-lg md:text-xl opacity-0 animate-fadeIn animation-delay-500">
            Explore a world of flavors with our curated collection of recipes.
          </p>
          <Link href="/recipes">
            <button className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105">
              Explore Recipes
            </button>
          </Link>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="py-16 px-4 md:px-8">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Featured Recipes</h2>
        {recipes.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>Failed to load recipes. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="group relative overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={recipe.image}
                  alt={recipe.name}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="text-center text-white">
                    <h3 className="text-xl font-semibold">{recipe.name}</h3>
                    <p className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {recipe.}
                    </p>
                    <Link href={`/recipes/${recipe.id}`}>
                      <button className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300">
                        View Recipe
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