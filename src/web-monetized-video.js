const getStyle = (width = '300', heigth = '150') => {
    return `
    .video-component {
        width: ${width}px;
        heigth: ${heigth}px;
    }
    `
  }
class WebMonetizedVideo extends HTMLElement {
    constructor()  {
        super();
        this.hasWebMonetizationEnabled= false;
        this.onceWatchedFully = false;
    }

    isWebMonetized() {
        if(!document.monetized) {
            this.hasWebMonetizationEnabled = false;
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
            this.hasWebMonetizationEnabled = true;
        }
    }

    disableWebMonatization() {
        this.hasWebMonetizationEnabled = false;
        const removeMonetizationTag = document.querySelector('meta[name="monetization"]')
        removeMonetizationTag.remove()
    }

    connectedCallback() {
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
        video.addEventListener("play", ()=> {
            this.enableWebMonetization();
            this.webMonetizationEventListeners();
        })
        video.addEventListener("pause", ()=> {
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
            document.monetization.addEventListener("monetizationstop", this.checkMonetizationState());
            document.monetization.addEventListener("monetizationstart", this.checkMonetizationState());
            document.monetization.addEventListener("monetizationpending", this.checkMonetizationState());
            document.monetization.addEventListener("monetizationprogress", this.checkMonetizationState());
        }
    }

    checkMonetizationState(event) {
        if(document.monetization.state === "started") {
            this.calculateCharge(event);
        }
    }
    calculateCharge(event) {
        let totalAmount = 0, scale;
        if(totalAmount === 0) {
            scale = event.detail.assetScale;
        }
        total += Number(event.detail.amount)
        const formatted = (total * Math.pow(10, -scale)).toFixed(scale)
    }
}

try {
    customElements.define('web-monetized-video', WebMonetizedVideo)
} catch(err) {
    const h3 = document.createElement('h3');
    h3.innerHTML = "This site uses webcomponents which don't work in all browsers! Try this site in a browser that supports them!";
    document.body.appendChild(h3);
}

export default WebMonetizedVideo;