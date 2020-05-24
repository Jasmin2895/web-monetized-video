import '../main';

const webMonetizationComponent = document.createElement('web-monetized-video');

webMonetizationComponent.setAttribute("url", "https://www.html5rocks.com/en/tutorials/video/basics/Chrome_ImF.webm" )
webMonetizationComponent.setAttribute("monetization-link", "$wallet.example.com/alice" )
document.body.appendChild(webMonetizationComponent);
