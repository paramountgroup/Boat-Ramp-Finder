// This code was based on the Source Google Map Developers API Samples customized to fit 
// the needs of the Udacity Front End Developers Course Project 5.



/*******     Data Model     ********

All data for this project is being stored in Google Maps and Accessed via the API. 
The second source of data is coming from Google Fusion Tables and also accessed via the API. 

*/

// View Model

/*

function initMap() {
  var myLatLng = {lat: 28.182882, lng: -80.592502};

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: myLatLng
  });

  var image = 'img/logo-with-blue-outline-circle-transp-30x29.png';
  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
	icon: image,
    title: 'The Paramount Group world headquarters',
	animation: google.maps.Animation.BOUNCE,
  });
  marker.addListener('click', toggleBounce);
  setMarkers(map);
  
// The following function makes the marker for the headquareters location bounce using a DROP
// animation. Clicking on the marker will toggle the animation between a BOUNCE
// animation and no animation.

  function toggleBounce() {
	if (marker.getAnimation() !== null) {
	  marker.setAnimation(null);
	} else {
	  marker.setAnimation(google.maps.Animation.BOUNCE);
	}
  }
}




function setMarkers(map) {
  // Adds markers to the map.

  // Marker sizes are expressed as a Size of X,Y where the origin of the image
  // (0,0) is located in the top left of the image.

  // Origins, anchor positions and coordinates of the marker increase in the X
  // direction to the right and in the Y direction down.
  var image = {
    url: 'img/beachflag.png',
    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(20, 32),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    anchor: new google.maps.Point(0, 32)
  };
  // Shapes define the clickable region of the icon. The type defines an HTML
  // <area> element 'poly' which traces out a polygon as a series of X,Y points.
  // The final coordinate closes the poly by connecting to the first coordinate.
  var shape = {
    coords: [1, 1, 1, 20, 18, 20, 18, 1],
    type: 'poly'
  };
 
 for (var i = 0; i < beaches.length; i++) {
	var beach = beaches[i];
    var marker = new google.maps.Marker({
      position: {lat: beach[1], lng: beach[2]},
      map: map,
      icon: image,
      shape: shape,
      title: beach[0],
      zIndex: beach[3]
    });
  }
}


// adding a number of markers and dropping them on the map
// consecutively rather than all at once. Use
// window.setTimeout() to space markers' animation.

// working correctly

function drop() {
  clearMarkers();
  for (var i = 0; i < beaches.length; i++) {
	  var beach = beaches[i];
      position: {lat: beach[1], lng: beach[2]},
      map: map,
      icon: image,
      shape: shape,
      title: beach[0],
      zIndex: beach[3]
	  addMarkerWithTimeout(beaches[i], i * 10000);
  }
}

function addMarkerWithTimeout(position, timeout) {
  window.setTimeout(function() {
    markers.push(new google.maps.Marker({
      position: position,
      map: map,
      animation: google.maps.Animation.DROP
    }));
  }, timeout);
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

*/

// The basis of this code is found on the google maps developer help page (sample example code) and uses the autocomplete feature of the Google Places API.
// It allows the user to find all boat ramps in a given place, within a given
// country. It then displays markers for all the boat ramps returned,
// with on-click details for each boat ramp.

var map, places, infoWindow;
var markers = [];
var autocomplete;
var countryRestrict = {'country': 'us'};
var MARKER_PATH = 'https://maps.gstatic.com/intl/en_us/mapfiles/marker_green';
var hostnameRegexp = new RegExp('^https?://.+?/');

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

 //Error handling if Google Maps fails to load within 8 seconds error message displayed. reference student code sheryllun-neighborhood map
 
  var mapRequestTimeout = setTimeout(function() {
    $('#map').html(' Oh My, Trouble loading Google Maps! Please refresh your browser and try again.');
  }, 8000);


function initMap() {
	var myLatLng = {lat: 28.182882, lng: -80.592502}; // this is my office location
	map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: myLatLng,
    mapTypeControl: false,
    panControl: false,
    zoomControl: true,
    streetViewControl: false
	
	});
	var image = 'img/PG-in-white-circle.png'; // company logo
	var marker = new google.maps.Marker({
	  position: myLatLng,
	  map: map,
	  icon: image,
	  title: 'The Paramount Group world headquarters',  // shameless plug
	  animation: google.maps.Animation.BOUNCE,
	});
	
	marker.addListener('click', toggleBounce); // toggle on or off the bouncing logo
//	setMarkers(map);  // sets markers that are hard coded in the app as a project requirement
  
