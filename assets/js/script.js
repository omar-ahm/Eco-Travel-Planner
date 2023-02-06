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
var hotel_info = [];
var count = -1;
var fetches = [];
var imageUrl = [];

//sustainability ratings
bronze = $("<img>")
  .attr("src", "assets/images/Bronze.png")
  .addClass("sus-rating");
silver = $("<img>")
  .attr("src", "assets/images/Silver.png")
  .addClass("sus-rating");
gold = $("<img>").attr("src", "assets/images/Gold.png").addClass("sus-rating");

var hotel_name = $(".form").on("submit", function (event) {
  $(event.preventDefault());
  //selected destination from user
  var selDest = $("#endDest option:selected").text();
  console.log(selDest);
  //1st API call for destination ID
  const dest_ID = {
    //5de
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "",
      "X-RapidAPI-Host": "booking-com.p.rapidapi.com",
    },
  };

  fetch(
    "https://booking-com.p.rapidapi.com/v1/hotels/locations?locale=en-gb&name=" +
      selDest,
    dest_ID
  )
    .then((response1) => response1.json())
    .then((response1) => {
      console.log(response1);

      //for loop to makesure dest_id is for the city searched
      for (i = 0; i < response1.length; i++) {
        if (
          response1[i].dest_type == "city" &&
          response1[i].city_name == selDest
        ) {
          var dest_id = response1[i].dest_id;
          console.log(`The dest id is: ${dest_id}`);
        }
      }
      //2nd API to search sustainable hotel options
      const searchHotels = {
        method: "GET",
        // 5de
        headers: {
          "X-RapidAPI-Key":
            "",
          "X-RapidAPI-Host": "booking-com.p.rapidapi.com",
        },
      };

      fetch(
        "https://booking-com.p.rapidapi.com/v2/hotels/search?units=metric&checkin_date=2023-07-15&dest_type=city&dest_id=" +
          dest_id +
          "&checkout_date=2023-07-16&order_by=popularity&filter_by_currency=AED&locale=en-gb&adults_number=2&room_number=1&include_adjacency=true&nflt=SustainablePropertyFilter%3D1",
        searchHotels
      )
        .then((response2) => response2.json())

        .then((response2) => {
          console.log("Your eco-friendly places to stay:");
          console.log(response2);
          response2.results.forEach(function (i) {
            hotel_id.push(i.id);

            imageUrl.push({ name: i.name, image: i.photoMainUrl });
          });
          console.log(hotel_id);
          console.log(imageUrl);
          for (i = 0; i < 3; i++) {
            id = hotel_id[i];
            console.log(id);
            setTimeout(getHotelInfo(id), 1000);

            function getHotelInfo(id) {
              const hotelInfo = {
                method: "GET",
                headers: {
                  //5de
                  "X-RapidAPI-Key":
                    "",
                  "X-RapidAPI-Host": "booking-com.p.rapidapi.com",
                },
              };
              fetches.push(
                fetch(
                  "https://booking-com.p.rapidapi.com/v2/hotels/details?locale=en-gb&hotel_id=" +
                    id +
                    "&currency=AED&checkout_date=2023-07-16&checkin_date=2023-07-15",
                  hotelInfo
                )
                  .then((response3) => response3.json())
                  .then((response3) => {
                    console.log(response3);
                    count += 1;
                    console.log(count);
                    if (response3.sustainability) {
                      hotelDetails = {
                        hotel_name: response3.hotel_name,
                        room_desc: response3.urgency_room_string,
                        sus_rating:
                          response3.sustainability.sustainability_page.tier,
                        url: response3.url,
                      };
                      console.log(hotelDetails);
                      hotel_info.push(hotelDetails);
                    }
                  })
              );
              // .catch((err) => console.error(err));
            }
          }
          Promise.all(fetches).then(function () {
            for (i = 0; i < imageUrl.length; i++) {
              hotelName = imageUrl[i].name;
              hotelImage = imageUrl[i].image;
              for (j = 0; j < hotel_info.length; j++) {
                if (hotelName == hotel_info[j].hotel_name) {
                  hotel_info[j].image = hotelImage;
                }
              }
            }
            console.log(hotel_info);
            renderHTML();
            hotel_id.splice(0, 100000);
            hotel_info.splice(0, 100000);
            function renderHTML() {
              for (i = 0; i < hotel_info.length; i++) {
                if (hotel_info[i].sus_rating === "bronze") {
                  susRating = bronze;
                } else if (hotel_info[i].sus_rating === "silver") {
                  susRating = silver;
                } else {
                  susRating = gold;
                }

                var hotelCard = $("<div>").addClass("card mx-auto mt-3 hotel");
                var hotelGridRow = $("<div>").addClass("row");
                var hotelBsCol1 = $("<div>").addClass(
                  "col-sm-12 col-md-5 col-lg-3"
                );
                var hotelImg = $("<img>")
                  .attr("src", hotel_info[i].image)
                  .addClass("hotel-img m-2");
                var hotelBsCol2 = $("<div>").addClass(
                  "hotel-description col-sm-12 col-md-7 col-lg-9"
                );
                var hotelName = $("<h4>")
                  .addClass("mt-2 ml-1")
                  .text(hotel_info[i].hotel_name);
                var hotelRoom = $("<p>")
                  .text("Rooms Available:")
                  .addClass("ml-1 mb-0 room-desc");
                var hotelRoomDesc = $("<p>")
                  .text(hotel_info[i].room_desc)
                  .addClass("ml-1 mt-1 room-desc");
                var bookingButt = $("<div>")
                  .addClass("mb-2 mr-2 ml-1 d-flex justify-content-end")
                  .append(
                    $("<a>")
                      .attr("href", hotel_info[i].url)
                      .append(
                        $("<button>")
                          .attr({ type: "button", class: "btn btn-primary" })
                          .text("See Availability")
                      )
                  );
                hotelBsCol2.append(
                  hotelName,
                  susRating,
                  hotelRoom,
                  hotelRoomDesc,
                  bookingButt
                );
                hotelBsCol1.append(hotelImg);
                hotelGridRow.append(hotelBsCol1, hotelBsCol2);
                hotelCard.append(hotelGridRow);
                mainCardBody.append(hotelCard.clone());
              }
            }
          });
        })

        .catch((err) => console.error(err));
    });

  hotelSec = $(".hotel-rec");
  hotelSec.empty();
  //following code to add section heading to page.
  secHeading = $("<h2>");
  secHeading.addClass("sectionHeading");
  secHeading.text("Sustainable Hotels");
  hotelSec.append(secHeading);
  //conatiner sizing
  bsGrid1 = $("<div>").addClass("row");
  bsGrid1col = $("<div>").addClass("col-10 mx-auto");
  bsGrid1.append(bsGrid1col);

  mainCard = $("<div>");
  mainCard.addClass("card");
  mainCardHead = $("<div>");
  mainCardHead
    .append("<div>")
    .addClass("card-header")
    .append(
      $("<strong>").text("Here are your recommendations:").addClass("title")
    );

  mainCardBody = $("<div>").attr({ class: "card-body", id: "hotels-section" });

  mainCard.append(mainCardHead, mainCardBody);
  bsGrid1col.append(mainCard);
  hotelSec.append(bsGrid1);
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
