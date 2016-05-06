

var map;
var venue = []
var autocomplete;
var places;
var markers = [];
var MARKER_PATH = 'https://maps.gstatic.com/intl/en_us/mapfiles/marker_green';
//var infowindow = new google.maps.InfoWindow();
var mappedArray;
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
 var countryRestrict = {'country': 'us'};
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


  marker.addListener('click', toggleBounce);  // click listener to stop or start bouncing logo

  
  
   clearTimeout(mapRequestTimeout); // map loaded ok so no need for error message
    
  
  // Create the autocomplete object and associate it with the UI input control.
  // Restrict the search to the default country, and to place type "cities".
  
  autocomplete = new google.maps.places.Autocomplete((document.getElementById('autocomplete')), {
					types: ['(cities)'],
					componentRestrictions: countryRestrict
				  });	  
	  
  places = new google.maps.places.PlacesService(map); // entered city lat/long
// Search for boat ramps in the selected city, within the viewport of the map.
  autocomplete.addListener('place_changed', onPlaceChanged);

  // Add a DOM event listener to react when the user selects a country.
 
  document.getElementById('country').addEventListener('change', setAutocompleteCountry); 
	  

 


  mappedArray = ko.utils.arrayMap(smile, function(item) { // preloads an array of points from the smile.js file 
    return new point(item.name, item.pos, item.icon, item.content); // icon is not defined uses default google maps icon.
  });
  

}());

// *****************  END INIT MAP   ****************  //

// ***************  NEW VIEW MODEL  ****************  //
var infowindow = new google.maps.InfoWindow();
var viewModel = {
  points: ko.observableArray([]),
  filterLetter: ko.observable(""),
  showInfoWindow: function(point) {
    infowindow.setContent(point.marker.info.content);
    infowindow.open(map, point.marker);
  }
};

//ko.utils.arrayFilter - filter the items using the filter text
viewModel.filteredPoints = ko.dependentObservable(function() {
  var filter = this.filterLetter().toLowerCase();
  var self = this;
  if (!filter) {
    // return self.points() the original array;
    return ko.utils.arrayFilter(self.points(), function(item) {
      item.marker.setVisible(true);
      return true;
    });
  } else {
    return ko.utils.arrayFilter(this.points(), function(item) {
      if (item.name.toLowerCase().indexOf(filter) === 0) {
        return true
      } else {
        item.marker.setVisible(false);
        return false
      };
    });
  }
}, viewModel);


// ********** End the viewModel  **********//



function point(name, latLong, pinicon, infoContent) {

  this.name = name;
  this.marker = new google.maps.Marker({
	position: latLong,
    title: name,
    map: map,
	animation: google.maps.Animation.DROP,
	icon: pinicon
  }); 
  
  
  this.marker.info = new google.maps.InfoWindow({
	  content: infoContent});
	 
  
  google.maps.event.addListener(this.marker, 'click', function() { 
  var marker_map = this.getMap();
    this.info.open(marker_map, this);
    //Change the marker icon when clicked
    this.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
  }); 

}

/****** This function is not requried for the project to be graded and by udacity *******

function search() {
  var search = { 
    bounds: map.getBounds(),
    keyword: 'boat ramp',
	radius: 3000
  };
 

  
places.nearbySearch(search, function(results, status) {

    if (status === google.maps.places.PlacesServiceStatus.OK) {

//      clearResults();
//      clearMarkers();
      // Create a marker icon for each boat ramp found, and
      // assign a letter of the alphabetic to each marker icon.
      for (var i = 0; i < results.length; i++) {
        var markerLetter = String.fromCharCode('A'.charCodeAt(0) + i);
        var markerIcon = MARKER_PATH + markerLetter + '.png';
        // Use marker animation to drop the icons incrementally on the map.
        markers[i] = {
		  name: results[i].name,
          pos: results[i].geometry.location,
          icon: markerIcon,
        };// End for loop
		
      } //End if maps ok

 var markersToViewModel = ko.utils.arrayMap(markers, function(item) {
    return new point(item.name, item.pos, item.icon);
  });
	 viewModel.points(markersToViewModel); // send new array of points to viewModel from Google Places new location
	}
});
}

*/

function onPlaceChanged() {
  'use strict';
  var place = autocomplete.getPlace();
  if (place.geometry) {
    map.panTo(place.geometry.location);
    map.setZoom(11);
//    search();
	loadFourSquareData(place.geometry.location, map);  // Load markers using the Foursquare API
  } else {
    document.getElementById('autocomplete').placeholder = 'Enter a city';
  }

  var layer = new google.maps.FusionTablesLayer({//This is a way easier way to put markers on the map and IS an API!
	query: {
	  select: '\'Geocodable address\'',
	  from: '1LvP5-t6UEtcj_KCBlIbi1Hvs2H8MY-PQfikWfuFC' // key for fusion table
	}
	});
  
  layer.setMap(map); // load the fusion table pins that are user recommended boat ramp locations
}



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
        


        $.getJSON(apiEndpoint, function(result, status) {

			if (status !== 'success') { 
				return alert('JSON Request to Foursquare API did not return success');  // Error check response from foursquare
			}  // if status Ok then continue placing pins
			
			
			// Transform each venue result into a marker on the map.
			for (var i = 0; i < result.response.venues.length; i++) {
				
				venue[i] = result.response.venues[i];
				
							
				
				if (venue[i].location.address === undefined) {
					venue[i].location.address = "No street address available";
				}
				
				if (venue[i].location.city === undefined) { 
					venue[i].location.city = "";
				}
				if (venue[i].location.state === undefined) {
					venue[i].location.state = "";
				}
				
				venue[i].pos = new google.maps.LatLng(venue[i].location.lat, venue[i].location.lng); // need lat/long together
				venue[i].content = createInfoWindowContent(venue[i]);
				
				// this is how the JSON response is set up. you need to construct like this to get the complete image url address
			    //var imgURL = results.response.venue[i].photos.groups[0].items[0].prefix + 'width200' + results.response.venue[i].photos.groups[0].items[0].suffix
			    // an object to store the relevant information that returned from JSON
				var foursquarePlace = {
				name: venue[i].name,
				street: venue[i].location.address,
				city: venue[i].location.city,
				state: venue[i].location.state,
				zip: venue[i].location.postalCode,
				lat: venue[i].location.lat,
				lng: venue[i].location.lng,
				pos: new google.maps.LatLng(venue[i].location.lat, venue[i].location.lng),
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
			}  //  end for loop 
			
			 var FourSquareMarkersToViewModel = ko.utils.arrayMap(venue, function(item) { // prepare array to send to viewModel
				return new point(item.name, item.pos, foursquareicon, item.content);
				
			 });
			 viewModel.points(FourSquareMarkersToViewModel); // send new array of points to viewModel from Foursquare new location
		 
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

function toggleBounce() {
	if (marker.getAnimation() !== null) {
	  marker.setAnimation(null);
	} else {
	  marker.setAnimation(google.maps.Animation.BOUNCE);
	}
  } 



function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i]) {
      markers[i].setMap(null);
    }
  }
  markers = [];
}



viewModel.points(mappedArray);
ko.applyBindings(viewModel); // activate knockout