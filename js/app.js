

var map;
var autocomplete;
var discover;
var places, infoWindow;
var markers = [];
var countryRestrict = {'country': 'us'};
var MARKER_PATH = 'https://maps.gstatic.com/intl/en_us/mapfiles/marker_green';
var hostnameRegexp = new RegExp('^https?://.+?/');
//var points;
var infowindow = new google.maps.InfoWindow();
var filter;
//var filteredPoints
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
 var myLatLng = {lat: 37.42, lng: -122.08}; // googleplex
//  var myLatLng = {lat: 28.182882, lng: -80.592502};

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
	  
	  
	  
  places = new google.maps.places.PlacesService(map); // entered city lat/long

  autocomplete.addListener('place_changed', onPlaceChanged);

  // Add a DOM event listener to react when the user selects a country.
 
  document.getElementById('country').addEventListener('change', setAutocompleteCountry); 
	  

 // Search for boat ramps in the selected city, within the viewport of the map.


}());


// *****************  END INIT MAP   ****************** //



// ***************  VIEW MODEL  ****************  //




var viewModel = function(datafromapi) {
	this.filteredPoints = ko.observableArray([]);
	console.log('filteredPoints isObervable: ' + ko.isObservable(this.filteredPoints));
	this.points = ko.observableArray([]);
	console.log('this.points isObervable: ' + ko.isObservable(this.points));
 this.points = ko.utils.arrayMap(datafromapi, function(item) {
	
	 return new point(item.name, item.pos, item.icon);	  
 });
 
 
 
 this.showInfoWindow = function(clickedName) {
	 infowindow.setContent(clickedName.marker.info.content);
	 infowindow.open(map, clickedName.marker);
 };
 
 
  var self = this;
  this.filterLetter = ko.observable();
  

  this.filteredPoints = ko.computed(function() {
    var filter = this.filterLetter();
//	console.log('this.filterLetter() ' + this.filterLetter());
//	console.log('filter is: ' + filter);

    if (!filter) {
		console.log(' in filter if filter is: ' + filter);
     return ko.utils.arrayFilter(self.points, function(item) {
		 
//		 console.log('item.name: ' + item.name);
//		 console.log('this should run every time city changes');
		item.marker.setVisible(true);
        return true;
      });
    }

    return ko.utils.arrayFilter(filteredPoints(), function(item) {
		self.points = this.filteredPoints();
      if (item.name.toLowerCase().indexOf(filter) === 0) {
//		  console.log('only run if there is a filter letter');
        return true
      } else {
        item.marker.setVisible(false);
        return false
      };
    });
//	console.log('self.filteredPoints: ' + self.filteredPoints);

  }, this);
};


// ********** End the viewModel  **********//

function point(name, latLong, pinicon) {

	
  this.name = name;
//  this.lat = ko.observable(lat);
//  this.long = ko.observable(long);

  this.marker = new google.maps.Marker({
	    position: latLong,
          
  //        icon: markerIcon,
  //  position: new google.maps.LatLng(lat,long),
    title: name,
    map: map,
	animation: google.maps.Animation.DROP,
	icon: pinicon
  }); 
  
  
  this.marker.info = new google.maps.InfoWindow({
	  content: '<div class="infowin"><strong>' + name + '</strong><br>'});
	 
  
  google.maps.event.addListener(this.marker, 'click', function() { 
  var marker_map = this.getMap();
    this.info.open(marker_map, this);
  
  
  });
}

function search() {
  var search = {
	  
    bounds: map.getBounds(),
//	types: ['lodging']
    keyword: 'boat ramp',
	radius: 3000
  
  };
 
  
places.nearbySearch(search, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
		discover = results;

//      clearResults();
//      clearMarkers();
      // Create a marker for each hotel found, and
      // assign a letter of the alphabetic to each marker icon.
      for (var i = 0; i < results.length; i++) {
        var markerLetter = String.fromCharCode('A'.charCodeAt(0) + i);
        var markerIcon = MARKER_PATH + markerLetter + '.png';
        // Use marker animation to drop the icons incrementally on the map.
//		console.log(' location from results: ' + results[i].geometry.location.lat);
        markers[i] = {
		  name: results[i].name,
          pos: results[i].geometry.location,
          icon: markerIcon,
        };
	//	console.log('markers[i].name: ' + markers[i].position);
		
        // If the user clicks a boat ramp marker, show the details of that ramp
        // in an info window.
		
        markers[i].placeResult = results[i];
 //       google.maps.event.addListener(markers[i], 'click', showInfoWindow);
//        setTimeout(dropMarker(i), i * 100);
//        addResult(results[i], i);
      } // End for loop
//	  console.log('sending markers to viewModel :' + markers);
		viewModel(markers);

    }
});
}

