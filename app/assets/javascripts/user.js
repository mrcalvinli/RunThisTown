//= require_self

// TODO: Find a place for everything in the function
function appendedElements() {
  $(".confirmRouteLink").append($('<span id = "profSuccessRoute" style = "color: #2eba3e; font-size: 20px; opacity: 0.5" class = "glyphicon glyphicon-ok profConfirmRoute"></span>'));
  $(".deleteRouteLink").append($('<span id = "profDeleteRoute" style = "color: #e6463d; font-size: 20px; opacity: 0.5" class = "glyphicon glyphicon-remove profDeleteRoute"></span>'));
  $(".removeRouteLink").append($('<span id = "profRemoveRoute" style = "color: #e6463d; font-size: 20px; opacity: 0.5" class = "glyphicon glyphicon-arrow-up profRemoveRoute"></span>'));

  if ($("#routesRunContainer").children().length == 0) {
    $("#routesRunContainer").append($("<div style = 'font-size: 14pt; height: 100%; text-align: center; '>You have not ran a route yet.  Click the check mark on any routes above that you've completed</div>"));
  }

  if ($("#routesToRunContainer").children().length == 0) {
    $("#routesToRunContainer").append($("<div style = 'font-size: 14pt; height: 100%; text-align: center; '>You have no pending routes.  Click the button above to create a new route!</div>"));
  }
// Stat template
  $(".statContainer").append('<div class = "stat"><p class = "statVal">Stat goes here</p><span class = "glyphicon glyphicon-search"></span></div>');
// Route template
  $(".routesRunContainer").append(
      '<div class = "profRouteEntry well well-sm">'
      + '<div style = "display: inline-block; width: 49%; ">'
      + '<p>Date: </p>'
      + '<p>Distance Traveled: </p>'
      + '<p>Start: </p>'
      + '<p>End: </p>'
      + '</div>'
      + '<div style = "display: inline-block; width: 49%; height: 100%; position: absolute; top: 0; ">'
      + '<legend><h4 style = "text-align: center; font-family: Sanchez Regular">Waypoints Visited:</h4></legend>'
      + '<div class = "wptsList">'
      + '<ol>'
      + '<li>Place</li>'
      + '<li>Place</li>'
      + '<li>Place</li>'
      + '<li>Place</li>'
      + '<li>Place</li>'
      + '<li>Place</li>'
      + '<li>Place</li>'
      + '<li>Place</li>'
      + '</ol>'
      + '</div>'
      + '</div>'
      + '</div>'
  );
}

