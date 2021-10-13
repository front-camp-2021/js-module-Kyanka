export default class SideBar {
  element;
  subElements = {};
  clearFilters = () => {
    const filters = this.getFilterCards();
    Object.values(filters).forEach(item => item.reset());
    this.update();
    this.element.dispatchEvent(new CustomEvent('clear-filters'));
  }

  constructor (categoriesFilter = [], brandFilter = [], Component = {}) {
    this.Component = Component;
    this.categoriesFilter = categoriesFilter;
    this.brandFilter = brandFilter;
    this.render();
    this.getSubElements();
    this.addEventListeners();
  }

  get template() {
    return `<div class="filters">
  <div class="caption">
    <span>Filters</span>
    <button><img src="../../icons/arrows.png" alt="arrows"></button>
  </div>

  <div data-element="body" class="filter-cards">
    ${this.getFilterCards().categoryFilterList.element.innerHTML}
    <div class="divider"></div>
    ${this.getFilterCards().brandFilterList.element.innerHTML}
  </div>
  <button data-element="button" id="reset">clear all filters</button>
</div>`
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstChild;
  }

  remove() {
    if(this.element) {
      this.removeEventListeners();
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }

  reset() {
    this.clearFilters();
  }

  update() {
    const filterElements = this.getFilterCardsTemplate();

    this.subElements.body.replaceChildren(...filterElements);
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll('[data-element]');
    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }
    this.subElements = result;

  }

  getFilterCards() {
    const Filter = this.Component
    const categoryFilterList = new Filter({
      title: 'Category',
      list: this.categoriesFilter
    });
    const brandFilterList = new Filter({
      title: 'Brand',
      list: this.brandFilter
    });
    return { categoryFilterList, brandFilterList };
  }

  getFilterCardsTemplate() {
    const filters = this.getFilterCards();
    const filterElements = Object.values(filters).map(filter => filter && filter.element);
    const divider = document.createElement('div')
    divider.classList.add('divider')
    let filterTemplate = [];
    filterElements.forEach(filter => {
      filterTemplate.push(filter);
      if(filterElements.at(-1) != filter) filterTemplate.push(divider);
    })
    return filterTemplate;
  }

  addEventListeners() {
    this.subElements.button.addEventListener('click', this.clearFilters);
  }

  removeEventListeners() {
    this.subElements.button.removeEventListener('click', this.clearFilters);
  }

}
