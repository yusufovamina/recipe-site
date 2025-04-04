'use client';

import { useState, useEffect } from 'react';
import { Recipe } from '../app/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.some((fav: Recipe) => fav.id === recipe.id));
  }, []);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Предотвращаем переход при клике на кнопку
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFavorite) {
      favorites = favorites.filter((fav: Recipe) => fav.id !== recipe.id);
    } else {
      favorites.push(recipe);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  return (
    <Link href={`/recipes/${recipe.id}`} className="block">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        </CardHeader>
        <CardContent>
          <CardTitle className="text-lg font-semibold">{recipe.name}</CardTitle>
          <p className="text-sm text-gray-600">Cuisine: {recipe.cuisine}</p>
          <p className="text-sm text-gray-600">Difficulty: {recipe.difficulty}</p>
          <p className="text-sm text-gray-600">
            Rating: {recipe.rating} ({recipe.reviewCount} reviews)
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={toggleFavorite}
          >
            <Heart
              className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
            />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}