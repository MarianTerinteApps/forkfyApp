import { mark } from 'regenerator-runtime';
import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  /**
   * Render the received object to the dom
   * @param {Object | Object[]} data The data to be rendered(e.g recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the dom
   * @returns {undefined | string} A markup string is returned if render= false
   * @this {Object} View instance
   * @author Marian Terinte
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && !data.length)) {
      this.removeSpinner(this._parentElement);

      return this.renderError();
    }
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) {
      return markup;
    }
    this.removeSpinner(this._parentElement);
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  removeSpinner() {
    this._parentElement.innerHTML = '';
  }

  renderError(message = this._message) {
    const markup = `<div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${this._errorMessage}</p>
      </div>`;
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    if (!data || (Array.isArray(data) && !data.length)) {
      return;
    }
    // if (!data || (Array.isArray(data) && !data.length)) {
    //   this.removeSpinner(this._parentElement);

    //   return this.renderError();
    // }

    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );

    currentElements.forEach((currentElement, index) => {
      //! Metoda 1
      // if (newElements[index].innerText !== currentElement.innerText) {
      //   currentElement.innerHTML = newElements[index].innerHTML;
      // }
      //! Metoda 2
      // e mai clunky
      // update changed text
      const newElement = newElements[index];
      !newElement.isEqualNode(currentElement) &&
      newElement.firstChild?.nodeValue.trim() !== ''
        ? (currentElement.textContent = newElement.textContent)
        : null;
      // update changed attributes
      if (!newElement.isEqualNode(currentElement)) {
        Array.from(newElement.attributes).forEach(atr => {
          currentElement.setAttribute(atr.name, atr.value);
        });
      }
    });
  }

  renderMessage() {
    const markup = `<div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${this._message}</p>
      </div>`;
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
        </div>
    `;
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
}
