const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
    display: block;
    font-family: sans-serif;
    text-align: center;
    }
</style>
<video id="video" controls="controls"  >
    <source/>
</video>
`

class WebMonetizedVideo extends HTMLElement{
    constructor() {
        super();
        this.attachShadow({ 'mode': 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.$video = this.shadowRoot.getElementById("video");
        this.$source = this.$video.childNodes[1]
        this.setInitialFlags();
    }

    setInitialFlags() {
        this.hasWebMonetizationEnabled= false;
        this.onceWatchedFully = false;
    }

    connectedCallback() {
        this.width = this.getAttribute("width");
        this.heigth = this.getAttribute('heigth');
        this.url = this.getAttribute('url');
        this.getPaymentDetails = this.getAttribute("monetization-link")
        this.setProperties();
        this.isWebMonetized();
    }

    setProperties() {
        this.$video.setAttribute("width", this.width);
        this.$video.setAttribute("heigth", this.heigth);
        this.$source.setAttribute("src", this.url);
        this.addVideoEventListeners();
    }
    
    isWebMonetized() {
        if(!document.monetized) {
            this.hasWebMonetizationEnabled = false;
        } else {
            this.hasWebMonetizationEnabled = true;
        }
    }

    addVideoEventListeners() {
        this.$video.addEventListener("play", ()=> {
            this.enableWebMonetization();
        })

        this.$video.addEventListener("pause", ()=> {
            this.disableWebMonatization();
        })

        this.$video.addEventListener("ended", () => {
            this.disableWebMonatization();
            this.onceWatchedFully = true; 
        })
    }

    enableWebMonetization() {
        if(!this.hasWebMonetizationEnabled && !this.onceWatchedFully) {
            const monetizationTag = document.createElement('meta');
            monetizationTag.name = "monetization";
            monetizationTag.content = this.getPaymentDetails;
            document.head.appendChild(monetizationTag);
            this.hasWebMonetizationEnabled = true;
            this.webMonetizationEventListeners();
        }
    }

    disableWebMonatization() {
        this.hasWebMonetizationEnabled = false;
        const removeMonetizationTag = document.querySelector('meta[name="monetization"]')
        removeMonetizationTag.remove()
    }

    webMonetizationEventListeners() {
        if(this.hasWebMonetizationEnabled){
            if(document.monetization && document.monetization.state === "started"){
                this.dispatchEvent(new Event("monetizationstart"))
                this.dispatchEvent(new Event("monetizationprogress"))
            }
            else if(document.monetization && document.monetization.state === 'pending') {
                this.dispatchEvent(new Event("monetizationpending"))
            }
            else if(document.monetization && document.monetization.state === 'stopped') {
                this.dispatchEvent(new Event("monetizationstop"))
            }
        }
    }
}

if(!window.customElements.get("web-monetized-video")){
    window.customElements.define('web-monetized-video', WebMonetizedVideo);
}

export default WebMonetizedVideo;