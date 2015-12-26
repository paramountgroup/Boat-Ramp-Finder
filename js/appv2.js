// JavaScript Document
/*  Source Google Maps API Tutorial  */

function initialize() {
        var mapCanvas = document.getElementById('map');
        var mapOptions = {
          center: new google.maps.LatLng(28.182882, -80.592502),
          zoom: 10,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(mapCanvas, mapOptions)
		
/*		var markerOptions = {
		  position: new google.maps.LatLng(28.182882, -80.592502),
		  map: map
		};
		var headquaters = new google.maps.Marker(markerOptions);
		marker.setMap(map);

		var infoWindowOptions = {
			content: 'The Paramount Group World Head Quarters'
		};

		var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
		google.maps.event.addListener(headquarters,'click',function(e){
  
		infoWindow.open(map, headquarters); 
		});
		
		var map = new google.maps.Map(document.getElementById('map'), mapOptions);
		var acOptions = {
		  types: ['establishment']
		};
		var autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'),acOptions);
		autocomplete.bindTo('bounds',map);
		var infoWindow = new google.maps.InfoWindow();
		var marker = new google.maps.Marker({
		  map: map
		});
		
		google.maps.event.addListener(autocomplete, 'place_changed', function() {
		  infoWindow.close();
		  var place = autocomplete.getPlace();
		  if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		  } else {
			map.setCenter(place.geometry.location);
			map.setZoom(17);
		  }
		  marker.setPosition(place.geometry.location);
		  infoWindow.setContent('<div><strong>' + place.name + '</strong><br>');
		  infoWindow.open(map, marker);
		  google.maps.event.addListener(marker,'click',function(e){
		
			infoWindow.open(map, marker);

		  });
		});
*/		
		var weatherLayer = new google.maps.weather.WeatherLayer({
		  temperatureUnits: google.maps.weather.TemperatureUnit.FAHRENHEIT
		});
		weatherLayer.setMap(map);
		
		var cloudLayer = new google.maps.weather.CloudLayer();
		cloudLayer.setMap(map);
		}
google.maps.event.addDomListener(window, 'load', initialize);
	  

