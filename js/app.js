

var map;
var autocomplete;
//Error handling if Google Maps fails to load within 8 seconds error message displayed. reference student code sheryllun-neighborhood map
 
  var mapRequestTimeout = setTimeout(function() {
    $('#map').html(' Oh My, Trouble loading Google Maps! Please refresh your browser and try again.');
  }, 8000);


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
  
   clearTimeout(mapRequestTimeout); // map loaded ok and no need for error message
   
  
   /*
  // Create the autocomplete object and associate it with the UI input control.
  // Restrict the search to the default country, and to place type "cities".
  
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement}   (document.getElementById('autocomplete')), {
        types: ['(cities)'],
        componentRestrictions: countryRestrict
      });
  places = new google.maps.places.PlacesService(map); // entered city lat/long

  autocomplete.addListener('place_changed', onPlaceChanged);

  // Add a DOM event listener to react when the user selects a country.
  document.getElementById('country').addEventListener(
      'change', setAutocompleteCountry);
  */
  
}());
 



// *****************  END INIT MAP   ****************** //




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
    new point(' A Boat Ramp 1', 28.18, -80.59),
    new point(' B Boat Ramp 2', 28.19, -80.595),
    new point(' C Boat Ramp 3', 28.20, -80.60)
  ]),
  filter: ko.observable("")

};



//*****     Filter the Results    *****


//ko.utils.arrayFilter - filter the items using the filter text    //  (Found on JSFiddle written by rniemeyer http://jsfiddle.net/rniemeyer/vdcUA/)

viewModel.filteredItems = ko.dependentObservable(function() {
    var filter = this.filter().toLowerCase();
    if (!filter) {
        return this.points();
    } else {
        return ko.utils.arrayFilter(this.items(), function(item) {
            return ko.utils.stringStartsWith(item.name().toLowerCase(), filter);
        });
    }
}, viewModel);



ko.applyBindings(viewModel);
