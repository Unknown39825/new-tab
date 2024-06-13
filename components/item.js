class CustomItem extends HTMLElement {
    constructor() {
        super(); 
    }

    connectedCallback() {
        this.render();
        this.addEventListener();
    }

    removeItem(){
        const componentId = this.getAttribute("componentid");
        const subId = this.getAttribute("index")
        if(!componentId || !subId)
            alert("Unable to delete")

        const components = JSON.parse(localStorage.getItem("components"));
        debugger;
        components[componentId]?.items?.splice(subId, 1);
          
        localStorage.setItem("components",JSON.stringify(components));
        getLinks();
        // toggleRemoveButtons();
    }

    addEventListener() {
        this.querySelector('#removeItem').addEventListener('click', ()=>this.removeItem.bind(this)());
    }

    render() {
        this.innerHTML = `
            <li class="item">
            <a href="${this.getAttribute("link")}" >
				<i class="item-icon fa-solid ${this.getAttribute('icon')}"></i>
				<span class="item-text">${this.getAttribute("text")}</span>

			</a>
             <button id="removeItem"  class="buttonCustom buttonCustomVisible"><i class="fa-solid fa-trash deleteIcon"></i></button>

            </li>`;
    }
}

customElements.define('custom-item', CustomItem);