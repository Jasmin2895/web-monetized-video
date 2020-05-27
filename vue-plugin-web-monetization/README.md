# web-monetization-vue-plugin

We can use plugins in Vue to extend the Web Monetization functionality to our Vue App.

Here is a basic  example of implementing web monetization using plugins in Vue App.

## Steps

### Create a Web Monetization Plugin
```javascript
// file: web-monetization.js
export default {
  install(Vue) {
    Vue.proptype.$webMonetizaton = this;
    Vue.webMonetizaton = this;

    if (typeof window !== "undefined") {
      window.$webMonetizaton = this;
    }
  },
  enableWebMonetization() {
    if (!document.monetized) {
      const monetizationTag = document.createElement("meta");
      monetizationTag.name = "monetization";
      monetizationTag.content = "payment_pointer";
      document.head.appendChild(monetizationTag);
    }
  },

  disableWebMonetization() {
    const removeMonetizationTag = document.querySelector(
      'meta[name="monetization"]'
    );
    removeMonetizationTag.remove();
  },

  webMonetizationEvents() {
    document.monetization.addEventListener("monetizationstart", currentState);
  },

  currentState(event) {
    //console.log(event);
  }
};
```
### Register your plugin with Vue App.

```javascript
import Vue from "vue";
import { WebMonetizationPlugin } from "./web-monetization.js";

Vue.use(WebMonetizationPlugin);
```

### Use plugin in your app.

```javascript
//to enable web monetization
this.$webMonetizaton.enableWebMonetization();

// to disable web monetization
this.$webMonetizaton.disableWebMonetization();
```