const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
    display: block;
    font-family: sans-serif;
    text-align: center;
    }
</style>
<video id="video" controls="controls">
    <source/>
</video>
`

class WebMonetizedVideo extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ 'mode': 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.$video = this.shadowRoot.getElementById("video");
        this.$source = this.$video.childNodes[1];
    }

    connectedCallback() {
        this.width = this.getAttribute("width");
        this.height = this.getAttribute('height');
        this.url = this.getAttribute('url');
        this.getPaymentDetails = this.getAttribute("monetization-link");
        this.setProperties();
    }

    disconnectedCallback() {
        this.removeVideoEventListeners();
        this.removeWebMonetizationEventListeners();
    }

    setProperties() {
        this.$video.setAttribute("width", this.width);
        this.$video.setAttribute("height", this.height);
        this.$source.setAttribute("src", this.url);
        this.addVideoEventListeners();
        this.addWebMonetizationEventListeners();
    }

    isWebMonetized() {
        return !!document.monetization;
    }

    onPlay() {
        this.enableWebMonetization();
    }

    onPause() {
        this.disableWebMonetization();
    }

    onEnded() {
        this.disableWebMonetization();
        this.removeVideoEventListeners();
    }

    onPlayError(event) {
        console.log("onPlayerError", event.data, event);
    }
    
    onload() {
        this.dispatchEvent(new Event("volumeChange"));

        this.timeupdateInterval = setInterval(() => {
            this.dispatchEvent(new Event('timeupdate'));
        }, 25);
    }

    removeVideoEventListeners() {
        this.$video.removeEventListener("play", this.onPlay);
        this.$video.removeEventListener("pause", this.onPause);
        this.$video.removeEventListener("ended", this.onEnded);
        this.$video.removeEventListener("load", this.onload);
        this.$video.removeEventListener("onError", this.onPlayError)
    }

    addVideoEventListeners() {
        this.$video.addEventListener("play", this.onPlay);
        this.$video.addEventListener("pause", this.onPause);
        this.$video.addEventListener("ended", this.onEnded);
        this.$video.addEventListener("load", this.onload);
        this.$video.addEventListener("onError", this.onPlayError);
    }

    enableWebMonetization() {
        const monetizationTag = document.createElement('meta');
        monetizationTag.name = "monetization";
        monetizationTag.content = this.getPaymentDetails;
        document.head.appendChild(monetizationTag);
    }

    disableWebMonetization() {
        const removeMonetizationTag = document.querySelector('meta[name="monetization"]');
        removeMonetizationTag.remove();
    }

    onMonetizationStop() {
        this.dispatchEvent(new Event("monetizationstop"));
    }

    onMonetizationPending() {
        this.dispatchEvent(new Event("monetizationpending"));
    }

    onMonetizationStart() {
        this.dispatchEvent(new Event("monetizationstart"));
    }

    onMonetizationProgress() {
        this.dispatchEvent(new Event("monetizationprogress"));
    }

    addWebMonetizationEventListeners() {
        if (this.isWebMonetized()) {
            document.monetization.addEventListener('monetizationstop', this.onMonetizationStop);
            document.monetization.addEventListener('monetizationpending', this.onMonetizationPending);
            document.monetization.addEventListener('monetizationstart', this.onMonetizationStart);
            document.monetization.addEventListener('monetizationprogress', this.onMonetizationProgress);
        }
    }

    removeWebMonetizationEventListeners() {
        if (this.isWebMonetized) {
            document.monetization.removeEventListener('monetizationstop', this.onMonetizationStop);
            document.monetization.removeEventListener('monetizationpending', this.onMonetizationPending);
            document.monetization.removeEventListener('monetizationstart', this.onMonetizationStart);
            document.monetization.removeEventListener('monetizationprogress', this.onMonetizationProgress);
        }
    }
}

if (!window.customElements.get("web-monetized-video")) {
    window.customElements.define('web-monetized-video', WebMonetizedVideo);
}

export default WebMonetizedVideo;
