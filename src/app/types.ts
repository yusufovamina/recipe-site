export interface Recipe {
    id: number;
    name: string;
      dsc: string;
      price: number;
  
    ingredients: string[];
    instructions: string[];
    prepTimeMinutes: number;
    cookTimeMinutes: number;
    servings: number;
    difficulty: string;
    cuisine: string;
    caloriesPerServing: number;
    tags: string[];
    userId: number;
    img: string;
    rating: number;
    reviewCount: number;
    mealType: string[];
  }