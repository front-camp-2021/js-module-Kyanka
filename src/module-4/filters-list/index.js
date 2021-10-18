export default class FiltersList {
  element;
  subElements = {};
  onCheck = event => {
    if(event.target.type !== "checkbox") return;
    const customEventName = event.target.checked ? 'add-filter' : 'remove-filter';
    event.target.dispatchEvent(new CustomEvent(customEventName, { bubbles: true, detail: event.target.value }));
  }
  constructor({
                title = '',
                list = []
              } = {}) {
    this.title = title;
    this.list = list;

    this.render();
    this.getSubElements();
    this.update();
    this.addEventListeners();
  }

  get template() {
    return `
      <div class="filter-card">
        <span class="filters-caption">${this.title}</span>
        <div data-element="filters">
         ${this.getFilterItems()}
        </div>
      </div>`
  }

  getFilterItems(){
    return `${this.list.map(item => `
          <p>
            <input name="category" value="${item.value}" type="checkbox" class="filter_item" ${item.checked === true ? "checked" : ``}>
            ${item.title}
          </p>`).join(``)}`
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;
    this.element = wrapper;
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

  reset() {
    this.list.forEach(item => item.checked = false)
    this.update();
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
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getFilterItems();
    this.subElements.filters.replaceChildren(...wrapper.children);
  }

  addEventListeners() {
    this.element.addEventListener('change', this.onCheck);
  }

  removeEventListeners() {
    this.element.removeEventListener('change', this.onCheck);
  }
}
