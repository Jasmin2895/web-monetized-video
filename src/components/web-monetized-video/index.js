import { WebMonetizedVideo } from './web-monetized-video';
if (!window.customElements.get('web-monetized-video')) {
    window.customElements.define('web-monetized-video', WebMonetizedVideo);
}