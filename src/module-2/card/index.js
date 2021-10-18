export default class Card {
  element;

  constructor({
                id = '',
                images = [],
                title = '',
                rating = 0,
                price = 0,
                category = '',
                brand = ''
              } = {}) {
    this.id = id;
    this.images = images;
    this.title = title;
    this.rating = rating;
    this.price = price;
    this.category = category;
    this.brand = brand;

    this.render();
  }

  getTemplate() {
    return `<section class="card">
        <figure>
          <img class="product" src=${this.images[0]} alt="product image">
        </figure>

        <div class="rate_cost">
          <div class="rate">
            <span>${this.rating}</span>
            <img class="icon" src="../../icons/rate-star.svg" alt="Rate Star">
          </div>

          <div class="cost">
            <span>${this.price} $</span>
          </div>
        </div>

        <article class="description">
          <span>${this.brand} ${this.category}</span>
          <p>${this.title}</p>
        </article>

        <div class="action">
          <button class="wishlist"><img class="icon" src="../../icons/wishlist.svg">wishlist</button>
          <button class="purchase "><img class="icon" src="../../icons/shopping-bag.svg">add to card</button>
        </div>
      </section>`
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();
    this.element = wrapper.firstElementChild;
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