var UserPageController = function() {

  /* Private variables */
  var private = {};
  var setPrivateVars = function() {}

  /* Helper functions */
  var helpers = (function() {

    function parseDateShort(rubyDate) {
      // 2014-01-28 08:25:48 UTC
      var yearMonthDay = rubyDate.substring(0, 10);
      var year = yearMonthDay.substring(0, 4);
      var month = yearMonthDay.substring(5, 7);
      var day = yearMonthDay.substring(8, 10);
      return month + "/" + day + "/" + year;
    }

    function createVisualizationData() {
      visualizationData = [[]];
      $("#routesRunContainer .profRouteEntry .profRouteDistanceVal").each(function(i) {
        var date = $(this).parent().parent().parent().children(".profWaypointsContainer").children(".profRouteDate").children(".profRouteDateVal").html();
        var shortDate = parseDateShort(date);
        // $(this).parent().parent().parent().children(".profWaypointsContainer").children(".profRouteDate").children(".profRouteDateVal").html(shortDate);
        if ($(this).html() != "") {
          thisDistance = parseFloat($(this).html());
          visualizationData[0].push({"y": thisDistance, "x": shortDate});
        }

      });
      return visualizationData;
    }

    function updateStats() {
      var totalDistanceTraveled = 0;
      $("#routesRunContainer .profRouteEntry .profRouteDistanceVal").each(function(i) {
        if ($(this).html() != "") {
          totalDistanceTraveled += parseFloat($(this).html());
        }
      });
      totalDistanceTraveled = Math.round(totalDistanceTraveled * 100) / 100;
      $("#totalDistanceStat").html(totalDistanceTraveled.toString() + " mi");

      visualizationData = [[]];
      longestRun = 0;
      $("#routesRunContainer .profRouteEntry .profRouteDistanceVal").each(function(i) {
        var date = $(this).parent().parent().parent().children(".profWaypointsContainer").children(".profRouteDate").children(".profRouteDateVal").html();
        var shortDate = helpers.parseDateShort(date);
        // $(this).parent().parent().parent().children(".profWaypointsContainer").children(".profRouteDate").children(".profRouteDateVal").html(shortDate);
        if ($(this).html() != "") {
          thisDistance = parseFloat($(this).html());
          if (thisDistance > longestRun) {
            longestRun = thisDistance;
          }
          visualizationData[0].push({"y": thisDistance, "x": shortDate});
        }

      });
      longestRun = Math.round(longestRun * 100) / 100;
      $("#longestRunStat").html(longestRun.toString() + " mi");

      var totalCalBurned = 0;
      $("#routesRunContainer .profRouteEntry .profCaloriesBurnedVal").each(function(i) {
        if ($(this).html() != "") {
          totalCalBurned += parseInt($(this).html());
        }
      });
      $("#totalCalStat").html(totalCalBurned.toString() + " cal");

      if (visualizationData[0].length < 2) {
        $("#toggleRouteVisualization").css("display", "none");
        $("#routeVisualizationContainer").css("height", "0");
      } else {
        $("#toggleRouteVisualization").css("display", "block");

      }
    }

    function createChart() {
      visualizationData = createVisualizationData();
      $("#routeVisualizationContainer").html("");
      if (visualizationData[0].length >= 1) {
        var outerWidth = $("#routeVisualizationContainer").width();
        var outerHeight = 500;

        var margin = {top: 40, right: 20, bottom: 80, left: 80};

        var chartWidth = outerWidth - margin.left - margin.right;
        var chartHeight = outerHeight - margin.top - margin.bottom;

        var stack = d3.layout.stack();
        //var stack = d3.layout.partition(); //left it as stack for simplicity
        var stackedData = stack(visualizationData);

        var yStackMax = d3.max(stackedData, function(layer){return d3.max(layer, function(d){return d.y + d.y0;});});

        var yGroupMax = d3.max(stackedData, function(layer){return d3.max(layer, function(d){return d.y;});});

        var xScale = d3.scale.ordinal().domain(d3.range(visualizationData[0].length)).rangeBands([0, chartWidth]);
        var yScale = d3.scale.linear().domain([0, yStackMax]).range([chartHeight, 0]);


        var grouped = false;

        var topIndex = 3;


        var chart = d3
          .select("#routeVisualizationContainer") // equivalent to jQuery $("") selector
          .append("svg") // Here we are appending divs to what we selected
          .attr("class", "chart").attr("height", outerHeight).attr("width",outerWidth)
          .append("g") // group element
          .attr("transform", "translate(" + margin.left + "," + margin.top +")")
        //.on("click", function(){ grouped ? shrinkWindow() : expandWindow();});
        // Same as jQuery

        // adds lines
        chart.selectAll("line").data(yScale.ticks(10)).enter().append("line")
          .attr("x1", 0).attr("x2", chartWidth).attr("y1", yScale).attr("y2", yScale);

        // adds labels to y axis

        chart.selectAll("text").data([visualizationData[0][0]["x"], visualizationData[0][visualizationData[0].length - 1]["x"]]).enter().append("text")
          .attr("class", "xScaleLabel")
          .attr("x", function(d, i){if (i == 0) {return 101; } else {return 675; }})
          .attr("y", 460)
          .attr("dx", "0.3em")
          .attr("dy", -margin.bottom/visualizationData[0].length)
          .attr("text-anchor", "end")
          .text(String);

        chart.selectAll("text").data(yScale.ticks(10)).enter().append("text")
          .attr("class", "yScaleLabel")
          .attr("x", 0)
          .attr("y", yScale)
          .attr("dx", -margin.left/8)
          .attr("dy", "0.3em")
          .attr("text-anchor", "end")
          .text(String);



        var layerGroups = chart.selectAll(".layer").data(stackedData).enter()
          .append("g")
          .attr("class", "layer");

        chart.append("g")
          .attr("class", "y axis")
          .call(yScale)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "-55px")
          .attr("dx", "-150px")
          .style("text-anchor", "end")
          .text("Miles Run");

        for (var i; i<=3; i++){
          chart.selectAll(".layer").attr("class", "layer" + i);
        }

        var rects = layerGroups.selectAll("rect").data(function(d){ return d;}).enter().append("rect")
          .attr("x", function(d, i) {return xScale(i);})
          .attr("y", function(d) {return yScale(d.y0+d.y);})
          .attr("width", xScale.rangeBand)
          .attr("height", function(d){return yScale(d.y0) - yScale(d.y0 + d.y);})
          .attr("class", "rect");
      }
    }

    function updateData() {
      updateStats();
      createChart();
    }

    function successClick(current) {
      var routeId = parseInt(current.attr("id").split("-")[1]);

      var startAddress = current.parent().parent().children(".profRunRouteInfo").children(".profRouteStart").children("span").html();
      var endAddress = current.parent().parent().children(".profRunRouteInfo").children(".profRouteEnd").children("span").html();
      var wptAddresses = [];
      current.parent().parent().children(".profWaypointsContainer").children(".wptsList").children("ol").children("li").each(function() {
        wptAddresses.push(current.html());
      });

      var currentRoute = current.parent().parent();
      current.remove();

      currentRoute.remove();
      $("#routesRunContainer").append(currentRoute);
      currentRoute.children(".profConfirmOrDeny").children(".profDeleteRoute").attr("class", "glyphicon glyphicon-arrow-up profRemoveRoute").attr("id", "Rroute-" + routeId).attr("data-toggle", "").attr("data-target", "");

      // backend stuff goes here, use startAddress, endAddress, and wptAddresses //
      $.ajax({
        beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
        url: '/update_route',
        type: 'POST',
        dataType: 'JSON',
        data: {
          route_id: routeId,
          has_ran: true
        },
        success: function(data, textStatus) {
          console.log("success has_ran!");
        }
      });
    }

    function deleteClick(current) {
      var routeId = parseInt(current.attr("id").split("-")[1])

      var startAddress = current.parent().parent().children(".profRunRouteInfo").children(".profRouteStart").children("span").html();
      var endAddress = current.parent().parent().children(".profRunRouteInfo").children(".profRouteEnd").children("span").html();
      var wptAddresses = [];
      current.parent().parent().children(".profWaypointsContainer").children(".wptsList").children("ol").children("li").each(function() {
        wptAddresses.push($(this).html());
      });
      var currentRoute = current.parent().parent();

      currentRoute.remove();

      // backend stuff goes here, use startAddress, endAddress, and wptAddresses
      $.ajax({
        beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
        url: '/destroy_route',
        type: 'POST',
        dataType: 'JSON',
        data: {
          route_id: routeId
        },
        success: function(data, textStatus) {
          console.log("success delete!");
        }
      });
    }

    function removeClick(current) {
      var routeId = parseInt(current.attr("id").split("-")[1])

      var startAddress = current.parent().parent().children(".profRunRouteInfo").children(".profRouteStart").children("span").html();
      var endAddress = current.parent().parent().children(".profRunRouteInfo").children(".profRouteEnd").children("span").html();
      var wptAddresses = [];
      current.parent().parent().children(".profWaypointsContainer").children(".wptsList").children("ol").children("li").each(function() {
        wptAddresses.push(current.html());
      });
      var currentRoute = current.parent().parent();
      currentRoute.children(".profConfirmOrDeny").html('<span id = "Croute-' + routeId + '" style = "color: #2eba3e; font-size: 20px; opacity: 0.5" class = "glyphicon glyphicon-ok profConfirmRoute"></span><span id = "Droute-' + routeId + '" style = "color: #e6463d; font-size: 20px; opacity: 0.5; margin-left: 3px; " class = "glyphicon glyphicon-remove profDeleteRoute" data-toggle="modal" data-target="#profDeleteConfirmModal"></span>');
      currentRoute.remove();
      $("#routesToRunContainer").append(currentRoute);

      // backend stuff goes here, use startAddress, endAddress, and wptAddresses
      $.ajax({
        beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
        url: '/update_route',
        type: 'POST',
        dataType: 'JSON',
        data: {
          route_id: routeId,
          has_ran: false
        },
        success: function(data, textStatus) {
          console.log("success has_not_ran!");
        }
      });
    }

    return {
      parseDateShort: parseDateShort,
      createVisualizationData: createVisualizationData,
      updateStats: updateStats,
      createChart: createChart,
      updateData: updateData,
      successClick: successClick,
      deleteClick: deleteClick,
      removeClick: removeClick
    }
  })();

  /* UserPageController initializer */
  function init() {
    console.log("UserPageController initialized");
    eventHandlers();

    helpers.updateData();

    appendedElements();
  }

  /* Handles UserPage events */
  function eventHandlers() {

    $("#routeContainer").on({
      mouseenter: function() {
        $(this).css("opacity", 1);
      },
      mouseleave: function() {
        $(this).css("opacity", 0.5);
      }
    }, ".profConfirmRoute, .profDeleteRoute, .profRemoveRoute");

    $("#goalsPlus").on("click", function() {
      var buttonHeight = parseInt($("#newGoalBtn").css("height")) + parseInt($("#newGoalContainer").css("padding")) + parseInt($("#newGoalContainer").css("padding"));
      $("#newGoalContainer").css("border-top", "1px solid grey");
      $("#newGoalContainer").animate({"height": buttonHeight, "padding-bottom": "5px"}, 300);
    });

    $("#routesRunContainer").on("click", function() {
      if ( $(this).css("height") == "40px" ) {
        $(this).css("height", "auto");
      } else {
        $(this).css("height", "40px");
      }
    }, ".profRouteEntry");

    $("#profPicCont").on({
      mouseenter: function() {
        $("#profPicCover").css("opacity", 1);
      },
      mouseleave: function() {
        $("#profPicCover").css("opacity", 0);
      }
    });

    $("#toggleRouteVisualization").on("click", function() {
      var routeVisualizationContainer = $("#routeVisualizationContainer");
      if (routeVisualizationContainer.height() == 0) {
        routeVisualizationContainer.animate({"height": "500px"}, 500);
      } else {
        routeVisualizationContainer.animate({"height": "0px"}, 500);
      }
    });

    // Route completed
    $(".routeContainer").on("click", function() {
      helpers.successClick($(this));
      helpers.updateData();
    }, ".profConfirmRoute");

    // Route deleted
    $("#profDeleteConfirmModal").on("click", function() {
      helpers.deleteClick($(this));
      helpers.updateData();
    }, "#profConfirmDeleteRoute");

    // Route sent back to routes to run
    $(".routeContainer").on("click", function() {
      helpers.removeClick($(this));
      helpers.updateData();
    }, ".profRemoveRoute");

    // Tooltips
    $("#totalDistIcon").tooltip({"placement": "right"});
    $("#totalCalIcon").tooltip({"placement": "right"});
    $("#longestRunIcon").tooltip({"placement": "right"});
  }

  return {
    init: init
  }
}