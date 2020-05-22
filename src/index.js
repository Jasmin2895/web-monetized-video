const getStyle = (width = '300', heigth = '150') => {
    return `
    .video-component {
        width: ${width}px;
        height: ${height}px;
    }
    `
  }

class WebMonetizedVideo extends HTMLElement {
    constructor()  {
        super()
        // runs whenever an element is created, but before the element is attached to the document.
        // it will be used to create the initial state, event listeners and creating shaow DOM.
        this.hasWebMonetizationEnabled= false;
        this.isWebMonetized();
        // let template = document.getElementById("web-monetized-video"); // confirm template required or not.
    }

    isWebMonetized() {
        if(!document.monetized) {
            const h4 = document.createElement("h4");
            h4.innerHTML = "Your browser is not web moentized"
            document.body.appendChild(h4);
        } else {
            this.hasWebMonetizationEnabled = true;
        }
    }

    enableWebMonetization() {
        if(!this.hasWebMonetizationEnabled) {
            const monetizationTag = document.createElement('meta');
            monetizationTag.name = "monetization";
            monetizationTag.content = this.getPaymentDetails;
            document.head.appendChild(monetizationTag);
        }
    }

    disableWebMonatization() {
        this.hasWebMonetizationEnabled = false;
        document.querySelector('meta[name="monetization"]').remove();
    }

    connectedCallback() {
        //called when the element is inserted in the DOM.
        this.createShadowRoot();
        this.url = this.getAttribute('url');
        this.width = this.getAttribute('width');
        this.heigth = this.getAttribute('heigth');
        this.getPaymentDetails = this.getAttribute("monetization-link")
        this.render();                                                                           
    }

    render() {
        const video = document.createElement("video") // add video element define heigth and width and controls in html file
        video.setAttribute("id", "video");
        video.classList.add("video-component") // check if necessary
        this.shadowRoot.appendChild(video);
        const source = document.createElement("source");
        source.setAttribute("src", this.url)
        video.appendChild(source);
        this.addVideoEventListeners(video);
        this.addStyle() //check if required
    }

    addStyle() {
        const styleTag = document.createElement("style");
        styleTag.textContent = getStyle(this.width, this.heigth);
        this.shadowRoot.appendChild(styleTag);
    }

    addVideoEventListeners(video) {
        video.addEventListener("onplay", ()=> {
            this.enableWebMonetization();
            // add the function which will be called when video is played
        })
        video.addEventListener("onpause", ()=> {
            this.disableWebMonatization();
            // add the function which will be called when the video is paused 
        })
        // listen for current frame
        video.addEventListener("onratechange", ()=> {
            console.log("You have increased or decreased the video speed you will be charged on the basis of how video viewed!")
        })
    }
}


try {
    customElements.define('web-monetized-video', WebMonetizedVideo)
} catch(err) {
    const h3 = document.createElement('h3');
    h3.innerHTML = "This site uses webcomponents which don't work in all browsers! Try this site in a browser that supports them!";
    document.body.appendChild(h3);
}