// The following function makes the marker for the headquareters location bounce using a DROP
// animation. Clicking on the marker will toggle the animation between a BOUNCE
// animation and no animation.

	function toggleBounce() {
	  if (marker.getAnimation() !== null) {
		marker.setAnimation(null);
	  } else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
	  }
	}

  clearTimeout(mapRequestTimeout); // map loaded ok and no need for error message

  infoWindow = new google.maps.InfoWindow({
    content: document.getElementById('info-content')
  });

  // Create the autocomplete object and associate it with the UI input control.
  // Restrict the search to the default country, and to place type "cities".
  
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */ (
          document.getElementById('autocomplete')), {
        types: ['(cities)'],
        componentRestrictions: countryRestrict
      });
  places = new google.maps.places.PlacesService(map);

  autocomplete.addListener('place_changed', onPlaceChanged);

  // Add a DOM event listener to react when the user selects a country.
  document.getElementById('country').addEventListener(
      'change', setAutocompleteCountry);
//  loadFourSquareData(places, map);  // Load markers using the Foursquare search
}

/***********************   END INITMAP    ********************************/



// When the user selects a city, get the place details for the city and
// zoom the map in on the city.

function onPlaceChanged() {
  var place = autocomplete.getPlace();
  console.log('what is this place you speak of ' + place);
  if (place.geometry) {
    map.panTo(place.geometry.location);
	console.log('is this the lat long or city name? ' + place.geometry.location);
    map.setZoom(10);
    search();
	loadFourSquareData(place.geometry.location, map);  // Load markers using the Foursquare API
  } else {
    document.getElementById('autocomplete').placeholder = 'Enter a city';
  }

// If city matches were there are locations stored in the fusion table they are placed on the map as blue pins.
// Design, color, layout for these pins and infowindows are handled by the fusion table. 
  
  var layer = new google.maps.FusionTablesLayer({
	  query: {
		select: '\'Geocodable address\'',
		from: '1LvP5-t6UEtcj_KCBlIbi1Hvs2H8MY-PQfikWfuFC' // key for fusion table
	  }
  });
  
  layer.setMap(map); // load the fusion table pins
}

// Search for boat ramps in the selected city, within the viewport of the map.
function search() {
  var search = {
    bounds: map.getBounds(),
    keyword: 'boat ramp',
	radius: 3000
  
  };
 
  
  places.nearbySearch(search, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      clearResults();
      clearMarkers();
	  
      // Create a marker for each boat ramp found, and
      // assign a letter of the alphabetic to each marker icon.
	  
      for (var i = 0; i < results.length; i++) {
        var markerLetter = String.fromCharCode('A'.charCodeAt(0) + i);
        var markerIcon = MARKER_PATH + markerLetter + '.png';
        // Use marker animation to drop the icons incrementally on the map.
        markers[i] = new google.maps.Marker({
          position: results[i].geometry.location,
          animation: google.maps.Animation.DROP,
          icon: markerIcon,
        });
        // If the user clicks a boat ramp marker, show the details of that ramp
        // in an info window.
		
        markers[i].placeResult = results[i];
        google.maps.event.addListener(markers[i], 'click', showInfoWindow);
        setTimeout(dropMarker(i), i * 100);
        addResult(results[i], i); // call function to create list
      }
    }
  })
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i]) {
      markers[i].setMap(null);
    }
  }
  markers = [];
}

// Set the country restriction based on user input.
// Also center and zoom the map on the given country.
function setAutocompleteCountry() {
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

function dropMarker(i) {
  return function() {
    markers[i].setMap(map);
  };
}

// create the list of boat ramps

function addResult(result, i) {
	
	
console.log('show me what is being passed into addResult ' + result);

  var results = document.getElementById('results');
  var markerLetter = String.fromCharCode('A'.charCodeAt(0) + i);
  var markerIcon = MARKER_PATH + markerLetter + '.png';

  var tr = document.createElement('tr');
  tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
  tr.onclick = function() {
    google.maps.event.trigger(markers[i], 'click');
  };

  var iconTd = document.createElement('td');
  var nameTd = document.createElement('td');
  var icon = document.createElement('img');
  icon.src = markerIcon;
  icon.setAttribute('class', 'placeIcon');
  icon.setAttribute('className', 'placeIcon');
  var name = document.createTextNode(result.name);
  iconTd.appendChild(icon);
  nameTd.appendChild(name);
  tr.appendChild(iconTd);
  tr.appendChild(nameTd);
  results.appendChild(tr);
}

/*
var CoffeeShopViewModel = function() {
            var self = this;

            self.locations = ko.observableArray();
            self.searchInput = ko.observable('');

            // Knockout utility function enabling user to filter search
            self.filteredLocations = ko.computed(function() {
                return ko.utils.arrayFilter(self.locations(), function(location) {
                    if ( location.title.toLowerCase().match( self.searchInput().toLowerCase() ) ) {
                        return location;
                    }
                });
            });

}

*/








function clearResults() {
  var results = document.getElementById('results');
  while (results.childNodes[0]) {
    results.removeChild(results.childNodes[0]);
  }
}

// Get the place details for a boat ramp. Show the information in an info window,
// anchored on the marker for the boat ramp that the user selected.

function showInfoWindow() {
  var marker = this;
  places.getDetails({placeId: marker.placeResult.place_id},
      function(place, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          return;
        }
        infoWindow.open(map, marker);
        buildIWContent(place);
      });
}

