import { Recipe } from '../../types';
import RecipesClient from './RecipesClient';

async function getRecipes() {
  const res = await fetch('https://dummyjson.com/recipes');
  const data = await res.json();
  return data.recipes as Recipe[];
}

export default async function RecipesPage() {
  const recipes = await getRecipes();
  return <RecipesClient recipes={recipes} />;
}