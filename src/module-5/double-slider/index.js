export default class DoubleSlider {
  element;
  subElements = {};
  moving = {
    toLeft: false,
    toRight: false
  };

  leftThumbDrag = () => {
    this.moving.toLeft = true;
    this.moving.toRight = false;
  };

  rightThumbDrag = () => {
    this.moving.toLeft = false;
    this.moving.toRight = true;
  };

  progressMove = (event) => {
    let rect = this.subElements.sliderInner.getBoundingClientRect();
    if (this.moving.toLeft) {
      this.selected.from = this.min + Math.round((event.clientX - rect.left) / rect.width * (this.max - this.min));
    } else if (this.moving.toRight) {
      this.selected.to = this.min + Math.round((event.clientX - rect.left) / rect.width * (this.max - this.min));
    }
    this.update();
  };

  progressStop = () => {
    this.moving.toLeft = false;
    this.moving.toRight = false;
    this.dispatchRangeEvent();
  }

  constructor({
                min = 100,
                max = 200,
                value = '',
                formatValue = value => value,
                selected = {
                  from: min,
                  to: max
                },
                precision = 0,
                filterName = 'Price'
              } = {}) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue(value);
    this.selected = selected;
    this.precision = precision;
    this.filterName = filterName;

    this.addFormatValue();
    this.countLeftValue();
    this.countRightValue();

    this.render();
    this.getSubElements();
    this.addEventListeners();
  }

  countLeftValue() {
    return (this.selected.from - this.min) / (this.max - this.min) * 100 + '%';
  }

  countRightValue() {
    return (this.max - this.selected.to) / (this.max - this.min) * 100 + '%';
  }

  addFormatValue(valueSlider) {
    return this.formatValue + valueSlider;
  }

  get template() {
    const {from, to} = this.selected;
    return `<div class="range-slider" data-element="rangeSlider">
        <span data-element="from">${this.addFormatValue(from)}</span>
        <div class="range-slider__inner" data-element="sliderInner">
          <span data-element="progress" class="range-slider__progress"
          style="left: ${this.countLeftValue()}; right: ${this.countRightValue()}"></span>
          <span data-element="thumbLeft" class="range-slider__thumb-left"
          style="left: ${this.countLeftValue()}"></span>
          <span data-element="thumbRight" class="range-slider__thumb-right"
          style="right: ${this.countRightValue()}"></span>
        </div>
        <span data-element="to">${this.addFormatValue(to)}</span>
      </div >`
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
    if (this.selected.from < this.min) {
      this.selected.from = this.min
    } else if (this.selected.to > this.max) {
      this.selected.to = this.max
    } else if (this.selected.to < this.min) {
      this.selected.to = this.min
    } else if (this.selected.from > this.selected.to) {
      this.selected.from = this.selected.to
    }
    this.subElements.thumbLeft.style.left = this.countLeftValue();
    this.subElements.thumbRight.style.right = this.countRightValue();
    this.subElements.progress.style.left = this.countLeftValue();
    this.subElements.progress.style.right = this.countRightValue();
    this.subElements.from.textContent = this.addFormatValue(this.selected.from);
    this.subElements.to.textContent = this.addFormatValue(this.selected.to);
    if(this.element){

    }
  }
  dispatchRangeEvent() {
    const newEvent = new CustomEvent("range-selected", { bubbles: true, detail: {filterName: this.filterName, value: this.selected} });
    this.element.dispatchEvent(newEvent);
  }

  addEventListeners() {
    this.subElements.thumbLeft.addEventListener('pointerdown', this.leftThumbDrag)
    this.subElements.thumbRight.addEventListener('pointerdown', this.rightThumbDrag)
    this.element.addEventListener('pointermove', this.progressMove);
    this.element.addEventListener('pointerup', this.progressStop);
  }

  removeEventListeners() {
    this.subElements.thumbLeft.removeEventListener('pointerdown', this.leftThumbDrag)
    this.subElements.thumbRight.removeEventListener('pointerdown', this.rightThumbDrag)
    this.element.removeEventListener('pointermove', this.progressMove);
    this.element.removeEventListener('pointerup', this.progressStop);
  }
}
