// Pseudocode for Eco Travel App

// 1. Accept input from user for location, dates, and number of travellers.
var searchDestination = $('#dest-input');
var tripStart = $('#start-date-input');
var tripEnd = $('#end-date-input');
var numOfTravellers = $('#num-of-travellers-input');
var carbOffsetProg = $('carbon-Os-Prog-input');
var results = $('#results');


// 2. Use Google Maps API to search for eco-friendly accommodations in the selected location.

// 3. Display a list of accommodations to the user, including trip date, photos, description, price, and reviews.

// 4. Use API or data source to retrieve information on sustainable transportation options (public transportation, car rentals, carbon offset programs).

// 5. Sort the transportation options by relevance.

// 6. Display detailed information on each transportation option to the user, including cost, availability, and reviews.

// 7. Calculate the estimated carbon emissions for the trip.

// 8. Present the user with a list of carbon offset programs.

// 9. Accept input from user on the selected carbon offset program.

// 10. Record the carbon offset in the user's account.

// Images in Hero section automatically are changing every 3 sec //
 // Get the images in the carousel
 var images = document.querySelectorAll('.slides img');
    
 // Keep track of the current image
 var currentImage = 0;

 // Change the active image every 3 seconds
 setInterval(function () {
     // Remove the active class from the current image
     images[currentImage].classList.remove('active');

     // Increment the current image
     currentImage = (currentImage + 1) % images.length;

     // Add the active class to the new image
     images[currentImage].classList.add('active');
 }, 3000);

 // To add an auto-typing effect to the text hero section, inside the <h1> tag //
    new Typed('.typed-words', {
        strings: ['be adventurous', 'be spontaneous', 'be mindful'],
        typeSpeed: 70,
        loop: true,
    });



