async function getRecipes() {
    const res = await fetch('https://free-food-menus-api-two.vercel.app/all');
    const data = await res.json();
    return data.recipes;
  }