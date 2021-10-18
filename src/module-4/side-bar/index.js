import DoubleSlider from "../../module-5/double-slider/index.js";
export default class SideBar {
  element;
  subElements = {};
  filters = [];
  sliders = [];
  selectedFilters = [];
  clearFilters = () => {
    const filters = this.getFilterCards();
    Object.values(filters).forEach(item => item.reset());
    this.update();
    this.element.dispatchEvent(new CustomEvent('clear-filters',{ bubbles: true }));
  }

  addFilter = (event) => {
    this.selectedFilters.push(event.detail);
    const newEvent = new CustomEvent("filter-selected", { bubbles: true, detail: this.selectedFilters });
    this.element.dispatchEvent(newEvent);

  }

  removeFilter = (event) => {
    const index = this.selectedFilters.findIndex(item => item === event.detail);
    if(index < 0) return;
    this.selectedFilters.splice(index, 1);
    const newEvent = new CustomEvent("filter-selected", { bubbles: true, detail: this.selectedFilters });
    this.element.dispatchEvent(newEvent);
  }

  constructor (categoriesFilter = [], brandFilter = [], Component = {}) {
    this.Component = Component;
    this.categoriesFilter = categoriesFilter;
    this.brandFilter = brandFilter;
    this.render();
    this.getSubElements();
    this.renderComponents();
    this.addEventListeners();
  }

  get template() {
    return `<div class="filters">
  <div class="caption">
    <span>Filters</span>
    <button><img src="../../icons/arrows.png" alt="arrows"></button>
  </div>
  <div data-element="slider"></div>
  <div data-element="body" class="filter-cards"></div>
  <button data-element="button" id="reset">clear all filters</button>
</div>`
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstChild;
  }

  renderComponents(){
    const slider = new DoubleSlider({
        min: 0,
        max: 85000,
        precision: 0,
        formatValue: value => value +' $',
        filterName: "Price"});
    this.subElements.slider.append(slider.element);
    const filterElements = this.getFilterCardsTemplate();
    this.subElements.body.replaceChildren(...filterElements);
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
    this.element.addEventListener("add-filter", this.addFilter);
    this.element.addEventListener("remove-filter", this.removeFilter);
    this.subElements.button.addEventListener('click', this.clearFilters);
  }

  removeEventListeners() {
    this.element.removeEventListener("add-filter", this.addFilter);
    this.element.removeEventListener("remove-filter", this.removeFilter);
    this.subElements.button.removeEventListener('click', this.clearFilters);
  }

}
