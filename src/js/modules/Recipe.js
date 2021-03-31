import axios from 'axios';
import dummyRecipe from '../../data/dummy-recipe';

const apiKey = process.env.API_KEY;

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    let recipe;
    try {
      const res = await axios(`https://api.spoonacular.com/recipes/${this.id}/information?apiKey=${apiKey}`);
      recipe = res.data;
    } catch (err) {
      console.log(err);
      recipe = dummyRecipe;
    } finally {
      this.title = recipe.title;
      this.img = recipe.image;
      this.creditsText = recipe.creditsText;
      this.summary = recipe.summary;
      this.instructionsHTML = recipe.instructions;
      this.servings = recipe.servings;
      this.time = recipe.readyInMinutes;
      this.initialIngs = formatExtendedIngs(recipe.extendedIngredients);
      this.ings = formatExtendedIngs(recipe.extendedIngredients);
    }
  }

  updateServings(type) {
    try {
      const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
      this.ings.forEach((ing) => {
        ing.count *= newServings / this.servings;
      });
      this.servings = newServings;
    } catch (err) {
      console.log(err);
    }
  }

  updateIngsList(recipeElement) {
    const ingredient = recipeElement.children[3].textContent;
    const isIngInList = this.ings.some((ing) => ing.ingredient === ingredient);

    if (isIngInList) {
      this.ings = this.ings.filter((ing) => ing.ingredient !== ingredient);
    } else {
      const count = recipeElement.children[1].textContent;
      const unit = recipeElement.children[2].textContent;
      const returnedIng = { ingredient, unit, count: getCountNmberFromString(count) };
      this.ings.push(returnedIng);
    }
  }
}

export const getCountNmberFromString = (countString) => {
  let countArr = countString.split('/');
  countArr = countArr.map((count) => Number(count));
  return countArr[0] / (countArr[1] || 1);
};

const formatExtendedIngs = (extendedIngs) => {
  return extendedIngs.map((ing) => {
    return { ingredient: ing.name, unit: shortenUnits(ing.unit), count: ing.amount };
  });
};

const shortenUnits = (unit) => {
  const unitsLong = ['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds','servings','','grams'];
  const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound', 'serv', 'pc', 'g'];
  const unitIndex = unitsLong.indexOf(unit);
  return unitIndex > -1 ? unitsShort[unitIndex] : unit;
};
