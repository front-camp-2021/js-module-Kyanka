import Pagination from '../../module-5/pagination/index.js';
import SideBar from '../../module-4/side-bar/index.js';
import CardsList from '../../module-3/cards-list-v1/index.js';
import FiltersList from "../../module-4/filters-list/index.js";
import Search from '../search/index.js';
import Card from "../../module-2/card/index.js";
import { request } from './request/index.js';
import { prepareFilters } from './prepare-filters/index.js';



const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

export default class Page {
  element;
  subElements = {};
  components = {};
  pageLimit = 9;
  totalPages = 100;
  page = 1;
  filters = new URLSearchParams();
  filtersList = {
    category: [],
    brand: []
  }

  onPageChanged = (event) => {
    this.page = event.detail;
    this.filters.set('_page', this.page.toString());
    this.getProducts(this.filters).then(({ products }) => {
      this.updateCardsList(products);
    })
  }

  onSearch = (event) => {
    const searchContent = event.detail.toLowerCase();
    this.page = 1;
    this.filters.set('q', searchContent);
    this.filters.set("_page", this.page);
    this.update();
  }

  onRangeChange = (event) => {
    const { filterName, value } = event.detail;
    const name = filterName.toLowerCase();
    this.page = 1;
    this.filters.set(`${name}_gte`, value.from);
    this.filters.set(`${name}_lte`, value.to);
    this.filters.set("_page", this.page)
    this.update();
  }

  onFilterSelected = (event) => {
    const entries = event.detail.map(item => item.split("="));
    this.page = 1;
    this.filters.set("_page", this.page);

    for(let key of Object.keys(this.filtersList)) {
      this.filtersList[key] = [];
    }

    entries.forEach(item => {
      const [key, value] = item;
      if(this.filtersList[key]) this.filtersList[key].push(value);
    });

    for(let key of Object.keys(this.filtersList)) {
      this.filters.delete(key);

      if(this.filtersList[key].length > 0) {
        this.filtersList[key].forEach(value => {
          this.filters.append(key, value);
        })
      }
    }
    this.update();
  }

  onClearFilters = () => {
    this.page = 1;
    this.filters = new URLSearchParams();
    this.filters.set('_page', '1');
    this.filters.set('_limit', this.pageLimit);
    this.components.search.reset();
    this.update();
  }

  constructor() {
    this.filters.set('_page', '1');
    this.filters.set('_limit', this.pageLimit);

    this.render();
    this.getSubElements();
    this.renderComponents();
    this.addEventListeners();
  }

  get template () {
    return`
<div class="body">
<header>
  <div class="logo">
    <img alt="Logo" src="images/logo.svg">
    <p>Online Store</p>
  </div>
  <nav>
    <a href=""><span>&#8962;</span></a>
    <img src="images/arrows.png">
    <a href="">eCommerce</a>
    <img src="images/arrows.png">
    <a href="">Electronics</a>
  </nav>
</header>

<div class="results">
  <div class="caption">
    <span>7,618 results found</span>
    <button><img src="images/wishlist.svg"></button>
  </div>
  <div class="under-caption">
    <div data-element="searchBox" class="search"></div>
    <div data-element="cardList" class="content"></div>
  </div>
</div>
</div>`
  }

  getSubElements(){
    const result = {};
    const elements = this.element.querySelectorAll('[data-element]');
    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }
    this.subElements = result;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;
  }

  renderComponents () {
    this.renderSidebar();
    this.renderSearch();
    this.renderCardsList();
    this.renderPagination();
  }

  renderPagination () {
    const pagesAmount = Math.ceil(this.totalPages / this.pageLimit)
    this.components.pagination = new Pagination({totalPages: pagesAmount, page: 1});
    const { pagination } = this.components;
    this.element.append(pagination.element);
  }

  renderSidebar () {
    this.getFilters().then(() => {
      this.components.sidebar = new SideBar(this.categoriesFilter, this.brandFilter, FiltersList);
      const { sidebar } = this.components;
      this.element.append(sidebar.element);
    });
  }

  renderSearch () {
    this.components.search = new Search();
    const { search } = this.components;
    this.subElements.searchBox.append(search.element);
  }

  renderCardsList () {
    this.getProducts(this.filters).then(({ products }) => {
      this.components.cardsList = new CardsList({data: products, Component: Card});
      const { cardsList } = this.components;
      this.subElements.cardList.append(cardsList.element);
    })
  }

  update () {
    this.getProducts(this.filters).then(({ products, totalPages }) => {

      this.totalPages = totalPages;

      const pagesAmount = Math.ceil(this.totalPages / this.pageLimit);
      this.updatePagination(pagesAmount);
      this.updateCardsList(products);
    });
  }

  updatePagination (pagesAmount) {
    const { pagination } = this.components;
    pagination.update(pagesAmount);
  }

  updateCardsList (products) {
    const { cardsList } = this.components;
    cardsList.update(products);
  }

  async getFilters () {
    const [categories] = await this.getResource(new URL("categories", BACKEND_URL));
    this.categoriesFilter = categories? prepareFilters(categories, "category") : [];
    const [brands] = await this.getResource(new URL("brands", BACKEND_URL));
    this.brandFilter = brands? prepareFilters(brands, "brand") : [];
  }

  async getProducts (search = "") {
    const url = new URL("products", BACKEND_URL);
    if(search) url.search = search;
    const [result, headers] = await this.getResource(url);
    const products = result? result : [];
    const totalPages = headers? Number(headers.get("X-Total-Count")) : 0;
    return { products, totalPages };
  }

  async getResource (url) {
    const [data, error, headers] = await request(url);
    if(error) {
      console.error(`${error}: failed to load resource from ${url}`);
      return [null, null];
    } else {
      return [data, headers];
    }
  }


  addEventListeners(){
    this.element.addEventListener("page-changed", this.onPageChanged);
    this.element.addEventListener("search-filter", this.onSearch);
    this.element.addEventListener("range-selected", this.onRangeChange);
    this.element.addEventListener("filter-selected", this.onFilterSelected);
    this.element.addEventListener("clear-filters", this.onClearFilters);
  }

  removeEventListeners () {
    this.element.removeEventListener("page-changed", this.onPageChanged);
    this.element.removeEventListener("search-filter", this.onSearch);
    this.element.removeEventListener("range-selected", this.onRangeChange);
    this.element.removeEventListener("filter-selected", this.onFilterSelected);
    this.element.removeEventListener("clear-filters", this.onClearFilters);
  }

  remove () {
    if (this.element) {
      this.element.remove();
      this.removeEventListeners();
    }
  }

  destroy () {
    this.remove();
    this.element = null;
  }
}
