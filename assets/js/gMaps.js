
// set initial map view
var myLatLng = { lat: 51.501, lng: -0.1419 };
var mapOptions = {
    center: myLatLng,
    zoom: 7,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

//generate the map view
var map = new google.maps.Map($("#googleMap")[0], mapOptions);
var dirService = new google.maps.DirectionsService();
var dirDisplay = new google.maps.DirectionsRenderer();
//Attach the DirectionsRenderer to the map
dirDisplay.setMap(map);

//define Route function that takes the #to and #from inputs
function Route() {
    var mode = $("#mode").val();
    //create request
    var request = {
        origin: $("#startLoc").val(),
        destination: $("#endLoc").val(),
        travelMode: google.maps.TravelMode[mode.toUpperCase()],
        unitSystem: google.maps.UnitSystem.IMPERIAL
    }

    //pass the request to the route method
    dirService.route(request, function (result, status) {
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

            // Generate travel distance and calcualte time then display on page
            var output = $("#displayResult");
            output.html("<div class='alert-info'><strong>From: </strong>" + $("#startLoc").val() + 
            ".<br /><strong>To: </strong>" + $("#endLoc").val() + 
            ".<br />" + "<strong>Driving" + " " +  "distance: </strong>" + result.routes[0].legs[0].distance.text + 
            ".<br /><strong>Duration: </strong>" + result.routes[0].legs[0].duration.text + 
            ".<br /><strong>Carbon Footprint: </strong>" + carbonFootprint + " kg of CO2.</div>");

            // Generate displayed route
            dirDisplay.setDirections(result);
        } else {
            // delete route from map
            dirDisplay.setDirections({ routes: [] });
            // center map in London
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

var input1 = $("#startLoc");
var autocomplete1 = new google.maps.places.Autocomplete(input1[0], options);

var input2 = $("#endLoc");
var autocomplete2 = new google.maps.places.Autocomplete(input2[0], options);