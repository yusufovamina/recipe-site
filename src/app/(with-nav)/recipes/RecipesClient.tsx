'use client';

import { useState } from 'react';
import { Recipe } from '../../types';
import RecipeCard from '../../../components/RecipeCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function RecipesClient({ recipes }: { recipes: Recipe[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Search Recipes</h1>
      <div className="flex items-center gap-2 mb-6 max-w-md">
        <Input
          type="text"
          placeholder="Search by name or tag..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Button variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Found {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
      </p>
      {filteredRecipes.length === 0 ? (
        <p className="text-center text-gray-500">No recipes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}