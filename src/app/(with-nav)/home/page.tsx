import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
  } from "@/components/ui/navigation-menu";
  import { Button } from "@/components/ui/button";
  import Link from "next/link";
  
  export default function HomePage() {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Welcome to Recipe App</h2>
            <p className="text-lg text-gray-600 mb-6">
              Discover and save your favorite recipes with ease!
            </p>
            <Button asChild size="lg">
              <Link href="/recipes">Explore Recipes</Link>
            </Button>
          </div>
        </main>
        <footer className="border-t p-4 text-center text-gray-500">
          <p>&copy; 2025 Recipe App. All rights reserved.</p>
        </footer>
      </div>
    );
  }