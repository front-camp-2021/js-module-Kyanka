export default class Pagination {
  element;
  start = 0;
  pageIndex = 0;
  subElements = {};

  goToPrevPage = () => {
    this.page -= 1;
    this.update();
  }

  goToNextPage = () => {
    this.page += 1;
    this.update();
  }

  goToPage = (event) => {
    this.page = parseInt(event.target.dataset.id);
    //this.page = event
    this.update()
  }

  constructor({
    totalPages = 10,
    page = 1,
  } = {}) {
    this.totalPages = totalPages;
    this.page = page;
    this.pageIndex = page - 1;
    this.render();
    this.getSubElements();
    this.addEventListeners();
  }

  get pagesTemplate() {
    let pages = ``;
    for(let i = this.start; i < this.totalPages; i++ ){
      let page;
      if(i === this.page -1) {
        page = `<a data-element="pages" data-id="${i + 1}" class="active">${i + 1}</a>`
      } else {
        page = `<a data-element="pages" data-id="${i + 1}">${i + 1}</a>`
      }
      pages += page;
    }
    return pages;
  }

  get template() {
    return `
<footer>
  <button data-element="prevPage" class="arrow back"><img src="./../../icons/arrow.svg"></button>
  <div data-element="pagesList" class="pages">
    ${this.pagesTemplate}
  </div>
  <button data-element="nextPage" class="arrow"><img src="./../../icons/arrow.svg"></button>
</footer>`
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll('[data-element]');
    for (const subElement of elements) {
      const name = subElement.dataset.element;

      if(result[name] && !(result[name] instanceof NodeList)){
        result[name] = this.element.querySelectorAll(`[data-element=${name}]`);
      } else
        result[name] = subElement;
    }
    this.subElements = result;
  }

  remove() {
    if (this.element) {
      this.removeEventListeners();
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
  }

  update() {
    if (this.page < 1) {
      this.page = 1
    }
    else if (this.page > this.totalPages) {
      this.page = this.totalPages
    }
    this.element.querySelector('.active').classList.remove('active');
    this.element.querySelectorAll('a')[this.page - 1].classList.add('active');

    if (this.element) {
      this.element.dispatchEvent(new CustomEvent('page-changed', {
        detail: {
          page: this.page
        }
      }));
    }
  }

  addEventListeners() {
    this.subElements.prevPage.addEventListener('click', this.goToPrevPage);
    this.subElements.nextPage.addEventListener('click', this.goToNextPage);
    this.subElements.pagesList.addEventListener('click', this.goToPage);
  }

  removeEventListeners() {
    this.subElements.prevPage.removeEventListener('click', this.goToPrevPage);
    this.subElements.nextPage.removeEventListener('click', this.goToNextPage);
    this.subElements.pagesList.removeEventListener('click', this.goToPage);
  }
}
