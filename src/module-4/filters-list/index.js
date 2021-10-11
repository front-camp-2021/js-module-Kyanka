export default class FiltersList {
  constructor({
                title = '',
                list = []
              } = {}) {
    this.title = title;
    this.list = list;
    this.activeFilters = []
    this.render();
  }

  get template() {
    return `<div class="filters">
      <div class="caption">
        <span>Filters</span>
        <button><img src="../../icons/arrows.png" alt="arrows"></button>
      </div>
      <div class="filter-card">
        <span class="filters-caption">${this.title}</span>
        <div>
            ${this.list.map(item => `
          <p>
            <input name="category" value="${item.value}" type="checkbox" class="filter_item" ${item.checked === true ? "checked" : ``}>
            ${item.title}
          </p>`).join(``)}
        </div>
      </div>
      <button id="reset">clear all filters</button>
    </div>`
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;
    this.element = wrapper;
  }

  reset() {
    document.querySelectorAll('input.filter_item').forEach(item => item.checked = false)
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
  }
}
