// This is a manifest file that'll be compiled into landing.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require_self

var LandingPageController = function() {

  /* Private variables */
  var private = {}
  var setPrivateVars = function() {
    private.jumbotron = $(".jumbotron");
    private.infoSection1 = $("#infoSection1");
    private.infoSection2 = $("#infoSection2");
    private.infoSection3 = $("#infoSection3");
    private.sectionNav = $("#navigator")
  }
  /* Helper functions */
  var helpers = (function() {

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Sizing Helpers
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function sizingJS() {
      var mainHeight = $(window).height() - 60;
      private.jumbotron.css("height", mainHeight - 100);
      private.infoSection1.height(mainHeight);
      private.infoSection2.height(mainHeight);
      private.infoSection3.height(mainHeight);
      private.sectionNav.css("margin-top", (mainHeight/2) - private.sectionNav.height()/2 + 60 - 20)
                        .css("height", private.sectionNav.height())
                        .css("top", "-9999px")
                        .css("bottom", "-9999px")
                        .css("margin-top", "auto")
                        .css("margin-bottom", "auto");
      // $("#infoSection1 p").css("font-size", Math.ceil(mainHeight * $(window).width() / 40000));
      // $("#infoSection2 p").css("font-size", Math.ceil(mainHeight * $(window).width() / 40000));
      // $("#infoSection3 h2").css("font-size",  Math.ceil(mainHeight * $(window).width() / 40000));
      // $(".landingSection3Icon").css("height", (mainHeight - 440)/3);
      // $("#landingSection3Icon2").css("font-size", (mainHeight - 440)/3);
      // $("#landingSection3Icon3").css("font-size", (mainHeight - 440)/3);
    }

    function responsiveJS() {
      sizingJS()
      if ( $(window).width() < 1440 ){
        private.jumbotron.css("min-height", '793px');
      } else {
        private.jumbotron.css('min-height', '500px');
      }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Animation helpers
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function animateChevron() {
      $("#learnMoreChevron").animate({"margin-top": "10px"}, 750, 'linear', function() {
        $("#learnMoreChevron").animate({"margin-top": "0px"}, 750, 'linear');
      });
    }

    function animateSectionScroll(section) {
      var container = $("body"), scrollTo, scrollToVal;
      $(".nav_bullet").css("opacity", 0.5);
      if (section == 0) {
        scrollToVal = 60;
        $("#homeBullet").css("opacity", 1);
      } else {
        $("#navBullet" + section).css("opacity", 1);
        if (section == 1) {
          scrollTo = private.infoSection1;
        } else if (section == 2) {
          scrollTo = private.infoSection2;
        } else if (section == 3) {
          scrollTo = private.infoSection3;
        }
        scrollToVal = scrollTo.offset().top;
      } 

      container.animate({scrollTop: scrollToVal - 60}, 1500, "easeInOutQuint");
    }

    return {
      sizingJS: sizingJS,
      responsiveJS: responsiveJS,
      animateChevron: animateChevron, 
      animateSectionScroll: animateSectionScroll
    }
  })();

  /* LandingPageController initializer */
  function init() {
    console.log("LandingPageController initialized");
    setPrivateVars();
    eventHandlers();
    helpers.sizingJS();
    $(window).resize(function() {
      helpers.responsiveJS();
    });

    // Chevron animation
    helpers.animateChevron();
    var chevronInterval = setInterval(helpers.animateChevron, 1500);
  }

  /* Handles LandingPage events */
  function eventHandlers() {
    // Section Nav Events //
    private.sectionNav.on({
      mouseenter: function() {
        $(this).css("opacity", 1);
      }, 
      mouseleave: function() {
        $(this).css("opacity", 0.5);
      }
    }, ".nav_bullet");
    private.sectionNav.on({
      click: function() {helpers.animateSectionScroll(0)}
    }, "#homeBullet");
    private.sectionNav.on({
      click: function() { helpers.animateSectionScroll(1) }
    }, "#navBullet1");
    private.sectionNav.on({
      click: function() { helpers.animateSectionScroll(2) }
    }, "#navBullet2");
    private.sectionNav.on({
      click: function() { helpers.animateSectionScroll(3) }
    }, "#navBullet3");

    // Chevron Scroll Events //
    $("#learnMoreChevron").on("click", function() {
      helpers.animateSectionScroll(1);
    });
    $("#toHomeChevron").on("click", function() {
      helpers.animateSectionScroll(0);
    });
    $("#toSection2DownChevron").on("click", function() {
      helpers.animateSectionScroll(2);
    });
    $("#toSection1UpChevron").on("click", function() {
      helpers.animateSectionScroll(1);
    });
    $("#toSection3DownChevron").on("click", function() {
      helpers.animateSectionScroll(3);
    });
    $("#toSection2UpChevron").on("click", function() {
      helpers.animateSectionScroll(2);
    });

    // Modals //
    $("#getStarted").on("click", function() {
      $("#myModal").modal();
    });

    // Tooltips//
    $("#homeBullet").tooltip({placement: 'left'});
    $("#navBullet1").tooltip({placement: 'left'});
    $("#navBullet2").tooltip({placement: 'left'});
    $("#navBullet3").tooltip({placement: 'left'});
  }

  /* Public Members */
  return {
    init: init
  }
}
