import { async } from 'regenerator-runtime';
import { API_URL, RESULTS_PER_PAGE, API_KEY } from './config';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  shoppingCart: {
    ingredients: [],
  },
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else state.recipe.bookmarked = false;
    console.log(state.recipe);
  } catch (error) {
    throw error;
  }
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        cookingTime: recipe.cookingTime,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    console.log(state.search.results);
    state.search.page = 1;
  } catch (error) {
    throw error;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  return state.search.results.slice(
    (page - 1) * state.search.resultsPerPage,
    page * state.search.resultsPerPage
  );
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(element => {
    element.quantity = (element.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  // add bookmark
  state.bookmarks.push(recipe);
  // mark current recipe as bookmark
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  //delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  // mark current recipe as bookmark
  state.recipe.bookmarked = false;
  persistBookmarks();
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  const shoppingCart = localStorage.getItem('ingredients');

  if (storage) {
    state.bookmarks = JSON.parse(storage);
  }
  if (shoppingCart) {
    state.shoppingCart.ingredients = JSON.parse(shoppingCart);
  }
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

export const uploadRecipe = async function (data) {
  try {
    console.log(Object.entries(data));
    const ingredients = Object.entries(data)
      .filter(el => el[0].includes('ingredient') && el[1] !== '')
      .map(ingredient => {
        const ingredientsArray = ingredient[1].split(',').map(el => el.trim());

        if (ingredientsArray.length !== 3)
          throw new Error(
            'Wrong Ingredient format. Please use the correct format!!'
          );
        const [quantity, unit, description] = ingredientsArray;
        return {
          quantity: quantity ? Number(quantity) : null,
          unit,
          description,
        };
      });

    const recipe = {
      title: data.title,
      publisher: data.publisher,
      source_url: data.sourceUrl,
      image_url: data.image,
      servings: +data.servings,
      cooking_time: +data.cookingTime,
      ingredients,
    };

    const response = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(response);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};

export const sortResults = function (sortTarget) {
  let data;
  if (sortTarget === 'duration') {
    data = state.search.results.sort((a, b) => a.cookingTime < b.cookingTime);

    state.search.results = data;
  }
};

export const addIngredientsToCart = function () {
  state.shoppingCart.ingredients.push(state.recipe.ingredients);
  persistShoppingItems();
  console.log(state.shoppingCart.ingredients);
};

const persistShoppingItems = function () {
  localStorage.setItem(
    'ingredients',
    JSON.stringify(state.shoppingCart.ingredients)
  );
};
