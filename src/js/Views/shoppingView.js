import View from './View.js';
import icons from 'url:../../img/icons.svg';

class ShoppingView extends View {
  _parentElement = document.querySelector('.shopping-list');

  _generateMarkup() {
    const id = window.location.hash.slice(1);
    return this._data.map(recipe => {
      return recipe.map(
        ingredient =>
          `<li>* ${ingredient.description}  ${ingredient.quantity}  ${ingredient.unit}</li>`
      );
    });
  }

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
}

export default new ShoppingView();
