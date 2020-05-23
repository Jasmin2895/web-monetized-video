const getStyle = (width = '300', heigth = '150') => {
    return `
    .err-msg {
        display: flex;
        justify-content: center;
    }
    .video-component {
        width: ${width}px;
        heigth: ${heigth}px;
    }
    `
  }
//accept both iFrame and Video element (Iframe for 3rd party and video on any website)
class WebMonetizedVideo extends HTMLElement {
    constructor()  {
        super();
        console.log("constructor called!")
        this.hasWebMonetizationEnabled= false;
        this.onceWatchedFully = false;
    }

    isWebMonetized() {
        if(!document.monetized) {
            const h4 = document.createElement("h4");
            h4.classList.add("err-msg")
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
        const removeMonetizationTag = document.querySelector('meta[name="monetization"]')
        removeMonetizationTag.remove()
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
        console.log("render called!")
        const video = document.createElement("video")
        video.setAttribute("id", "video");
        video.classList.add("video-component")
        video.setAttribute("controls", "controls")
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
        console.log("video listeners added!")
        video.addEventListener("play", ()=> {
            console.log("enable web monetization called")
            this.enableWebMonetization();
            this.webMonetizationEventListeners();
        })
        video.addEventListener("pause", ()=> {
            console.log("disable web monetization called")
            this.disableWebMonatization();
        })
        video.addEventListener("ratechange", ()=> {
            console.log("You have increased or decreased the video speed you will be charged on the basis of how video viewed!")
        })

        video.addEventListener("ended", () => {
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
        console.log("Your total amount is ", formatted); // can display this amount in h4 tag
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