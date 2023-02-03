

//global variables
var mainElement = document.querySelector("#content")
var cityName = document.querySelector("#city-input")
var sumbitElement = document.querySelector("#submit-button")
var locationArray = [];
var trailLocations = []


//api call to get lon/lat using the users inputed city
function getLocation(event) {
    var citySearch = cityName.value
    var apiKey = 'c930bf6f68b3d8e517378bd63f068cbb'
    var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&appid=${apiKey}&units=imperial`

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            locationArray.push(new Location(data.coord.lat, data.coord.lon))
            trailApi()
        });
}

//creates location object to store lat/lon
function Location(lat, lon) {
    this.lat = lat;
    this.lon = lon;
}


axios.request(options).then(function (response) {
    console.log(response.data);
}).catch(function (error) {
    console.error(error);
});

//api call to get trail data based on lat/lon
async function trailApi(event) {
    fetch(`https://trailapi-trailapi.p.rapidapi.com/trails/explore/&lon=${locationArray[0].lon}&limit=25&lat=${locationArray[0].lat}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "df0bec8614msh80779c66b5b858ap1b8aa9jsn05a4fe08c52a",
            "x-rapidapi-host": "trailapi-trailapi.p.rapidapi.com",
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(response => {
            trailLocations = []
            for (let i = 0; i < response.places.length; i++) {
                if (response.places[i].description !== null) {
                    trailLocations.push({ name: response.places[i].name, description: response.places[i].description, lat: response.places[i].lat, lon: response.places[i].lon })
                }
            }
            render()
        })


        .catch(err => {
            console.error(err);
        });


}
