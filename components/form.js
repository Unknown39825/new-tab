class SearchLink extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  addEventListeners() {
    this.searchInput = this.querySelector("#search-input");
    this.searchForm = this.querySelector("#search-form");
    this.searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit.bind(this)();
    });
  }

  render() {
    this.innerHTML = `
      <form class="form-search" id="search-form">
        <input type="text" id="search-input" class="search-input" placeholder="${this.getAttribute(
          "title"
        )}"  />
      </form>
    `;
  }

  handleSubmit() {
    const urlBase = this.baseUrl;
    const query = this.searchInput.value;
    const url = `${urlBase}${encodeURIComponent(query)}`;
    window.location.href = url;
  }
}

customElements.define("search-form", SearchLink);
