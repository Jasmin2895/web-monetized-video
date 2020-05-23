const getStyle = (width = '300', heigth = '150') => {
    return `
    .video-component {
        width: ${width}px;
        height: ${height}px;
    }
    `
  }
//accept both iFrame and Video element (Iframe for 3rd party and video on any website)
class WebMonetizedVideo extends HTMLElement {
    constructor()  {
        super()
        // runs whenever an element is created, but before the element is attached to the document.
        // it will be used to create the initial state, event listeners and creating shaow DOM.
        this.hasWebMonetizationEnabled= false;
        this.onceWatchedFully = false;
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
        if(!this.hasWebMonetizationEnabled && !this.onceWatchedFully) {
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
        this.isWebMonetized(); // to check if the page is web monetized or not.
        this.render();                                                                           
    }

    render() {
        const video = document.createElement("video")
        video.setAttribute("id", "video");
        video.classList.add("video-component")
        this.shadowRoot.appendChild(video);
        const source = document.createElement("source");
        source.setAttribute("src", this.url)
        video.appendChild(source);
        this.addVideoEventListeners(video);
        this.addStyle();
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

        video.addEventListener("onended", () => {
            this.disableWebMonatization();
            this.onceWatchedFully = true; 
        })
    }

    webMonetizationEventListeners() {
        if(this.hasWebMonetizationEnabled){
            document.monetization.addEventListener("monetizationstop", this.startEventHandler());
            document.monetization.addEventListener("monetizationstart", this.startEventHandler());
            document.monetization.addEventListener("monetizationpending", this.startEventHandler());
            document.monetization.addEventListener("monetizationprogress", this.calculateCharge());
        }
    }

    calculateCharge(event) {
        let totalAmount = 0, scale;
        if(totalAmount === 0) {
            scale = ev.detail.assetScale;
        }
        total += Number(ev.detail.amount)
        const formatted = (total * Math.pow(10, -scale)).toFixed(scale)
        console.log("Your total amount is ", formatted);
        console.log(event); 
        
    }

    startEventHandler(event) {
        console.log("event", event);
    }
}


try {
    customElements.define('web-monetized-video', WebMonetizedVideo)
} catch(err) {
    const h3 = document.createElement('h3');
    h3.innerHTML = "This site uses webcomponents which don't work in all browsers! Try this site in a browser that supports them!";
    document.body.appendChild(h3);
}