// JavaScript Document - This delay was only added to meet the Udacity requirement that Google Maps be loaded async. 
// addAppJS loads app.js after the map is loaded. I can set the delay for as long as necessary so that google maps has
// time to load - or more logically just load google maps syncronously as the app is useless without it. 

    
function addAppJS() {
var js = document.createElement('script');
js.setAttribute('type', 'text/javascript');
js.src = 'js/app.js';
document.body.appendChild(js);
}

setTimeout(addAppJS(), 6000);
