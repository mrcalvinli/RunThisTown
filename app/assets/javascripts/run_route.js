//= require_self

function RoutePlannerController() {

  var private = (function() {
    return {
      map: null, // Map is set in mapInitialize
      directionsDisplay: null,
      rendererOptions: null,

      orderType: 'custom',

      marker: null, 
      markerDict: {}, 

      pathArray: [],
      letterArray: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"], 
      letterIndex: 0, 

      routeInfoArray: [],
      distance: 0,
      distanceString: ""
    }
  })();

  var setPrivateVars = function() {
    private.marker = new google.maps.Marker({
      map: private.map
    });

    private.rendererOptions = {map: private.map, draggable: true};
    private.directionsDisplay = new google.maps.DirectionsRenderer(private.rendererOptions);
  }

  var helpers = (function() {
    function mapInitialize() {
      var mapOptions = {
        center: new google.maps.LatLng(51.505, -0.09),
        zoom: 15
      };
      private.map = new google.maps.Map(document.getElementById('map'), mapOptions);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          private.map.setCenter(initialLocation);
        })
      }
    }

    function createUrlAddress(location) {
      var address = location.toString();
      // Address ex: 1600 Amphitheatre Parkway, Mountain View, CA
      var addressArray = address.split(" ");
      var urlAddress = "";
      for (var i = 0; i < addressArray.length; i++){
        if (i != addressArray.length - 1) {
          urlAddress += addressArray[i] + "+";
        } else {
          urlAddress += addressArray[i];
        }
      }
      return urlAddress;
    }

    function computeTotalDistance(result) {
      var total = 0;
      var myroute = result.routes[0];
      for (var i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
      }
      private.distance = Math.round(total * 0.000621371 * 100) / 100;
      document.getElementById('routeLength').innerHTML = private.distance + ' mi';
    }

    function orderEntries(org, dest, wpts) {
      for (var i = 0; i < Object.keys(private.markerDict).length; i++) {
        var keysArray = Object.keys(private.markerDict);
        private.markerDict[keysArray[i]].setMap(null);
      }

      $(".entrySpan").each(function() {
        $(this).html("");
      });

      var request = {
        origin: org,
        destination: dest,
        waypoints: wpts,
        travelMode: google.maps.DirectionsTravelMode.WALKING
      };

      if (private.orderType = 'shortest') {
        request.optimizeWaypoints = true;
      } else if(private.orderType = 'custom') {
        request.optimizeWaypoints = false;
      }

      var directionsService = new google.maps.DirectionsService();
      directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          console.log("success");
          private.directionsDisplay.setDirections(response);

          if (private.orderType = 'shortest') {
            var wptsOrder = response["routes"][0]["waypoint_order"];
            for (var j = 0; j < wptsOrder.length; j++) {
              // [1, 2, 0]
              var thisLetterIndex = j + 1;
              var wptIndex = wptsOrder[j];
              var letterToChangeIndex = wptsOrder[j] + 1;
              var thisLetter = private.letterArray[thisLetterIndex];

              var letterToChange = private.letterArray[letterToChangeIndex];

              var newMarginTop = thisLetterIndex * 45;
              var newMarginTopString = newMarginTop.toString();
              var newMarginTopPxString = newMarginTopString + "px";

              $("#routeEntry-" + letterToChange).animate({"margin-top": newMarginTopPxString}, 500);
              $("#routeEntry-" + letterToChange + " .entrySpan").html(thisLetter);
              $("#routeEntry-" + letterToChange).attr("id", "#routeEntry-" + thisLetter);
            }
          } else if(private.orderType = 'custom') {
            
          }

          var legsArray = response["routes"][0]["legs"];
          var distanceInMeters = 0;
          for (var i in legsArray){
            var legDistance = parseFloat(legsArray[i]["distance"]["value"]);
            distanceInMeters += legDistance;
          }

          private.distance = Math.round(distanceInMeters * 0.000621371 * 100) / 100;
          private.distanceString = private.distance.toString() + " mi";
          $("#routeLength").html(private.distanceString);

          // create routeInfoArray
          if (private.routeInfoArray.length == 0) {
            for (var i in private.pathArray) {
              var currentLetter = private.letterArray[i];
              var address = $("#routeEntry-" + currentLetter + " input").val();
              var thisLat = private.pathArray[i][0]
              var thisLng = private.pathArray[i][1];
              var routeInfoEntry = [address, thisLat, thisLng];
              private.routeInfoArray.push(routeInfoEntry);
            }
          }

          for (var i = 0; i < private.letterIndex; i++) {
            $("#routeEntry-" + private.letterArray[i] + " .entrySpan").html(private.letterArray[i]);
          }

          document.getElementById("createRouteBtn").disabled = false;
          $(".deleteRouteEntry").css("display", "none");
          if (private.marker) {
            private.marker.setMap(null);
            private.marker = null;
          }
        } else {
          alert("failed to get directions");
        }
      });
    }

    return {
      mapInitialize: mapInitialize,
      createUrlAddress: createUrlAddress,
      computeTotalDistance: computeTotalDistance, 
      orderEntries: orderEntries
    }
  })();

  function init() {
    console.log('RoutePlannerController initialized');
    helpers.mapInitialize();
    setPrivateVars();

    eventHandlers();

    stylingJS();
  }

  function eventHandlers() {
    $("#customOrderBtn").on("click", function() {
      private.orderType = 'custom';
      $("#orderBtnDropdown").html('Order: Custom <span class="caret" style = "border-top: 4px solid white"></span>');
      $("#desiredDistanceCont").remove();
    });

    /* This does not exist right now */
    $("#autoOrderBtn").on("click", function() {
      private.orderType = 'auto';
      $("#orderBtnDropdown").html('Order: Auto <span class="caret" style = "border-top: 4px solid white"></span>');
      var desiredDistanceCont = $("<div id = 'desiredDistanceCont' style = 'font-size: 14pt; padding: 10px;'>Desired Distance: <input placeholder = 'Distance in miles' id = 'desiredLength' class = '' style = 'font-size: 15px; float: right; width: 50%;'></input></div>")
      $("#routeList").after(desiredDistanceCont);
    });

    $("#shortestPathOrderBtn").on("click", function() {
      private.orderType = 'shortest';
      $("#orderBtnDropdown").html('Order: Shortest Path <span class="caret" style = "border-top: 4px solid white"></span>');
      $("#desiredDistanceCont").remove();
    });

    $("#createLoopBtn").on("click", function() {
      $("#input").val($("#routeEntry-A .routeInput").val());
      addLocation($("#routeEntry-A .routeInput").val());
    });

    $("#addPointBtn").on("click", function() {
      if ($("#input").val() !== "" || $("#input").val() !== null) {
        var address = $("#input").val();
        var urlAddress = helpers.createUrlAddress(address);
      } else {
        console.log("No address given");
      }

      if (private.marker != null) {
        for (var i = 0; i < Object.keys(private.markerDict).length; i++) {
          var keysArray = Object.keys(private.markerDict);
          // var pinColor = "5B84EF"; // blue marker;
          var pinColor = "2eba3e"; // green marker;
          var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
                new google.maps.Size(21, 34),
                new google.maps.Point(0,0),
                new google.maps.Point(10, 34));
            if (keysArray[i] != "A") {
              private.markerDict[keysArray[i]].setIcon(pinImage);
            }
        }

        private.markerDict[private.letterArray[private.letterIndex]] = private.marker;
        for (var i = 0; i < Object.keys(private.markerDict).length; i++) {
          var keysArray = Object.keys(private.markerDict);
          var thisMarker = private.markerDict[keysArray[i]];
          // thisMarker.setMap(private.map);
        }

        $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address=' + urlAddress + '&sensor=false', function(json_data){
          if (json_data.results[0] === undefined) {
            alert("Could not find location; try again");
            private.markerDict[private.letterArray[private.letterIndex]].setMap(null);
            private.markerDict[private.letterArray[private.letterIndex]] = null;
            delete private.markerDict[private.letterArray[private.letterIndex]];
            console.log("Could not find location; try again");
          } else{
            var latLong = json_data.results[0].geometry.location;
            var lat = latLong.lat;
            var lng = latLong.lng;
            var entryClass = "";
            var letterClass = "";
            if (private.letterArray[private.letterIndex] == "A") {
              letterClass = "orgEntryLetter";
              entryClass = "orgEntry"
            } else {
              letterClass = "destEntryLetter";
              entryClass = "destEntry"
            }

            var center = new google.maps.LatLng(lat, lng);
              private.map.panTo(center);

            private.pathArray.push([lat, lng]);
            if (private.pathArray.length >= 2) {
              document.getElementById("clearRoute").disabled = false;
              document.getElementById("pathCreator").disabled = false;
              document.getElementById("createLoopBtn").disabled = false;
            }

            $(".destEntryLetter").each(function() {
              $(this).attr("class", "entryLetter wptsEntryLetter")
            });
            $(".destEntry").each(function() {
              $(this).attr("class", "routeEntry wptsEntry")
            })

            var marginTop = private.letterIndex * 45;
            var marginTopString = marginTop.toString() + "px";

            $("#routeList").append("<div style = 'margin-top: " + marginTopString + "' class = 'routeEntry " + entryClass + "' id = 'routeEntry-" + private.letterArray[private.letterIndex] + "'></div>");
            $("#routeEntry-" + private.letterArray[private.letterIndex]).append("<div class = 'entryLetter " + letterClass + "'>" + "<span class = 'entrySpan' id = 'entrySpan-" + private.letterArray[private.letterIndex] + "' style = 'margin-top: 3px; display: block'>" + "&bull;" /*private.letterArray[private.letterIndex] */ + "</span></div>");
            entryClass = "orgEntry"
            $("#routeEntry-" + private.letterArray[private.letterIndex]).append("<input class = 'controls routeInput'>");
            $("#routeEntry-" + private.letterArray[private.letterIndex]).append("<button type = 'button' class = 'close deleteRouteEntry' style = 'margin-top: 5px; padding-left; 5px'>&times;</button>")

            // Delete Button
            $("#routeEntry-" + private.letterArray[private.letterIndex] + " .close").on("click", function() {
              var thisLetter = $(this).parent().attr("id").toString()[11];
              private.markerDict[thisLetter].setMap(null);
              private.markerDict[thisLetter] = null;
              delete private.markerDict[thisLetter];
              var index = private.letterArray.indexOf(thisLetter);
              private.pathArray.pop(index);

              // replace old info with info from new letters
              var thisLetterIndex = private.letterArray.indexOf(thisLetter);
              var markerKeys = Object.keys(private.markerDict);
              for (var i = 0; i < markerKeys.length; i++) {
                var currentLetterIndex = private.letterArray.indexOf(markerKeys[i]);
                var currentLetter = private.letterArray[currentLetterIndex];
                var prevLetter = private.letterArray[currentLetterIndex - 1];
                if (currentLetterIndex > thisLetterIndex) {
                  private.markerDict[prevLetter] = private.markerDict[currentLetter];
                  delete private.markerDict[currentLetter];
                }
              }

              // remove animation
              $("#routeEntry-" + thisLetter).animate({"opacity": 0}, 300, function() {
                $("#routeEntry-" + thisLetter).first().remove();
              });


              function animateEntriesUp() {
                var index = private.letterArray.indexOf(thisLetter) + 1;
                var i = index;                     //  set your counter to 1

                function myLoop () {           //  create a loop function
                   setTimeout(function () {    //  call a 3s setTimeout when the loop is called
                        var currentLetter = private.letterArray[i];
                    $("#routeEntry-" + currentLetter).animate(
                      {"margin-top": parseInt($("#routeEntry-" + currentLetter).css("margin-top")) - 45},
                      300
                    );

                    i++;                     //  increment the counter
                    if (i < private.letterIndex) {            //  if the counter < 10, call the loop function
                     myLoop();             //  ..  again which will trigger another 
                    } else {
                      var newIndex = private.letterArray.indexOf(thisLetter) + 1;
                      for (var j = newIndex; j < private.letterIndex; j++) {
                        var currentLetter = private.letterArray[j];
                        $("#routeEntry-" + currentLetter).attr("id", "routeEntry-" + private.letterArray[j-1]);
                      }
                      private.letterIndex--;
                    }                     //  ..  setTimeout()
                   }, 150)
                }

                myLoop();  
              }

              setTimeout(animateEntriesUp(), 150);


            });

            $("#routeEntry-" + private.letterArray[private.letterIndex] + " .routeInput").val(address.toString());
            private.letterIndex++;

            // Remember that when deleting an element, you should also change the id of all the elements in front of it
          }


        });   
        private.marker = null;
      } else {
        alert("Invalid Point");
        console.log("marker is null");
      }
    });

    $("#pathCreator").on("click", function() {
      var org = null;
      var dest = null;
      var wpts = [];
      var newPathArray = [];

      $(".orgEntryLetter .entrySpan").html("A");
      $(".destEntryLetter .entrySpan").html(private.letterArray[private.letterIndex - 1]);

      (function getRouteInputInfo(j) {
        var address = $("#routeEntry-" + private.letterArray[j] + " .routeInput").val();
        var urlAddress = helpers.createUrlAddress(address);
        $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address=' + urlAddress + '&sensor=false', function(json_data){
          var latLong = json_data.results[0].geometry.location;
          var lat = latLong.lat;
          var lng = latLong.lng;

          if (j == 0) {
            org = new google.maps.LatLng(lat, lng);
          } else if (j == private.pathArray.length - 1) {
            dest = new google.maps.LatLng(lat, lng);
          } else {
            wpts.push({
              location: new google.maps.LatLng(lat, lng),
              stopover: true
            });
          }

          if (j >= private.pathArray.length - 1) {
            if (dest != null) {
              helpers.orderEntries(org, dest, wpts);
            } else {
              console.log('ERROR: dest is null');
            }
          } else {
            getRouteInputInfo(j + 1);
          }
        });
      })(0);
    });

    $("#clearRoute").on("click", function() {
      $("#routeList").html("");
      // Set markers to null and remove them
      private.pathArray = [];

      var markerKeys = Object.keys(private.markerDict);
      for (var i in markerKeys) {
        var key = markerKeys[i];
        private.markerDict[key].setMap(null);
        private.markerDict[key] = null;
      }
      private.markerDict = {};

      document.getElementById("clearRoute").disabled = true;
      document.getElementById("pathCreator").disabled = true;
      document.getElementById("createRouteBtn").disabled = true;
      document.getElementById("createLoopBtn").disabled = true;
      $("#routeLength").html("0 mi");
      $("#directionsList").html("");

      $(".deleteRouteEntry").css("display", "block");

      private.directionsDisplay.setMap(null);
      private.letterIndex = 0;

      private.marker = new google.maps.Marker({
        map:private.map
      });
      private.routeInfoArray = [];
    });

    $("#confirmRouteBtn").on("click", function() {
      // insert backend stuff here
      // send route data to server
      // go to profile page and highlight their new route

      //DO CHECKING FOR REPEATED SENDS AND PREVENT BAD BAD INFO SENDING
      var routeName = $("#routeNameInput").val();
      $.ajax({
        beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
        url: '/routeplanner_post',
        type: 'POST',
        data: {
          "name": routeName,
          "locations": private.routeInfoArray,
          "distance": private.distanceString
        },
        dataType: "json",
        success: function(data, textStatus){
          if (data.redirect) {
            window.location.href = data.redirect;
          } else {
            console.log("redirect failed");
          }
        },
        error: function(){
          console.log("error in json request");
        }
      });
    });

    /////////////////////////////////////////////////////////////////
    // Google Maps Listeners
    /////////////////////////////////////////////////////////////////

    /* Google Maps Direction Change Listener */
    var directionsChangedListener = (function() {
      private.directionsDisplay = new google.maps.DirectionsRenderer(private.rendererOptions);
      private.directionsDisplay.setPanel(document.getElementById('directionsList'));
      google.maps.event.addListener(private.directionsDisplay, 'directions_changed', function() {
        helpers.computeTotalDistance(private.directionsDisplay.getDirections());
      });
    })();

    /* Google Maps Autocomplete Listener */
    var addAutoComplete = (function() {
      // Add autocomplete
      var input = document.getElementById('input');
      var buttons = document.getElementById('buttonContainer');
      private.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
      private.map.controls[google.maps.ControlPosition.TOP_LEFT].push(buttons);
      var autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.bindTo('bounds', private.map);
      var infowindow = new google.maps.InfoWindow();

      google.maps.event.addListener(autocomplete, 'place_changed', function() {
        infowindow.close();
        if (private.marker != null) {
          private.marker.setVisible(false);
        }
        private.marker = new google.maps.Marker({
          map: private.map
        });

        var place = autocomplete.getPlace();
        if (!place.geometry) {
          return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          private.map.fitBounds(place.geometry.viewport);
        } else {
          private.map.setCenter(place.geometry.location);
          private.map.setZoom(17);  // Why 17? Because it looks good.
        }
        var pinColor = "e6463d";  // red
        if (Object.keys(private.markerDict).length == 0) {
          pinColor = "2eba3e"; // green
        }
        private.marker.setIcon(/** @type {google.maps.Icon} */({
          url: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
          size: new google.maps.Size(21, 34),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(10, 34)
        }));
        private.marker.setPosition(place.geometry.location);
        private.marker.setVisible(true);

        var address = '';
        if (place.address_components) {
          address = [
            (place.address_components[0] && place.address_components[0].short_name || ''),
            (place.address_components[1] && place.address_components[1].short_name || ''),
            (place.address_components[2] && place.address_components[2].short_name || '')
          ].join(' ');
        }

        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(private.map, private.marker);
      });
    })();

    /* Google Maps Map click listener */
    google.maps.event.addListener(private.map, 'click', function(e) {
      addLocation(e.latLng);
    });

    // Informative Tooltips /////////////////////////////////////////
    var tooltipsInit = (function() {
      $("#addPointBtn").tooltip({"placement": "bottom", "title": "Adds location in input box to route"});
      $("#createLoopBtn").tooltip({"placement": "bottom", "title": "Makes a new point, which is the same as your first point"});
      $("#orderBtnDropdown").tooltip({"placement": "top", "title": "Choose how you'd like the waypoints ordered"});
      $("#clearRoute").tooltip({"placement": "top", "title": "Clears all entries in your current route"});
      $("#pathCreator").tooltip({"placement": "left", "title": "Shows you what your route looks like"});
      $("#createRouteBtn").tooltip({"placement": "left", "title": "Confirm that you want to submit this route to your profile"});
    })();
  }

  function stylingJS() {
    $("#navHelpItem").attr('style', "display: block ");
    $("#map").css("height", ($(window).height() - $(".navbar").height));
    $("#locList").css("height", ($(window).height() - $(".navbar").height));

    $("#map").height($(window).height() - $(".navbar").height);
    $("#locList").height($(window).height() - $(".navbar").height);
  }

  function addLocation(location) {
    var urlAddress = helpers.createUrlAddress(location);
    $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address=' + urlAddress + '&sensor=false', function(json_data){
      var address = json_data.results[0].formatted_address;

      var latLong = json_data.results[0].geometry.location;
      var lat = latLong.lat;
      var lng = latLong.lng;

      $("#input").val(address.toString());
      if (private.marker != null) {
        private.marker.setMap(null);
        private.marker = null;
      }     

      var pinColor = "e6463d";  // red
      if (Object.keys(private.markerDict).length == 0) {
        pinColor = "2eba3e"; // green
      }

      var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
                                                  new google.maps.Size(21, 34),
                                                  new google.maps.Point(0,0),
                                                  new google.maps.Point(10, 34));

      private.marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: private.map,
        icon: pinImage,
      });
      $("#addPointBtn").click();
    }); 
  }

  return {
    init: init
  }
}
