import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => elements.searchInput.value = '';

export const clearResults = () => {
  elements.searchResList.innerHTML = '';
  elements.searchResPages.innerHTML = '';
};

export const clearResultsTotalNumber = () => elements.searchResTotal.innerHTML = '';

export const highlightSelected = (id) => {
  const resultsArr = Array.from(document.querySelectorAll('.results__link'));
  resultsArr.forEach((el) => {
    el.classList.remove('results__link--active');
  });
  document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active');
};

export const limitRecipeTitile = (title, limit = 17) => {
  const newTitle = [];
  title = title.split(' ');
  if (title.join('').length > limit) {
    title.reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    return `${newTitle.join(' ')} ...`;
  }
  return title.join(' ');
};

export const renderTotalRecipesNumber = (totalNumber) => {
  const markup = `<p class="results__info heading-2"> Found <span>${totalNumber}</span> recipes</p>`;
  elements.searchResTotal.insertAdjacentHTML('afterbegin', markup);
};

const renderRecipe = (recipe) => {
  const markup = `
    <li>
      <a class="results__link" href="#${recipe.id}">
        <figure class="results__fig">
          <img src="${recipe.image}" alt="Test">
        </figure>
        <div class="results__data">
          <h4 class="results__name" title="${recipe.title}">${limitRecipeTitile(recipe.title)}</h4>
          <p class="results__author">recipe.publisher</p>
        </div>
      </a>
    </li>
  `;
  elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

const createButton = (page, type, side) => `
	<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
		<span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    <svg class="search__icon">
      <use href="img/icons.svg#icon-triangle-${side}"></use>
    </svg>
	</button>
`;

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);
  let button = '';
  if (page === 1 && pages > 1) {
    button = createButton(page, 'next', 'right');
  } else if (page === pages && pages > 1) {
    button = createButton(page, 'prev', 'left');
  } else if (page < pages) {
    button = `
			${createButton(page, 'next', 'right')}
			${createButton(page, 'prev', 'left')}
		`;
  }
  elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;
	recipes.slice(start, end).forEach(renderRecipe);
	
  renderButtons(page, recipes.length, resPerPage);
};