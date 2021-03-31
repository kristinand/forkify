import Search from './modules/Search';
import Recipe from './modules/Recipe';
import List from './modules/List';
import Likes from './modules/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
1. Search object
2. Current recipe object
3. Shopping list object
4. Liked recipes
*/
const state = {};




/** *************************** **/
/** **** SEARCH CONTROLLER **** **/
/** *************************** **/
const controlSearch = async () => {
  const query = searchView.getInput();

  if (query) {
    state.search = new Search(query);

    searchView.clearInput();
    searchView.clearResults();
    searchView.clearResultsTotalNumber();

    renderLoader(elements.searchRes);

    try {
      await state.search.getResults();
      searchView.renderResults(state.search.result);
      searchView.renderTotalRecipesNumber(state.search.totalResults);
    } catch (err) {
      console.log(err);
    } finally {
      clearLoader();
    }
  }
};

// when we submit the search form, async function controlSearch starts
elements.searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  controlSearch();
});



elements.searchResPages.addEventListener('click', (event) => {
  const btn = event.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});




/** *************************** **/
/** **** RECIPE CONTROLLER **** **/
/** *************************** **/
const controlRecipe = async () => {
  const id = window.location.hash.replace('#', '');
  if (id) {
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // Highlight selected search item
    if (state.search) searchView.highlightSelected(id);

    // Create new recipe object
    state.recipe = new Recipe(id);

    try {
      // Get recipe data after waiting the response -> await
      await state.recipe.getRecipe();

      // Render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (err) {
      console.log(err);
    }
  }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach((event) => window.addEventListener(event, controlRecipe));





/** ****************************** **/
/** **** Shop List CONTROLLER **** **/
/** ****************************** **/
const controlList = () => {
  if (!state.list) state.list = new List();

  //add each ingredient to the list and ui
  state.recipe.ings.forEach((ing) => {
    const findIng = state.list.foodList.find((listElement) => {
      return listElement.ingredient === ing.ingredient && listElement.unit === ing.unit;
    });
    if (findIng) {
      const newCount = findIng.count + ing.count;
      state.list.updateItemCount(findIng.id, newCount);
      listView.updateItemCount(findIng.id, newCount);
    } else {
      const item = state.list.addItem(ing.count, ing.unit, ing.ingredient);
      listView.renderItem(item);
    }
  });
};

// handle delete and update list item events
elements.shopping.addEventListener('click', (event) => {
  const id = event.target.closest('.shopping__item').dataset.itemid;

  // handle delete btn
  if (event.target.matches('.shopping__delete, .shopping__delete *')) {
    state.list.deleteItem(id);
    listView.deleteItem(id);

    // handle count update
  } else if (event.target.matches('.shopping__count-value')) {
    const val = parseFloat(event.target.value, 10);
    state.list.updateCount(id, val);
  }
});




/** *************************** **/
/** ***** LIKES CONTROLLER **** **/
/** *************************** **/
const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  // User has not yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
    const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.creditsText, state.recipe.img);
    likesView.toggleLikeBtn(true);
    likesView.renderLike(newLike);

    // User has liked current recipe
  } else {
    state.likes.deleteLike(currentID);
    likesView.toggleLikeBtn(false);
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};




// Restore liked recipes on page loads
window.addEventListener('load', () => {
  state.likes = new Likes();
  state.list = new List();

  // Restore local data
  state.likes.readStorage();
  state.list.readStorage();

  if (state.list.foodList.length > 0) {
    state.list.foodList.forEach((food) => listView.renderItem(food));
  }

  // Toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  // Render the existing likes
  state.likes.likes.forEach((like) => likesView.renderLike(like));

  // Show random recipe
  if (window.location.hash === '') {
    const randomNumber = Math.round(Math.random() * (1000 - 1) + 1);
    window.location.hash = '#' + randomNumber;
  }
});




// Handling recipe button clicks
elements.recipe.addEventListener('click', (event) => {
  if (event.target.matches('.btn-decrease, .btn-decrease *')) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (event.target.matches('.btn-increase, .btn-increase *')) {
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    controlList();
  } else if (event.target.matches('.recipe__love, .recipe__love *')) {
    controlLike();
  } else if (event.target.matches('.recipe__item *')) {
    const recipeItem = event.target.closest('.recipe__item');
    state.recipe.updateIngsList(recipeItem);
    recipeView.toggleIngAddIcon(recipeItem);
  }
});
