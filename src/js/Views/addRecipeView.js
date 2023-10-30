import { mark } from 'regenerator-runtime';
import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _windowElement = document.querySelector('.add-recipe-window');
  _overlayElement = document.querySelector('.overlay');
  _openModalBtn = document.querySelector('.nav__btn--add-recipe');
  _closeModalBtn = document.querySelector('.btn--close-modal');
  _message = 'Recipe was successfully uploaded!';
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  _addHandlerShowWindow() {
    this._openModalBtn.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._closeModalBtn.addEventListener('click', this.toggleWindow.bind(this));
    this._overlayElement.addEventListener(
      'click',
      this.toggleWindow.bind(this)
    );
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArray = [...new FormData(this)];
      const data = Object.fromEntries(dataArray);
      handler(data);
    });
  }

  toggleWindow() {
    this._overlayElement.classList.toggle('hidden');
    this._windowElement.classList.toggle('hidden');
  }

  _generateMarkup() {}
}
export default new AddRecipeView();
