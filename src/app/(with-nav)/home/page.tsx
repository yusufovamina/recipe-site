import { Recipe } from '../../../app/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

async function getRecipes() {
  const res = await fetch('https://dummyjson.com/recipes?limit=3');
  const data = await res.json();
  return data.recipes as Recipe[];
}

export default async function HomePage() {
  const recipes = await getRecipes();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto p-4">
          {/* Заголовок и логотип */}
          <div className="flex items-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold">
                RA
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Simple Recipes That Make You Feel Good
              </h2>
            </div>
          </div>

          {/* Секция "New Recipes" */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">New Recipes</h3>
            <Button variant="link" asChild>
              <Link href="/recipes">
                Show Me Everything <span className="ml-1">→</span>
              </Link>
            </Button>
          </div>

          {/* Карточки рецептов */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <Link href={`/recipes/${recipe.id}`} key={recipe.id}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 pb-0">
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-full h-64 object-cover rounded-lg m-4"
                    />
                  </CardContent>
                  <CardContent className="p-4">
                    <h4 className="text-lg font-semibold mb-2">{recipe.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      {recipe.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      
    </div>
  );
}