

var map;

(function initMap() {
 'use strict'; 
  var myLatLng = {lat: 28.182882, lng: -80.592502};
   //var myLatLng = {lat: 55, lng: 11};

	map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: myLatLng
  });


// The following code makes the marker for the headquareters location bounce using a DROP
// animation. Clicking on the marker will toggle the animation between a BOUNCE
// animation and no animation.

  var image = 'img/logo-with-blue-outline-circle-transp-30x29.png';
  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
	icon: image,
    title: 'The Paramount Group world headquarters',
	animation: google.maps.Animation.BOUNCE,
  });


 marker.addListener('click', toggleBounce);

  function toggleBounce() {
	if (marker.getAnimation() !== null) {
	  marker.setAnimation(null);
	} else {
	  marker.setAnimation(google.maps.Animation.BOUNCE);
	}
  } 
  
}());
 







function point(name, lat, long) {
  this.name = name;
  this.lat = ko.observable(lat);
  this.long = ko.observable(long);

  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat, long),
    title: name,
    map: map,
	animation: google.maps.Animation.DROP
    
  });

  
}

/*
var map = new google.maps.Map(document.getElementById('map'), {
  zoom: 12,
  center: new google.maps.LatLng(28.182882, -80.592502),
  mapTypeId: google.maps.MapTypeId.ROADMAP
});

*/

var viewModel = {
  points: ko.observableArray([
    new point('Boat Ramp 1', 28.18, -80.59),
    new point('Boat Ramp 2', 28.19, -80.595),
    new point('Boat Ramp 3', 28.20, -80.60)
  ]),
  filter: ko.observable("")
};


/*
//*****     Filter the Results    *****


//ko.utils.arrayFilter - filter the items using the filter text    //  (Found on JSFiddle written by rniemeyer http://jsfiddle.net/rniemeyer/vdcUA/)

viewModel.filteredItems = ko.dependentObservable(function() {
    var filter = this.filter().toLowerCase();
    if (!filter) {
        return this.items();
    } else {
        return ko.utils.arrayFilter(this.items(), function(item) {
            return ko.utils.stringStartsWith(item.name().toLowerCase(), filter);
        });
    }
}, viewModel);

*/

ko.applyBindings(viewModel);