// Load the place information into the HTML elements used by the info window.
function buildIWContent(place) {
  document.getElementById('iw-icon').innerHTML = '<img class="hotelIcon" ' +
      'src="' + place.icon + '"/>';
  document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
      '">' + place.name + '</a></b>';
  document.getElementById('iw-address').textContent = place.vicinity;

  if (place.formatted_phone_number) {
    document.getElementById('iw-phone-row').style.display = '';
    document.getElementById('iw-phone').textContent =
        place.formatted_phone_number;
  } else {
    document.getElementById('iw-phone-row').style.display = 'none';
  }

  // Assign a five-star rating to the boat ramp, using a black star ('&#10029;')
  // to indicate the rating the boat ramp has earned, and a white star ('&#10025;')
  // for the rating points not achieved.
  
  if (place.rating) {
    var ratingHtml = '';
    for (var i = 0; i < 5; i++) {
      if (place.rating < (i + 0.5)) {
        ratingHtml += '&#10025;';
      } else {
        ratingHtml += '&#10029;';
      }
    document.getElementById('iw-rating-row').style.display = '';
    document.getElementById('iw-rating').innerHTML = ratingHtml;
    }
  } else {
    document.getElementById('iw-rating-row').style.display = 'none';
  }

  // The regexp isolates the first part of the URL (domain plus subdomain)
  // to give a short URL for displaying in the info window.
  
  if (place.website) {
    var fullUrl = place.website;
    var website = hostnameRegexp.exec(place.website);
    if (website === null) {
      website = 'http://' + place.website + '/';
      fullUrl = website;
    }
    document.getElementById('iw-website-row').style.display = '';
    document.getElementById('iw-website').textContent = website;
  } else {
    document.getElementById('iw-website-row').style.display = 'none';
  }
}


/*******  This section is added to pull location data from FourSquare.   *****/
/* Foursquare documentation - Search for Places in an Area - https://developer.foursquare.com/start/search

-This what Foursquare says you need to do to user their API-
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



// ********   Load the Foursquare Pins ********//

 function loadFourSquareData(citylatlong, map) {
	 	var citylatlongstring = String(citylatlong);    // convert to string
	    var formattedcitylatlong = citylatlongstring.replace(/[()]/g,'');   // remove the parentheses 
		var foursquareId = 'BNIBDGYS4MPPBEZX00TFNXH0GPWLESDLWHAEKVX3UVELUNY3';
        var foursquaresecret = 'QRAJN1S0QBWSELVY3RMDRIITPGFVEKRPWSTFKQRLKG0QC2AG';
        var foursquareVersion = '20140806';
		var styleResponse = '&m=foursquare';
        var apiEndpoint = 'https://api.foursquare.com/v2/venues/search?client_id=' + foursquareId + '&client_secret=' + foursquaresecret + '&ll=' + formattedcitylatlong + '&query=boatramp' +'&v=' + foursquareVersion + styleResponse;
        
		console.log(apiEndpoint);

        $.getJSON(apiEndpoint, function(result, status) {
			console.log('report status ' + status);
            // var venue = json.response.groups[0].items[0].venue;
            
			console.log('what foursquare sent back', result);

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
				console.log('foursquare content' + foursquareContent);
				
				attachInfoWindow(foursquareMarker, foursquareContent);
				
				console.log('foursquarePlace' + " " + "lat:" + foursquarePlace.lat + " " + "lng:" + foursquarePlace.lng);	   
			}  //  end for loop 
		 
		  }).error(function() { alert("Yikes, Foursquare API returned an error on that request. Sorry, there will be no Foursquare data for you:("); })
			.complete(function() { console.log("foursquare request complete"); });  // All is well
					  
} // end load FourSquareData function
	
	//var infowindow = null;


			


//ko.applyBindings(myViewModel);