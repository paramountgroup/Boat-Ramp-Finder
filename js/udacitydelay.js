// JavaScript Document - This delay was only added to meet the Udacity requirement that Google Maps be loaded async. 
// addAppJS loads app.js after the map is loaded. I can set the delay for as long as necessary so that google maps has
// time to load - or more logically load google maps syncronously. 

    
function addAppJS() {
var js = document.createElement('script');
js.setAttribute('type', 'text/javascript');
js.src = 'js/app.js';
document.body.appendChild(js);
}
console.log('before setTimeout');
setTimeout(addAppJS(), 8000);
console.log('after setTimeout');
