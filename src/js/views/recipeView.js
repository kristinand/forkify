import { elements } from './base';
import { Fraction } from 'fractional';

export const clearRecipe = () => (elements.recipe.innerHTML = '');

const createIngredient = (ingredient) => `
  <li class="recipe__item">
    <svg class="recipe__icon">
      <use href="img/icons.svg#icon-check"></use>
    </svg>
    <span class="recipe__count">${formatCount(ingredient.count)}</span>
    <span class="recipe__unit">${ingredient.unit}</span>
    <span class="recipe__ingredient">${ingredient.ingredient}</span>
  </li>
`;

export const renderRecipe = (recipe, isLiked) => {
  const markup = `
    <figure class="recipe__fig">
      <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
      <h1 class="recipe__title">
        <span>${recipe.title}</span>
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="img/icons.svg#icon-stopwatch"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
        <span class="recipe__info-text"> minutes</span>
      </div>

      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="img/icons.svg#icon-man"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
        <span class="recipe__info-text"> servings</span>

        <div class="recipe__info-buttons">
          <button class="btn-tiny btn-decrease">
            <svg>
              <use href="img/icons.svg#icon-circle-with-minus"></use>
            </svg>
          </button>
          <button class="btn-tiny btn-increase">
            <svg>
              <use href="img/icons.svg#icon-circle-with-plus"></use>
            </svg>
          </button>
        </div>
      </div>

      <button class="recipe__love">
        <svg class="header__likes">
          <use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
        </svg> 
      </button>
    </div>

    <div class="recipe__summary">
      <h2 class="heading-2">Summary</h2>
      <p class="recipe__summary-text">${recipe.summary}</p>
    </div>

    <div class="recipe__ingredients">
      <ul class="recipe__ingredient-list">
        ${recipe.ings.map((ing) => createIngredient(ing)).join('')}
      </ul>

      <button class="btn-small recipe__btn recipe__btn--add">
        <svg class="search__icon">
          <use href="img/icons.svg#icon-shopping-cart"></use>
        </svg>
        <span>Add to shopping list</span>
      </button>
    </div>

    <div class="recipe__directions">
      <h2 class="heading-2">How to cook it</h2>
      <span class="recipe__directions-list">${recipe.instructionsHTML}</span>
      <p class="recipe__directions-text">Recipe by:</span></p>
      <p class="recipe__directions-text"><span class="recipe__by">${recipe.creditsText}</span></p>
    </div>
	`;

  elements.recipe.insertAdjacentHTML('afterbegin', markup);
};

export const toggleIngAddIcon = (recipeElement) => {
  const icon = recipeElement.firstElementChild.firstElementChild;
  icon.classList.toggle('hidden');
};

export const updateServingsIngredients = (recipe) => {
  document.querySelector('.recipe__info-data--people').textContent = recipe.servings;

  const countElements = Array.from(document.querySelectorAll('.recipe__count'));
  countElements.forEach((el, i) => {
    el.textContent = formatCount(recipe.ings[i].count);
  });
};

export const formatCount = (count) => {
  if (count) {
    const newCount = Math.round(count * 10000) / 10000;
    const [int, dec] = newCount
      .toString()
      .split('.')
      .map((el) => parseInt(el, 10));

    if (!dec) return newCount;

    if (int === 0) {
      const fr = new Fraction(newCount);
      return `${fr.numerator}/${fr.denominator}`;
    } else {
      const fr = new Fraction(newCount - int);
      return `${int} ${fr.numerator}/${fr.denominator}`;
    }
  } else {
    return '?';
  }
};
