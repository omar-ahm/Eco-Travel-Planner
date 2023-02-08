// Google Maps and Trail Api Key
apiKey = "AIzaSyANek184qE1iZOIHlPpUs_Nk34G_AA2DT4";
trailApi = "df0bec8614msh80779c66b5b858ap1b8aa9jsn05a4fe08c52a";

let userInput = document.getElementById('userInput');
let searchButton = document.getElementById('searchButton');
let searchResults = document.getElementById('searchResults');
let progress = document.getElementById('progress');
let mapsContainer = document.getElementById('maps-container');

// function initMap() {
function initMap() {
    var options = {
        types: ['(cities)'],
        componentRestrictions: {
            country: ["us", "gb"]
        }
    };
    var input = document.getElementById('userInput');
    var autocomplete = new google.maps.places.Autocomplete(input, options);
}

searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    runSearch();
})
userInput.addEventListener('keyup', (e) => {
    e.preventDefault();
    if (e.keyCode === 13) {
        document.getElementById('searchButton').click()
        runSearch();
    }
})

// Start the function and fetch
function runSearch() {
    progress.style.display = "block"

    let inputText = userInput.value
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${inputText}&key=${apiKey}`)
        .then(response => response.json())
        .then(latData => {
            let lat = latData.results[0].geometry.location.lat;
            let lng = latData.results[0].geometry.location.lng;
            return fetch(`https://trailapi-trailapi.p.rapidapi.com/trails/explore/?lat=${lat}&lon=${lng}`,
                {
                    "method": "GET",
                    "headers": {
                        "X-RapidAPI-Host": "trailapi-trailapi.p.rapidapi.com",
                        "X-RapidAPI-Key": `${trailApi}`
                    }
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data.data);
                    let html = data.data.map(trailData => {
                        while (searchResults.firstChild) {
                            searchResults.removeChild(searchResults.firstChild);
                        };
                        if (trailData.thumbnail === null) {
                            trailData.thumbnail = "assets/images/slider-1.jpeg";
                        };
                        if (trailData.rating === 0) {
                            trailData.rating = 'no rating';
                        }
                        if (trailData.difficulty === '') {
                            trailData.difficulty = 'unknown';
                        };
                        if (trailData.length === '0.0') {
                            trailData.length = 'unknown'
                        }
                        return `<div class="cards" id="searchResults">
                <img src="${trailData.thumbnail}" class="cards-img-top" alt="trail image">
                <div class="cards-body" >
                  <h5 class="cards-title">${trailData.name}</h5>
                  <p>City: ${trailData.city}</p>
                  <p class="difficulty">Difficulty: ${trailData.difficulty}</p>
                  <p class="length">Length: ${trailData.length} miles</p>
                  <p id="rateMe2" class="empty-stars">Rating: ${trailData.rating}</p>
                  <a href="${trailData.url}" target="_blank" rel="noopener noreferrer" id="details-button" class="details-button btn btn-info mt-1">Detail</a>
                  <button id="mapsButton" class="maps-button btn btn-info mt-1" value="${trailData.lat},${trailData.lon}">Map</button>
                </div>
              </div>`
                    }).join('');
                    document.querySelector('#searchResults').insertAdjacentHTML('afterbegin', html);
                    userInput.value = '';

                    progress.style.display = "none"
                    location.href = '#searchResults'

                    let mapsButton = document.querySelectorAll('#mapsButton');
                    console.log(mapsButton, 60);

                    mapsButton.forEach(mapsButton => {
                        mapsButton.addEventListener('click', (e) => {
                            console.log(mapsButton.value);
                            mapsContainer = document.querySelector('#map-container')
                            mapsContainer.innerHTML = ''
                            let iframe = `
                    <iframe style="border:0"
                    loading="lazy"
                                allowfullscreen
                                src='https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${mapsButton.value}
                                &zoom=12
                                &maptype=satellite'>
                                </iframe>`
                            console.log(iframe, 75);
                            mapsContainer.innerHTML = iframe;
                            location.href = '#map-container';
                        })
                    })
                })
        })
}