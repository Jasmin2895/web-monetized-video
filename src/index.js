const template = document.createElement('template');

//support for both the video and iframe should be there.
class WebMonetizedVideo extends HTMLElement {
    constructor()  {
        super()
        this.hasWebMonetizationEnabled= false;
        // runs whenever an element is created, but before the element is attached to the document.
        // it will be used to create the initial state, event listeners and creating shaow DOM.
        let template = document.getElementById("web-monetized-video");


    }

    connectedCallback() {
        //called when the element is inserted in the DOM.
        console.log('connected!');
        this.createShadowRoot();
        this.source = this.getAttribute('source');
        this.width = this.getAttribute('width');
        this.heigth = this.getAttribute('heigth');
        this.render();                                                                           
    }

    render() {
        const video = document.createElement("video") // add video element define heigth and width and controls in html file
        video.setAttribute("id", "video");
        video.classList.add("video") // check if necessary
        this.shadowRoot.appendChild(video);
        const source = document.createElement("source");
        video.appendChild(source);
        this.addStyle() //check if required
    }

    addVideoEventListeners(video) {
        video.addEventListener("play", ()=> {
            video.classList.add("play");
        })
        video.addEventListener("pause", ()=> {
            video.classList.add("pause")
        })
        // listen for current frame
        video.addEventListener("listen", ()=> {
            video.classList.remove("listen")
        })
    }

    createSource()

    // will update this later if required!!
    // addSourceTag(source) {
    //     [...this.text].forEach(letter=> {
    //         let source = this.createSource(letter)

    //     })
    // }

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