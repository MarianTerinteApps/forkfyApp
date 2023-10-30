import * as model from './model.js';
import recipeView from './Views/recipeView.js';
import searchView from './Views/searchView.js';
import resultsView from './Views/resultsView.js';
import bookmarksView from './Views/bookmarksView.js';
import paginationView from './Views/paginationView.js';
import addRecipeView from './Views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import { MODAL_CLOSE_SECONDS } from './config.js';
import shoppingView from './Views/shoppingView.js';
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    // Get hash id

    const id = window.location.hash.slice(1);
    if (!id) {
      return;
    }
    recipeView.renderSpinner();

    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // Get recipe data
    await model.loadRecipe(id);

    const recipe = model.state.recipe;

    // Render Recipe
    recipeView.render(recipe);
  } catch (error) {
    console.error(error);

    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // 1. Render Spinner
    resultsView.renderSpinner();
    // 2. Get Search query
    const query = searchView.getQuery();
    if (!query) {
      resultsView.removeSpinner();
      resultsView.renderError();
      return;
    }
    // 3. Get Search Results
    await model.loadSearchResults(query);
    // 4. Get Search Results by page
    const pageResults = model.getSearchResultsPage();
    // 5. Render Pagination buttons
    resultsView.render(pageResults);
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
  }
};

const controlPageChange = function (pageNumber) {
  const pageResults = model.getSearchResultsPage(pageNumber);
  resultsView.render(pageResults);
  model.state.search.page = pageNumber;
  paginationView.render(model.state.search);
};

const controlServings = function (nrOfServings) {
  // Update the recipe servings in the state

  model.updateServings(nrOfServings);

  // update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // add/remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  // update recipe view
  recipeView.update(model.state.recipe);

  // render bookmarks

  bookmarksView.render(model.state.bookmarks);
  console.log(model.state.recipe);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // render spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // render recipe
    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    //render the bookmark view
    bookmarksView.render(model.state.bookmarks);

    // change id in the url

    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SECONDS * 1000);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error.message);
  }
};

const controlSortResults = function (sortType) {
  model.sortResults(sortType);
  const pageResults = model.getSearchResultsPage();
  // 5. Render Pagination buttons
  resultsView.render(pageResults);
  paginationView.render(model.state.search);
};

const controlAddToCart = function () {
  model.addIngredientsToCart();
  controlShoppingItems();
};

const controlShoppingItems = function () {
  shoppingView.render(model.state.shoppingCart.ingredients);
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  shoppingView.addHandlerRender(controlShoppingItems);
  // resultsView.addHandlerSort(controlSortResults);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  recipeView.addHandlerAddToCart(controlAddToCart);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPage(controlPageChange);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
