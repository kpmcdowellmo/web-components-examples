In modern web development, frameworks are all the rage. Almost all modern frameworks have the concept of components.  The idea behind components is breaking your frontend logic down into smaller reusable chunks that you can share across pages or projects.  Generally these components are not reusable across other frameworks, and will require a build process for compiling them down to JavaScript that can run in the browser.  

What if I told you there was a way to build components using vanilla JavaScript and widely available browser APIs that you could share across frameworks?  This is now a reality with Web Components. Here we will take a quick look at the different types of Web Components, and some of the power we can wield with them.

## The Basics of Web Components

Web Components are defined using the [Custom Element Registry](https://developer.mozilla.org/en-US/docs/Web/API/Window/customElements). This is an API that most modern browsers supply. To create a Web Component, you simply define it in code and then register it in the Custom Element Registry. Once it's registered and defined using the right naming conventions, the component is available for use within the page.

```JavaScript
customElements.define("my-component", MyComponentClass);
```

### Types of Web Components

Web Components can be broken down into [two different categories](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements). These are **Autonomous Web Components** and **Custom Built-In Elements**.  

**Autonomous Web Components** are an extension of the generic [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) class. These components are generally more flexible, as you are essentially building your own HTML element with the power to customize all behavior from the ground up. This includes the root element used for rendering the component.  Once defined, you use Autonomous Web Components just like any other HTML element.

```HTML
<my-button class="example-component">Button text</my-button>
```

**Custom Built-In Elements** extend specific HTML elements.  For example, you may extend the [HTMLButtonElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement) class or the [HTMLAnchorElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement).  These are meant to augment the functionality of existing HTML elements. To use a Custom Built-In element, you use the "is" attribute on the HTML element you are augmenting to tell it that it is an instance of the Web Component.

```HTML
<button is="my-button" class="example-component">Button text</button>
```

### Naming Web Components

When defining a Web Component, there are [certain conventions](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name) that must be followed.  

Generally you will name your components similar to HTML elements with your own prefix attached to keep things simple (i.e. \<my-button>).  The basic rules require that the element name start with a lowercase letter, and it must include a hyphen.  These guidelines will get you by for most cases, but I would recommend looking at the [HTML spec](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name) if you're curious about all rules.

```HTML
<!--Valid-->
<my-button/>
<your-button/>

<!--Invalid-->
<My-button/>
<1234-button/>
<Mybutton/>
```

### Lifecycle Hooks

Web components have specific [lifecycle hooks](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#implementing_a_custom_element) that are used for reacting to different phases that the component goes through.  The hooks are the following:

- connectedCallback -> Runs when the component is attached to the DOM.
- disconnectedCallback -> Runs when the component is detached from the DOM.
- adoptedCallback -> Runs each time the component is attached to a new DOM.
- attributeChangedCallback -> Runs when an attribute from the list of "observedAttributes" updates.

```JavaScript
class MyComponent extends HTMLElement {
    static observedAttributes = ["btntype"]
    connectedCallback() {
        // Handle when the component is attached to the DOM
    }
    disconnectedCallback() {
        // Handle when the component is removed from the DOM
    }
    adoptedCallback() {
        // Handle when the component is attached to a new DOM
    }
    attributeChangedCallback(name, oldValue, newValue) {
        // Trigged when the "btntype" attribute is changed since it is in the list of observedAttributes.
        // "name" will be the name of the attribute that changed.
        // "oldValue" is the value before the change.
        // "newValue" is the new value after the change.
    }
}
```

These lifecycle hooks are used for doing any initialization or cleanup work required when creating/destroying component instances. The [attributeChangedCallback](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#responding_to_attribute_changes) is especially useful, as it allows to react to attribute value updates.  Web Components have a special static attribute called "observedAttributes", which is meant to be an array of attribute names (strings) that will trigger the attributeChangedCallback.

### Accessibility

Accessibility is an important consideration in any web development done today. When it comes to web components, you use ARIA attributes just like you would in regular HTML or in a framework, but generally speaking you will inherit the built-in roles and accessibility functionality of the HTML elements you are using.

All the same guidelines apply here that would anywhere else. For example, make sure you are using semantic HTML when building your components, add any necessary keyboard handling that might be required, and make sure stuff like focus and color contrast are managed properly.

### The Shadow DOM

The [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM) is probably the most confusing and controversial part of Web Components.  The Shadow DOM is essentially a separately scoped piece of the DOM that lives within a Web Component

The Shadow DOM is mainly a concern for Autonomous Web Components since Custom Built-In elements are just adding to existing HTML elements.  For Autonomous Web Components, the custom tag representing the element (i.e. \<my-button></my-button>) is considered the "host" element. Within the host element is the "shadow root". Within the shadow root is where the markup for the component is rendered.

Here is an example where you will see the the "my-button" element as the host, with the Shadow DOM inside.

![Shadow DOM vs Host](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/x7x0c8cvpx7uyvemah6l.png)

When building web components, there are two modes you can set the Shadow DOM to. These modes are "open" and "closed". Open Shadow DOMs can be accessed with JavaScript outside the Shadow Root in the Light DOM, while closed Shadow DOMs cannot.

```JavaScript
class MyComponent extends HTMLElement {
    constructor() {
        const shadow = this.attachShadow({ mode: "open" }); // open or closed.
    }
}
```

Any Styles you define within the Shadow DOM are scoped within the Shadow DOM an do not pollute the rest of the document.  Any styles defined in the "Light DOM" (the rest of the document) do not penetrate the Shadow DOM (CSS variables are an exception, but we won't get into that here).  Modern browsers do provide ways to target the Shadow DOM directly from the Light DOM using CSS using parts.  You can add parts to the Shadow DOM of your component by adding [part](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/part) attributes to your markup.  Those parts can then be targeted in CSS using the [::part](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) pseudo selector.  This is extremely handy, but it is pretty limited by nature.  You cannot chain child selectors off the ::part selector. You can only target the specific element that has a "part" attribute within the Shadow DOM.

Accessibility is also an important consideration when working with the Shadow DOM. If you've ever worked with ARIA attributes, then you are familiar with "aria-describedby" and "aria-labelledby", which are generally given an ID that references another element containing a label or description of the content for screen readers.  The Shadow DOM keeps IDs scoped separately similar to styles, so you cannot reference an ID that lives within the Shadow DOM from the Light DOM and vise versa.  This can present a challenge when trying to provide detailed descriptions that you need to provide dynamically, but workarounds exist that we won't dive into in this introduction.

### Templates and Slots
Templates and slots are tools that can be used in combination with the Shadow DOM to enhance web components. Templates are used for creating reusable snippets within Web Components, while slots are used for exposing "holes" that content from the Light DOM can be passed into.  

Templates are handy if there is a snippet of HTML that you need to render over and over again within a Web Component. They can also be used outside Web Components, but have more limited use cases. They are implemented using the "template" tag.

Slots are used for passing content from the Light DOM into a Web Component, and are implemented using the "slot" tag. This is handy if you have a generic component that may require dynamic content to get passed in. A good example may be a generic card component, where you could have a slot exposed to pass markup into the body of the card.  Slots have a "name" attribute that you can provide for uniquely identifying the slot. This is handy if you need to put multiple slots into a web component. When passing content in, you can simply pass an attribute with a value of slot="your-slot-name" and the content will get passed to the slot with the matching name.

Slots and the Shadow DOM have a unique interaction that is worth noting.  Slots can have default content that renders in the event that nothing is passed in. Content passed into slots lives within the Light DOM and is "shallow copied" into the Shadow DOM.  You can see this visually in the browser inspector. The slot content will render within the web component, but in the DOM, the content technically lives outside the web component and provides a link to the slot.

![Slots example](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4gxtdqims1d2i1ww8qgb.png)

This being said, that means all slot content is styled and referenced just like any other content within the Light DOM. Styles within the Light DOM will impact slot content, while Shadow DOM styles will not.  There are APIs available for interacting with slot content from within the web component.

### Web Component Support

Web Components are fairly well supported in modern browsers. The main exception is Safari, which does not support Custom Built-In Elements.  If you need to support older browsers like Internet Explorer 11, you are going to have to polyfill some things.

## Basic Examples

Now that we've gotten a brief introduction of all the basic concepts, let's take a look at some examples.

### Autonomous Custom Elements

Here is an example autonomous custom element called "my-button":

```JavaScript
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
```

Here we can see that "my-button" is essentially a wrapper around the HTML button element. We've added a few quality of life attributes for customizing the button text, and customizing the look of the button. Specifically, the "btntype" attribute controls what classes are applied to change the coloring of the button, and the "block" boolean attribute is controlling the CSS display value of the button.

We've done some work to add "props" associated with the attributes. This way we can change the value of the attributes either through changing the actual attribute itself (element.setAttribute()), or by changing the prop on the element directly (element.btntype = "somethingelse").

Finally, we've added our own custom method called "render" for actually rendering the content. Without this, our web component would simply display nothing!  We have to put logic in place for actually displaying the content.  You'll notice this method is called in the connectedCallback so that we render when the element is attached to the DOM.  This is honestly a pretty hacky way of doing rendering, but for an introductory example this will work fine.

Now, let's see how we can put these elements into practice:

{% codepen https://codepen.io/kpmcdowellmo/pen/zxOdWvZ %}

Here you can see us using my-button just like any other HTML element. We are simply passing attributes with values assigned to them, and we can even pass boolean attributes just like we would in regular HTML if we handle the values correctly!

We also have an example where content is passed via a slot!  Also, take note of how the ::part selector is used to style one of the buttons.

Finally, notice that we can attach event listeners to these components just like any other HTML element.

### Custom Built-In Elements

Here is a different version of my-button done as a Custom Built-In element:

```JavaScript
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
```

The first thing to notice is that the code is mostly the same. The biggest differences are that we directly extend the HTMLButtonElement, and then we also declare that we extend the button when we define the custom element.

We also spend a lot less time writing out code for rendering the element. Since we are extending the HTMLButtonElement, the component is just an HTML button with extra power.  We will tell an HTML button that it is a "my-button" by using the HTML "is" attribute.

Here is the example live:

{% codepen https://codepen.io/kpmcdowellmo/pen/dPbzmYm %}

Again you'll notice that we are using the "is" attribute to augment the existing HTML button element.  You'll also notice that just like with the Autonomous custom elements, we can attach event listeners and work with the button just like we would for any other HTML element, which makes more sense here anyway because it literally is just an extended HTML button.

## Wrapping Up

Web components are a vanilla way to solve the problem of creating shareable components that can be reused across different pages and projects. They work more like normal HTML elements, which can cause some confusion, but in the end they can be extremely useful and help solve a lot of the same problems that modern frameworks are targeting.

Here we've taken a very introductory look into web components, the different concepts around them, and some quick examples showcasing their basic function.  From here we can start taking deeper dives into how we can make building and using them easier, and look into how we can deal with some of their pain points.

If you're interested, feel free to view the examples in GitHub, or you can play with them in Code Pen.

- [Autonomous Custom Element Example](https://codepen.io/kpmcdowellmo/pen/zxOdWvZ)
- [Custom Built-In Element Example](https://codepen.io/kpmcdowellmo/pen/dPbzmYm)
- [Bonus Basic Templates Example!](https://codepen.io/kpmcdowellmo/pen/WbeEzre)

In the next article, we will take a look at how we can expand on using templates and slots, and how we can make rendering easier.  Stay tuned!