mapboxgl.accessToken = 
'pk.eyJ1IjoiY3VwcmltbyIsImEiOiJjbGRyamhnZGowM2x3M3dwNGJ4bjEyMWh1In0.Q4fwIexfm5nHsUVbfLXDfw';
  
navigator.geolocation.getCurrentPosition(successLocation, 
    errorLocation, {
        enableHighAccuracy: true 
})

function successLocation(position) {
console.log(position);
setupMap([position.coords.longitude, position.coords.latitude], true)
}

function errorLocation() {
    setupMap([-2.24, 53.48], false)
}

function setupMap(center, haveLocation) {
var mapContainer = $('#map');
mapContainer.empty();
var map = new mapboxgl.Map({
    container: mapContainer[0],
    style: 'mapbox://styles/mapbox/streets-v11',
    center: center,
    zoom:9
});

map.scrollZoom.disable();
var nav = new mapboxgl.NavigationControl();
map.addControl(nav);

var directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken
  });

  // Add a mode of transport selector
  var modeSelector = $('<select id="mode-selector">')
    .append('<option value="car">Car</option>')
    .append('<option value="bicycle">Bicycle</option>')
    .append('<option value="public_transport">Public Transport</option>')
    .append('<option value="walking">Walking</option>');
  mapContainer.append(modeSelector);

  // Add a listener to update the carbon footprint when the mode is changed
  modeSelector.change(function() {
    var mode = $(this).val();
    updateCarbonFootprint(mode, directions);
  });
   
  // Add the Mapbox Directions contro
  map.addControl(directions, 'top-left');

  if(haveLocation) {

  // Calculate and display the carbon footprint for the default mode (car)
  updateCarbonFootprint('car', directions);
    }
}

function updateCarbonFootprint(mode, directions) {
    // Example emissions data per mode
    var emissionsData = {
      car: 0.3,
      bicycle: 0,
      public_transport: 0.15,
      walking: 0
    };
  
    directions.on('route', function(e) {
        // Example distance data for the journey
        var route = e.route;
        var distance = route[0].distance;

        // Use the distance to calculate the emissions
        var emissions = emissionsData[mode] * distance;

        // Calculate miles from distance (1 meter = 0.000621371 miles)
        var miles = distance * 0.000621371;

        // Calculate travel time from route duration (duration is in seconds)
        var travelTime = route[0].duration / 60;  // in minutes
    
    // Display the emissions in a pop-up or as an overlay
    var roundedEmissions = Math.floor(emissions);
    var roundedMiles = Math.floor(miles);
    var roundedTravelTime = Math.floor(travelTime);

    $('#emissions').html(
        'Emissions: ' + roundedEmissions + ' g CO2' + '<br>' +
        'Miles: ' + roundedMiles + '<br>' +
        'Travel time: ' + roundedTravelTime + ' minutes'
      );
      console.log(
        'Emissions: ' + roundedEmissions + ' g CO2' + '\n' +
        'Miles: ' + miles + '\n' +
        'Travel time: ' + travelTime + ' minutes'
      );
    });
  }
  
  
  
  
  
  
// PREVIOUS GOOGLE MAPS API CODE

// // set initial map view
// var myLatLng = { lat: 51.501, lng: -0.1419 };
// var mapOptions = {
//     center: myLatLng,
//     zoom: 7,
//     mapTypeId: google.maps.MapTypeId.ROADMAP
// };

// //generate the map view
// var map = new google.maps.Map($("#googleMap")[0], mapOptions);
// var dirService = new google.maps.DirectionsService();
// var dirDisplay = new google.maps.DirectionsRenderer();
// //Attach the DirectionsRenderer to the map
// dirDisplay.setMap(map);

// // Check if there is a stored route and display it if it exists
// var storedRoute = localStorage.getItem("route");
// if (storedRoute) {
//   $("#displayResult").html(storedRoute);

//   $("#history").click(function() {
//     var storedRoutes = JSON.parse(localStorage.getItem("routes")) || [];
//     // Code to display the retrieved routes
//   });
// }

  
// //define Route function that takes the #to and #from inputs
// function Route() {
//     var mode = $("#mode").val();
//     //create request
//     var request = {
//         origin: $("#startLoc").val(),
//         destination: $("#endLoc").val(),
//         travelMode: google.maps.TravelMode[mode.toUpperCase()],
//         unitSystem: google.maps.UnitSystem.IMPERIAL
//     }

//     //pass the request to the route method
//     dirService.route(request, function (result, status) {
//         if (status == google.maps.DirectionsStatus.OK) {

// // Carbon footprint calculation
//         var distance = result.routes[0].legs[0].distance.value / 1000; // convert distance from meters to kilometers
//         var carbonFootprint;
//             switch (mode) {
//                 case "DRIVING":
//                     carbonFootprint = distance * 0.3;
//                     break;
//                 case "TRANSIT":
//                     carbonFootprint = distance * 0.15;
//                     break;
//                 default:
//                     carbonFootprint = 0;
// }

//             // Generate travel distance and calcualte time then display on page
//             var output = $("#displayResult");
//             output.html("<div class='alert-info'><strong>From: </strong>" + $("#startLoc").val() + 
//             ".<br /><strong>To: </strong>" + $("#endLoc").val() + 
//             ".<br />" + "<strong>Driving" + " " +  "distance: </strong>" + result.routes[0].legs[0].distance.text + 
//             ".<br /><strong>Duration: </strong>" + result.routes[0].legs[0].duration.text + 
//             ".<br /><strong>Carbon Footprint: </strong>" + carbonFootprint + " kg of CO2.</div>");

//             // Generate displayed route
//             dirDisplay.setDirections(result);
//         } else {
//             // delete route from map
//             dirDisplay.setDirections({ routes: [] });
//             // center map in London
//             map.setCenter(myLatLng);

//             //show error message
//             output.html("<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Unable to generate route</div>");
//         }
//     });

// }

// //create autocomplete objects for all inputs
// var options = {
//     types: ['(cities)']
// };

// var input1 = $("#startLoc");
// var autocomplete1 = new google.maps.places.Autocomplete(input1[0], options);

// var input2 = $("#endLoc");
// var autocomplete2 = new google.maps.places.Autocomplete(input2[0], options);