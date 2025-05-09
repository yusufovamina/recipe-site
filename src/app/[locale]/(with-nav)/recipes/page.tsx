import { Recipe } from '../../types';
import RecipesClient from './RecipesClient';

async function getRecipes() {
  const res = await fetch('https://free-food-menus-api-two.vercel.app/all');
  const data = await res.json();
  return data.recipes as Recipe[];
}

export default async function RecipesPage() {
  const recipes = await getRecipes();
  return <RecipesClient recipes={recipes} />;
}