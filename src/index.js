class WebMonetizedVideo extends HTMLElement {
    constructor()  {
        super()
        console.log("constructor called")
        // runs whenever an element is created, but before the element is attached to the document.
        // it will be used to create the initial state, event listeners and creating shaow DOM.
    }

    connectedCallback() {
        //called when the element is inserted in the DOM.
        console.log('connected!');
    }

    disconnectedCallback() {
        //called when element is removed from DOM.
        console.log('disconnected!');
    }

    attributeChangedCallback(name, oldVal, newVal) {
        // called when elment observed attribute change.
        console.log(`Attribute: ${name} changed!`);
    }

    adoptedCallback() {
        //custom element is moved to a new document. Only run into this use case when you have <iframe>
        console.log('adopted!');
    }
}


window.customElements.define('web-monetized-video', WebMonetizedVideo)