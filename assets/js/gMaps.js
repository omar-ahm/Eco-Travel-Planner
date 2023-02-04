$(document).ready(function() {
// set initial map view
var myLatLng = { lat: 51.501, lng: -0.1419 };
var mapOptions = {
    center: myLatLng,
    zoom: 7,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

//create map
var map = new google.maps.Map($("#googleMap")[0], mapOptions);
//create a DirectionsService object to use the route method and get a result for our request
var directionsService = new google.maps.DirectionsService();
//create a DirectionsRenderer object which we will use to display the route
var directionsDisplay = new google.maps.DirectionsRenderer();
//Attach the DirectionsRenderer to the map
directionsDisplay.setMap(map);

//define calcRoute function
function calcRoute() {
    var mode = $("#mode").val();
    //create request
    var request = {
        origin: $("#from").val(),
        destination: $("#to").val(),
        travelMode: google.maps.TravelMode[mode.toUpperCase()],
        unitSystem: google.maps.UnitSystem.IMPERIAL
    }

    //pass the request to the route method
    directionsService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {

// Carbon footprint calculation
        var distance = result.routes[0].legs[0].distance.value / 1000; // convert distance from meters to kilometers
        var carbonFootprint;
            switch (mode) {
                case "DRIVING":
                    carbonFootprint = distance * 0.3;
                    break;
                case "TRANSIT":
                    carbonFootprint = distance * 0.15;
                    break;
                default:
                    carbonFootprint = 0;
}

            //Get distance and time
            var output = $("#output");
            output.html("<div class='alert-info'><strong>From: </strong>" + $("#from").val() + 
            ".<br /><strong>To: </strong>" + $("#to").val() + 
            ".<br />" + "<strong>Driving" + " " +  "distance: </strong>" + result.routes[0].legs[0].distance.text + 
            ".<br /><strong>Duration: </strong>" + result.routes[0].legs[0].duration.text + 
            ".<br /><strong>Carbon Footprint: </strong>" + carbonFootprint + " kg of CO2.</div>");

            //display route
            directionsDisplay.setDirections(result);
        } else {
            //delete route from map
            directionsDisplay.setDirections({ routes: [] });
            //center map in London
            map.setCenter(myLatLng);

            //show error message
            output.html("<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Unable to generate route</div>");
        }
    });

}

//create autocomplete objects for all inputs
var options = {
    types: ['(cities)']
};

var input1 = $("#from");
var autocomplete1 = new google.maps.places.Autocomplete(input1[0], options);

var input2 = $("#to");
var autocomplete2 = new google.maps.places.Autocomplete(input2[0], options);
})