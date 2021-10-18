import { debounce } from '../../module-1/debounce/index.js';

export default class Search {
  element;
  subElements = {};

  onSubmit = (event) => {
    event.preventDefault();
    this.dispatchSearchEvent (this.subElements.searchInput.value);
  }

  onChange = debounce(() => {
    this.dispatchSearchEvent (this.subElements.searchInput.value);
  }, 1000);

  constructor(){
    this.render();
    this.getSubElements();
    this.addEventListeners();
  }

  get template(){
    return `
    <div data-element="searchEl" class="search">
      <input data-element="searchInput"placeholder="Search" type="search">
      <button data-element="searchBtn" type="submit"><i class="fa fa-search"></i></button>
    </div>`
  }

  render(){
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;
  }

  getSubElements(){
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

  dispatchSearchEvent (value) {
    if(this.value === value) return;
    this.value = value;
    const newEvent = new CustomEvent("search-filter", { bubbles: true, detail: this.value  });
    this.element.dispatchEvent(newEvent);
  }

  addEventListeners() {
    this.subElements.searchBtn.addEventListener("submit", this.onSubmit);
    this.subElements.searchInput.addEventListener("keyup", this.onChange);
  }

  removeEventListeners() {
    this.subElements.searchBtn.removeEventListener("submit", this.onSubmit);
    this.subElements.searchInput.removeEventListener("keyup", this.onChange);
  }

  reset = () => {
    this.subElements.searchInput.value = "";
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
    this.subElements = {};
  }
}
