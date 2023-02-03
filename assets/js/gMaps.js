//set map options
let myLatLng = { lat: 51.501, lng: -0.1419 };
let mapOptions = {
    center: myLatLng,
    zoom: 7,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

//create map
let map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
//create a DirectionsService object to use the route method and get a result for our request
let directionsService = new google.maps.DirectionsService();
//create a DirectionsRenderer object which we will use to display the route
let directionsDisplay = new google.maps.DirectionsRenderer();
//bind the DirectionsRenderer to the map
directionsDisplay.setMap(map);

//define calcRoute function
function calcRoute() {
    let mode = document.getElementById('mode').value;
    //create request
    let request = {
        origin: document.getElementById("from").value,
        destination: document.getElementById("to").value,
        travelMode: google.maps.TravelMode[mode.toUpperCase()],
        unitSystem: google.maps.UnitSystem.IMPERIAL
    }

    //pass the request to the route method
    directionsService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {

// Carbon footprint calculation
        let distance = result.routes[0].legs[0].distance.value / 1000; // convert distance from meters to kilometers
        let carbonFootprint;
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
            let output = document.querySelector('#output');
            output.innerHTML = "<div class='alert-info'><strong>From: </strong>" + document.getElementById("from").value + 
            ".<br /><strong>To: </strong>" + document.getElementById("to").value + 
            ".<br />" + "<strong>Driving" + " " +  "distance: </strong>" + result.routes[0].legs[0].distance.text + 
            ".<br /><strong>Duration: </strong>" + result.routes[0].legs[0].duration.text + 
            ".<br /><strong>Carbon Footprint: </strong>" + carbonFootprint + " kg of CO2.</div>";

            //display route
            directionsDisplay.setDirections(result);
        } else {
            //delete route from map
            directionsDisplay.setDirections({ routes: [] });
            //center map in London
            map.setCenter(myLatLng);

            //show error message
            output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
        }
    });

}

//create autocomplete objects for all inputs
let options = {
    types: ['(cities)']
}

let input1 = document.getElementById("from");
let autocomplete1 = new google.maps.places.Autocomplete(input1, options);

let input2 = document.getElementById("to");
let autocomplete2 = new google.maps.places.Autocomplete(input2, options);