function onPlaceChanged() {
  'use strict';
  var place = autocomplete.getPlace();
 // console.log('what is this place you speak of ' + place);
  if (place.geometry) {
    map.panTo(place.geometry.location);
//	console.log('is this the lat long or city name? ' + place.geometry.location);
    map.setZoom(12);
    search();
	loadFourSquareData(place.geometry.location, map);  // Load markers using the Foursquare API
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

// *************** GET FOURSQUARE DATA *****************//

/*******  This section is added to pull location data from FourSquare.   *****/
/* Foursquare documentation - Search for Places in an Area - https://developer.foursquare.com/start/search

-This is what Foursquare says you need to do to user their API-
"You’ll need your client ID and client secret to make a userless venue search or explore request ("venues" are what we call places on Foursquare). This is essentially the simplest way to interact with the Foursquare API—there’s no need to use OAuth. If you choose not to use a client library, you can directly make HTTP requests to the venues/search or venues/explore endpoints and get back a JSON response. "

In the HTTP request, you need to pass in your client ID, client secret, a version parameter, and any other parameters that the endpoint requires:

https://api.foursquare.com/v2/venues/search
  ?client_id=CLIENT_ID
  &client_secret=CLIENT_SECRET
  &ll=40.7,-74
  &query=sushi
  &v=20140806      //v param is essentially a date in YYYYMMDD format that lets you tell us "I'm prepared for API changes up to this date." 
  &m=foursquare    //An m parameter, which specifies whether you want Swarm- or Foursquare-style responses.
  
  */
  
  // ********   Load the Foursquare Pins ********//

 function loadFourSquareData(citylatlong, map) {
	 	var citylatlongstring = String(citylatlong);    // convert to string
	    var formattedcitylatlong = citylatlongstring.replace(/[()]/g,'');   // remove the parentheses 
		var foursquareId = 'BNIBDGYS4MPPBEZX00TFNXH0GPWLESDLWHAEKVX3UVELUNY3';
        var foursquaresecret = 'QRAJN1S0QBWSELVY3RMDRIITPGFVEKRPWSTFKQRLKG0QC2AG';
        var foursquareVersion = '20140806';
		var styleResponse = '&m=foursquare';
        var apiEndpoint = 'https://api.foursquare.com/v2/venues/search?client_id=' + foursquareId + '&client_secret=' + foursquaresecret + '&ll=' + formattedcitylatlong + '&query=boatramp' +'&v=' + foursquareVersion + styleResponse;
        
//		console.log(apiEndpoint);

        $.getJSON(apiEndpoint, function(result, status) {
//			console.log('report status ' + status);
            // var venue = json.response.groups[0].items[0].venue;
            
//			console.log('what foursquare sent back', result);

			if (status !== 'success') { 
				return alert('JSON Request to Foursquare API did not return success');  // Error check response from foursquare
			}  // if status Ok then continue placing pins
			
			
			// Transform each venue result into a marker on the map.
			for (var i = 0; i < result.response.venues.length; i++) {
				var venue = result.response.venues[i];
				// this is how the JSON response is set up. you need to construct like this to get the complete image url address
			    //var imgURL = results.response.venue[i].photos.groups[0].items[0].prefix + 'width200' + results.response.venue[i].photos.groups[0].items[0].suffix
			    // an object to store the relevant information that returned from JSON
				var foursquarePlace = {
				name: venue.name,
				street: venue.location.address,
				city: venue.location.city,
				state: venue.location.state,
				zip: venue.location.postalCode,
				lat: venue.location.lat,
				lng: venue.location.lng,
				};
				var foursquareicon = 'img/map-pin-4-square-34x22.png';
				var latLng = new google.maps.LatLng(foursquarePlace.lat,foursquarePlace.lng);
				var foursquareMarker = new google.maps.Marker({
					position: latLng,
					map: map,
					title: foursquarePlace.name,
					animation: google.maps.Animation.DROP,
					icon: 'img/map-pin-4-square-34x22.png'
			 //     img: imgURL
				});
				var foursquareContent = createInfoWindowContent(venue);
			//	console.log('foursquare content' + foursquareContent);
				
				attachInfoWindow(foursquareMarker, foursquareContent);
				
//				console.log('foursquarePlace' + " " + "lat:" + foursquarePlace.lat + " " + "lng:" + foursquarePlace.lng);	   
			}  //  end for loop 
		 
		  }).error(function() { alert("Yikes, Foursquare API returned an error on that request. Sorry, there will be no Foursquare data for you:("); })
			.complete(function() { console.log("foursquare request complete"); });  // All is well
					  
} // end load FourSquareData function

// *********** FourSquare Utility functions  ********************//

function createInfoWindowContent(venue) {
	// Foursquare requires credit for their API data, venue title is linked to Foursquare, see https://developer.foursquare.com/overview/attribution
	var venueURL = 'http://foursquare.com/v/' + venue.id, 
		infoWindowHTML = '<h6><a href="' + venueURL + '" target="_blank">' + venue.name  + '</a></h6>';
		infoWindowHTML += '<h7 class="foursquareinfo">Address: <span>' + venue.location.address + ', ' + venue.location.city + ', ' + venue.location.state + '</span></h7>';
		infoWindowHTML += '<h5><img src="img/foursquare-logo.png" alt="Foursquare logo"></h5>';
	   
	return infoWindowHTML;
}

function attachInfoWindow(foursquareMarker, foursquareContent) {
	var infowindow = new google.maps.InfoWindow({
		content: foursquareContent
	});
	
	foursquareMarker.addListener('click', function() {
		infowindow.open(foursquareMarker.get('map'), foursquareMarker);
	});
}
  
//// *******************   Utility Functions   *******************/////



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
//  clearResults();
  clearMarkers();
}



function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i]) {
      markers[i].setMap(null);
    }
  }
  markers = [];
}

var myViewModel = new viewModel(smile); // create a new object and store it in a variable
ko.applyBindings(myViewModel); // activate knockout
//ko.applyBindings(new viewModel(smile));