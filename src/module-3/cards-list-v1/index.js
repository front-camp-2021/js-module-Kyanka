export default class CardsList {
  element;
  subElements = {};

  constructor({data = [], Component = {}}) {
    this.data = data;
    this.Component = Component;
    this.render();
    this.getSubElements();
    this.update(this.data);
  }

  get template() {
    return `<main class="card-list" data-element="body"></main>`
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;
    this.element = wrapper;
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll('[data-element="body"]')
    for(const subElement of elements){
      const name = subElement.dataset.element;
      result[name] = subElement;
    }

    this.subElements = result;
  }

  update(data = []) {
    this.data = data;
    const cards = data.map(item => (new this.Component(item).element))
    if(cards.length)
      this.subElements.body.replaceChildren(...cards)
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}
