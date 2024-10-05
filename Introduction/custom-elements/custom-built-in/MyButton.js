// A class defining a custom my-button element.
// Here we explicitly extend HTMLButtonElement
class MyButton extends HTMLButtonElement {
    #btnType = "primary"
    #btnText = ""
    #block = false

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
                this.classList.remove("my-button--block");
            } else {
                this.#block = true
                this.classList.add("my-button--block");
            }
        }
        this.render();
    }

    // When the component is attached to the DOM.
    connectedCallback() {
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
        const buttonClasses = ['my-button', this.#getBtnTypeClass(), (this.#block ? 'my-button--block' : '')].filter(clazz => !!clazz);
        this.textContent = this.#btnText;

        this.classList.add(...buttonClasses);
    }
}

// Defined slightly differently
// Notice we explicitly extend button here.
customElements.define("my-button", MyButton, { extends: "button" }); // Register the element with the registry.

