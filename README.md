# web-monetized-video
A web component which has play and pay policy and charges you for the amount of video watched. :smile: :dancer:

## Component:
* [`<web-monetized-video>`] - a component that allow the user to pay for the section of video watched.

## Installation
`<web-monetized-video>` is a packaged javascript module.
> Modules are loaded asynchronulsy by browser, so for registering our component quickly we can load them in the head :thumbsup:

```html
<head>
  <script type="module" src="https://unpkg.com/web-monetized-video"></script>
</head>
```

## How to use
```html
<html>
<head>
  <script type="module" src="https://unpkg.com/web-monetized-video"></script>
</head>
<body>

  <web-monetized-video width="300" height="200" url="video_url" monetization-link="payment_pointer"></web-monetized-video>

</body>
</html>
```

### Parameters
* `width` - Width of the element
* `height` - Height of the element
* `url`- Link of the video. (Example- `https://www.html5rocks.com/en/tutorials/video/basics/Chrome_ImF.webm`)
* `monetization-link`- link to payment wallet of the user (Example- `$wallet.example.com/alice`)

### Events Listeners
| Events        | Are           |
| ------------- |:-------------:| 
| `monetizationstart`      | Determine when Web Monetization has started actively paying by adding an event listener for monetizationstart  |
| `monetizationprogress`      | Determine the current status of the payment stream by adding an event listener for monetizationprogress |
| `monetizationpending` |Determine when Web Monetization is enabled by adding an event listener for monetizationpending |
| `monetizationstop` | Determine when Web Monetization has stopped by adding an event listener for monetizationstop |


### Adding to your app via `npm`

```bash
npm install web-monetized-video --save
```

Include in your app javascript (e.g. src/App.js)
```js
import 'web-monetized-video';
```
This will register the custom elements with the browser so they can be used as HTML.

## LICENSE

MIT (c) 2020 Jasmin Virdi
