import { Recipe } from '../../../../app/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

async function getRecipe(id: string) {
  const res = await fetch(`https://free-food-menus-api-two.vercel.app/all/${id}`);
  const data = await res.json();
  return data as Recipe;
}

export default async function RecipeDetail({ params }: { params: { id: string } }) {
  const recipe = await getRecipe(params.id);
  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-4xl mx-auto"> {/* Увеличили с max-w-3xl до max-w-4xl */}
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{recipe.name}</CardTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary">{recipe.cuisine}</Badge>
            <Badge variant="outline">Difficulty: {recipe.difficulty}</Badge>
            <Badge variant="outline">Prep: {recipe.prepTimeMinutes} min</Badge>
            <Badge variant="outline">Cook: {recipe.cookTimeMinutes} min</Badge>
            <Badge variant="outline">Servings: {recipe.servings}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-80 object-cover rounded-lg mb-6" // Увеличили с h-64 до h-80
          />
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag, index) => (
                <Badge key={index} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
            <ul className="list-disc pl-5">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="text-gray-700">
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
          <Separator className="my-4" />
          <div>
            <h2 className="text-xl font-semibold mb-2">Instructions</h2>
            <ol className="list-decimal pl-5">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="text-gray-700 mb-2">
                  {instruction}
                </li>
              ))}
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}