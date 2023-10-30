import { mark } from 'regenerator-runtime';
import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    let markup = '';
    const firstPage = 1;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(numPages);

    // !! Metoda mea
    // if (this._data.results.length < this._data.resultsPerPage) {
    //   return '';
    // }

    // if (
    //   this._data.results.length > this._data.resultsPerPage &&
    //   this._data.page > 0
    // ) {
    //   if (this._data.page === firstPage) {
    //     markup = `
    //     <button class="btn--inline pagination__btn--next">
    //           <span>${this._data.page + 1}</span>
    //           <svg class="search__icon">
    //           <use href="${icons}#icon-arrow-right"></use>
    //           </svg>
    //     </button>
    //             `;
    //   }
    //   if (this._data.page > firstPage && this._data.page < numPages) {
    //     if (
    //       this._data.page * this._data.resultsPerPage >
    //       this._data.resultsPerPage
    //     ) {
    //       markup = `
    //       <button class="btn--inline pagination__btn--prev">
    //             <svg class="search__icon">
    //             <use href="${icons}#icon-arrow-left"></use>
    //             </svg>
    //             <span>${this._data.page - 1}</span>
    //       </button>
    // (
    //   <button class="btn--inline pagination__btn--next">
    //     <span>${this._data.page + 1}</span>
    //     <svg class="search__icon">
    //       <use href="${icons}#icon-arrow-right"></use>
    //     </svg>
    //   </button>

    //     }
    //   }
    //   if (this._data.page === numPages) {
    //     markup = `;
    //           <button class="btn--inline pagination__btn--prev">
    //                   <svg class="search__icon">
    //                   <use href="${icons}#icon-arrow-left"></use>
    //                   </svg>
    //                   <span>${this._data.page - 1}</span>
    //           </button>`;
    //   }
    // }
    // return markup;

    //! metoda din tutorial
    // page 1 and there are other pages
    if (this._data.page === 1 && numPages > 1) {
      return `
      <div class="num-pages">
      <span>${numPages > 1 ? `${numPages} pages` : '1 page'} </span>
    </div>
    <button  data-goto = '${
      this._data.page + 1
    }'class="btn--inline pagination__btn--next">
      <span>${this._data.page + 1}</span>
      <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
      </svg>
</button>`;
    }
    // last page
    if (this._data.page === numPages && numPages > 1) {
      return `
      <div class="num-pages">
      <span>${numPages > 1 ? `${numPages} pages` : '1 page'} </span>
    </div>
        <button data-goto = '${
          this._data.page - 1
        }' class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>${this._data.page - 1}</span>
        </button>`;
    }
    // other pages
    if (this._data.page < numPages) {
      return `
    
      <button data-goto = '${
        this._data.page - 1
      }' class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>${this._data.page - 1}</span>
      </button>
      <div class="num-pages">
        <span>${numPages > 1 ? `${numPages} pages` : '1 page'} </span>
      </div>
      <button data-goto = '${
        this._data.page + 1
      }' class="btn--inline pagination__btn--next">
        <span>${this._data.page + 1}</span>
        <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>`;
    }
    // only page 1
    return '';
  }

  addHandlerPage(handler) {
    this._parentElement.addEventListener('click', e => {
      const button = e.target.closest('button');
      if (!button) {
        return;
      }
      handler(+button.dataset.goto);
    });
  }
}
export default new PaginationView();
