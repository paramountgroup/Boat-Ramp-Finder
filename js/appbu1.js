

var map;
var autocomplete;

var places, infoWindow;
var markers = [];
var countryRestrict = {'country': 'us'};
var MARKER_PATH = 'https://maps.gstatic.com/intl/en_us/mapfiles/marker_green';
var hostnameRegexp = new RegExp('^https?://.+?/');
var points;

var countries = {
  'au': {
    center: {lat: -25.3, lng: 133.8},
    zoom: 4
  },
  'br': {
    center: {lat: -14.2, lng: -51.9},
    zoom: 3
  },
  'ca': {
    center: {lat: 62, lng: -110.0},
    zoom: 3
  },
  'fr': {
    center: {lat: 46.2, lng: 2.2},
    zoom: 5
  },
  'de': {
    center: {lat: 51.2, lng: 10.4},
    zoom: 5
  },
  'mx': {
    center: {lat: 23.6, lng: -102.5},
    zoom: 4
  },
  'nz': {
    center: {lat: -40.9, lng: 174.9},
    zoom: 5
  },
  'it': {
    center: {lat: 41.9, lng: 12.6},
    zoom: 5
  },
  'za': {
    center: {lat: -30.6, lng: 22.9},
    zoom: 5
  },
  'es': {
    center: {lat: 40.5, lng: -3.7},
    zoom: 5
  },
  'pt': {
    center: {lat: 39.4, lng: -8.2},
    zoom: 6
  },
  'us': {
    center: {lat: 37.1, lng: -95.7},
    zoom: 3
  },
  'uk': {
    center: {lat: 54.8, lng: -4.6},
    zoom: 5
  }
};

//Error handling if Google Maps fails to load within 8 seconds error message displayed. 
 
  var mapRequestTimeout = setTimeout(function() {
    $('#map').html(' Oh My, Trouble loading Google Maps! Please refresh your browser and try again.');
  }, 8000);


(function initMap() {
 'use strict'; 
  var myLatLng = {lat: 28.182882, lng: -80.592502};

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
    
  
  // Create the autocomplete object and associate it with the UI input control.
  // Restrict the search to the default country, and to place type "cities".
  
  autocomplete = new google.maps.places.Autocomplete((document.getElementById('autocomplete')), {
					types: ['(cities)'],
					componentRestrictions: countryRestrict
				  });
	  
	  console.log('what is the autocomplete ' + autocomplete);
	  
  places = new google.maps.places.PlacesService(map); // entered city lat/long

  autocomplete.addListener('place_changed', onPlaceChanged);

  // Add a DOM event listener to react when the user selects a country.
 
  document.getElementById('country').addEventListener(
      'change', setAutocompleteCountry); 
}());


 



// *****************  END INIT MAP   ****************** //


function point(name, lat, long) { //places markers on the map
  
  this.name = ko.observable(name);
  this.lat = ko.observable(lat);
  this.long = ko.observable(long);
  
  var marker = new google.maps.Marker({
	position: new google.maps.LatLng(lat,long),
	title: name,
	map: map,
	animation: google.maps.Animation.DROP
	
  }); 
  
  google.maps.event.addListener(marker, 'click', function() {
	  var pos = marker.getPosition();
	  this.lat(pos.lat());
	  this.long(pos.lng());
  }.bind(this)); 
}

// ***************  VIEW MODEL  ****************  //

var viewModel = {
  points: ko.observableArray([
    new point('A Boat Ramp 1', 28.18, -80.59),
    new point('B Boat Ramp 2', 28.19, -80.595),
    new point('C Boat Ramp 3', 28.20, -80.60)
  ]),
  
  filter: ko.observable(""),  
};



//*********     Filter the Results    *******//


//ko.utils.arrayFilter - filter the items using the filter text    //  (Found on JSFiddle written by rniemeyer http://jsfiddle.net/rniemeyer/vdcUA/)

viewModel.points = ko.dependentObservable(function() {
    var startsWith = this.filter().toLowerCase();
	
    if (!startsWith) {
        return this.points();
    } else {
        return ko.utils.arrayFilter(self.points(), function(item) {
            return item.name().toLowerCase().indexOf(startsWith) === 0; // return true if name starts with same letter entered
        });
    }
	console.log('viewModel: ' + viewModel);
}, viewModel);



// ********** End the Filter  **********//

function onPlaceChanged() {
  'use strict';
  var place = autocomplete.getPlace();
  console.log('what is this place you speak of ' + place);
  if (place.geometry) {
    map.panTo(place.geometry.location);
	console.log('is this the lat long or city name? ' + place.geometry.location);
    map.setZoom(12);
    search();
//	loadFourSquareData(place.geometry.location, map);  // Load markers using the Foursquare API
  } else {
    document.getElementById('autocomplete').placeholder = 'Enter a city';
  }

 var layer = new google.maps.FusionTablesLayer({
	  query: {
		select: '\'Geocodable address\'',
		from: '1LvP5-t6UEtcj_KCBlIbi1Hvs2H8MY-PQfikWfuFC' // key for fusion table
	  }
  });
  
  layer.setMap(map); // load the fusion table pins
  
}

// *************** END VIEW MODEL  *********************//


	
function search() {
  var search = {
    bounds: map.getBounds(),
    keyword: 'boat ramp',
	radius: 3000
  };
}

// Set the country restriction based on user input.
// Also center and zoom the map on the given country.

function setAutocompleteCountry() {
  'use strict';
  var country = document.getElementById('country').value;
  if (country == 'all') {
    autocomplete.setComponentRestrictions([]);
    map.setCenter({lat: 15, lng: 0});
    map.setZoom(2);
  } else {
    autocomplete.setComponentRestrictions({'country': country});
    map.setCenter(countries[country].center);
    map.setZoom(countries[country].zoom);
  }
  clearResults();
  clearMarkers();
}


ko.applyBindings(viewModel);
