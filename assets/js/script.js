$(document).ready(function () {
  // populate a dropdown list of destinations
  var destinations = ["New York", "London", "Paris", "Berlin", "Tokyo"];
  var transport = ["Car", "Plane", "Train", "Bike", "Walk"];
  // target the form-control for destinations
  var select = $("select.destination");
  var selectTran = $("select.transport");

  transport.forEach(function (transport) {
    selectTran.append("<option>" + transport + "<option>");
  });
  // function to select the desired destination
  destinations.forEach(function (destination) {
    select.append("<option>" + destination + "</option>");
  });

  // Function to create a date filter for the date picker range
  $(function () {
    $("#datefilter").daterangepicker({
      autoUpdateInput: false,
      locale: {
        cancelLabel: "Clear",
      },
    });
    $("#datefilter").on("apply.daterangepicker", function (ev, picker) {
      $(this).val(
        picker.startDate.format("DD/MM/YYYY") +
          " - " +
          picker.endDate.format("DD/MM/YYYY")
      );
    });
  });
});
// $(".slides").carousel("cycle");

// Pseudocode for Eco Travel App

// // 2. Use Google Maps API to search for eco-friendly accommodations in the selected location.

// // 3. Display a list of accommodations to the user, including trip date, photos, description, price, and reviews.

var dest_id;
var hotel_id = [];
var hotel_name = $(".form").on("submit", function (event) {
  $(event.preventDefault());
  var selDest = $("#endDest option:selected").text();
  console.log(selDest);

  const dest_ID = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "bb88b3578amshbde48eb8c9c4362p16d54ajsn742a14377936",
      "X-RapidAPI-Host": "booking-com.p.rapidapi.com",
    },
  };

  fetch(
    "https://booking-com.p.rapidapi.com/v1/hotels/locations?locale=en-gb&name=" +
      selDest,
    dest_ID
  )
    .then((response) => response.json())
    .then((response) => {
      console.log(response);

      //for loop to makesure dest_id is for the city searched
      for (i = 0; i < response.length; i++) {
        if (
          response[i].dest_type == "city" &&
          response[i].city_name == selDest
        ) {
          var dest_id = response[i].dest_id;
          console.log(`The dest id is: ${dest_id}`);
        }
      }
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "bb88b3578amshbde48eb8c9c4362p16d54ajsn742a14377936",
          "X-RapidAPI-Host": "booking-com.p.rapidapi.com",
        },
      };

      fetch(
        "https://booking-com.p.rapidapi.com/v2/hotels/search?units=metric&checkin_date=2023-07-15&dest_type=city&dest_id=" +
          dest_id +
          "&checkout_date=2023-07-16&order_by=popularity&filter_by_currency=AED&locale=en-gb&adults_number=2&room_number=1&include_adjacency=true&categories_filter_ids=SustainablePropertyFilter%3A%3A1&children_number=2&children_ages=5%2C0&page_number=0",
        options
      )
        .then((response) => response.json())

        .then((response) => {
          console.log(response);

          console.log("Your eco-friendly places to stay:");
        })
        .catch((err) => console.error(err));
    });
});

// // 4. Use API or data source to retrieve information on sustainable transportation options (public transportation, car rentals, carbon offset programs).

// // 5. Sort the transportation options by relevance.

// // 6. Display detailed information on each transportation option to the user, including cost, availability, and reviews.

// // 7. Calculate the estimated carbon emissions for the trip.

// // 8. Present the user with a list of carbon offset programs.

// // 9. Accept input from user on the selected carbon offset program.

// // 10. Record the carbon offset in the user's account.

// // Images in Hero section automatically are changing every 3 sec //
//  // Get the images in the carousel
//  var images = document.querySelectorAll('.slides img');

//  // Keep track of the current image
//  var currentImage = 0;

//  // Change the active image every 3 seconds
//  setInterval(function () {
//      // Remove the active class from the current image
//      images[currentImage].classList.remove('active');

//      // Increment the current image
//      currentImage = (currentImage + 1) % images.length;

//      // Add the active class to the new image
//      images[currentImage].classList.add('active');
//  }, 3000);

//  // To add an auto-typing effect to the text hero section, inside the <h1> tag //
//     new Typed('.typed-words', {
//         strings: ['be adventurous', 'be spontaneous', 'be mindful'],
//         typeSpeed: 70,
//         loop: true,
//     });
