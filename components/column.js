import './item.js'
class CustomColumn extends HTMLElement {
    constructor() {
        super(); // Always call super first in constructor
        // Initialize or create shadow dom, attach styles, etc.
        this.items = [];
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    addItem() {
        showAddLink(this.componentId);
    }

    removeColumn(){
        const componentId = this.componentId;
        if(!componentId )
            alert("Unable to delete")

        const components = JSON.parse(localStorage.getItem("components"));
        components.splice(componentId,1);
          
        localStorage.setItem("components",JSON.stringify(components));
        getLinks();
    }

    addEventListeners() {
        this.querySelector('#addButton').addEventListener('click', ()=>this.addItem.bind(this)());
        this.querySelector('#removeComponent').addEventListener('click', ()=>this.removeColumn.bind(this)());
    }

    renderItems(){
        return this.items.map((subcomponent,index)=>
            {
                if(subcomponent.isHtml) {
                    return subcomponent.content;
                } else{
                    return `<custom-item index=${index} componentId=${this.componentId}  text="${subcomponent.text}" link="${subcomponent.link}" icon="${getImageUrl(subcomponent.link)}"></custom-item>`
                }
            }
        ).join('');
    }

    render() {
        this.innerHTML = `
                <div class="column-title">
					<a href="${this.link}">
                    <h1>${this.title}</h1><i class="fa-solid ${this.icon}"></i>
					</a>
                    <button id="removeComponent" class="buttonCustom buttonCustomVisible">
                    <i class="fa-solid fa-trash deleteIcon"></i>
                    </button>
					<hr>
				</div>

                <div class="column-content">
                    <ul class="column-list" style="grid-template-columns:repeat(${
                      this.gridItems
                    },1fr)">
                     ${this.renderItems()}
                    </ul>
                </div>
                
                <div>
                    <button id="addButton" style="display: inline"  class="buttonCustom"> <i class="fa-solid fa-plus"></i> Add link</button>
                    
                </div>
        `;
    }
}

customElements.define('custom-column', CustomColumn);
