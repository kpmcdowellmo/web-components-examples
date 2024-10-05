// A class defining a custom my-button element.
class MyButton extends HTMLElement {
    #btnType = "primary"
    #btnText = ""
    #block = false
    #button = null

    static observedAttributes = ["btntext", "btntype", "block"]

    constructor() {
        super();
    }

    // Called when an attribute changes.
    attributeChangedCallback(attr, oldVal, newVal) {
        if (attr === "btntext" && oldVal !== newVal) {
            this.#btnText = newVal;
        }

        if (attr === "btntype" && oldVal === newVal) {
            this.#btnType = newVal;
        }

        if (attr === "block") {
            if (newVal === null) {
                this.#block = false
                this.#button && this.#button.classList.remove("my-button--block");
            } else {
                this.#block = true
                this.#button && this.#button.classList.add("my-button--block");
            }
        }
        this.render();
    }

    // When the component is attached to the DOM.
    connectedCallback() {
        this.attachShadow({ mode: "open" });
        this.#btnType = this.getAttribute("btntype") || this.#btnType; // Keep primary default
        this.#btnText = this.getAttribute("btntext");
        this.#block = this.hasAttribute("block");
        this.render();
    }

    // Getters and setters.
    // Allows getting/setting properties on the element using element.{property}
    // Similar to how you might grab the value off an input using input.value.
    set btntype(value) {
        this.#btnType = value;
        this.render();
    }

    get btntype() {
        return this.#btnType;
    }

    set btntext(value) {
        this.#btnText = value;
        this.render();
    }

    get btntext() {
        return this.#btnText;
    }

    // Method for generating a class name based on the btntype attribute.
    #getBtnTypeClass() {
        if (this.#btnType === "secondary") {
            return "my-button--secondary";
        }

        return "my-button--primary";
    }

    // Not a lifecycle hook!
    // Custom helper method for rendering the component.
    render() {
        if (this.shadowRoot) {
            const buttonClasses = 'my-button ' + this.#getBtnTypeClass() + (this.#block ? ' my-button--block' : '')
            this.shadowRoot.innerHTML = `
                <style>
                          :host {
                              --button-default-color: blue;
                              --button-secondary-color: gray;
                          }
                          .my-button {
                              border: 0;
                              border-radius: 1rem;
                              padding: 1rem;
                              min-width: 100px;
                              text-align: center;
                          }
                          .my-button--secondary {
                              background-color: var(--button-secondary-color);
                              color: white;
                          }
      
                          .my-button--primary {
                              background-color: var(--button-default-color);
                              color: white;
                          }
      
                          .my-button.my-button--block {
                              max-width: 100%;
                              width: 100%;
                              display: block;
                          }
                </style>
                <button part="button" class="${buttonClasses}">
                  <slot>${this.#btnText}</slot>
                </button>
              `;
            this.#button = this.shadowRoot.querySelector("button");
        }
    }
}

customElements.define("my-button", MyButton); // Register the element with the registry.

