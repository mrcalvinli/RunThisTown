var NavBarController = function() {
	
	/* Private variables */
	var private = (function() {})();

	/* Helper functions */
	var helpers = (function() {})();

	/* NavBarController initializer */
	function init() {
		console.log("NavBarController initialized");
		eventHandlers();
	}

	/* Handles NavBar events */
	function eventHandlers() {}

	/* Public Members */
	return {
		init: init
	}
}

function toolbarLoad() {
	var extraInfohtml = '<ul class="dropdown-menu" role="menu" style = "display: block; position: relative; border: none; box-shadow: none; margin-top: -8px;">'
	+ '<li role="presentation"><a role="menuitem" tabindex="-1" style = "cursor: pointer;" data-toggle="modal" data-target=".helpModal">Help</a></li>'
	+ '<li role="presentation" class="divider"></li>'
	+ '<li role="presentation"><a role="menuitem" tabindex="-1" style = "cursor: pointer;" >My Profile</a></li>'
	+ '<li role="presentation"><a role="menuitem" tabindex="-1" style = "cursor: pointer;" >Account Settings</a></li>'
	+ '<li role="presentation"><a role="menuitem" tabindex="-1" style = "cursor: pointer;" >Log Out</a></li>'
	+ '<li role="presentation" class="divider"></li>'
	+ '<li role="presentation"><a id = "creditsBtn" role="menuitem" tabindex="-1" style = "cursor: pointer;"  data-toggle="modal" data-target="#creditsModal">Credits</a></li>'
	+ '</ul>';
	/*$("#extraInfo").popover({'placement': 'bottom', 'html': true, 'content': extraInfohtml});
	$("#extraInfo").on("click", function() {
		var popoverRight = $(".popover").offset().left + $(".popover").width();
		if ( popoverRight > $(window).width() ) {
			var difference = popoverRight - $(window).width();
			$(".popover").css("left",  parseInt($(".popover").css("left")) - difference - 10 );
			$(".arrow").css("left", parseInt($(".arrow").css("left")) + difference + 10);
		}
	});*/
	/*$("#searchContainer").width($(window).width() 
		- parseInt($(".navbar-brand").css("width"))
		- parseInt($(".navbar .navbar-right").css("width")));*/

	/*$("#inputContainer").width($("#searchContainer").width()
		- parseInt($(".navbar .navbar-right").css("width")) - 3);*/

	/*$(window).resize(function() {
		$("#searchContainer").width($(window).width() 
			- parseInt($(".navbar-brand").css("width"))
			- parseInt($(".navbar .navbar-right").css("width")));

		$("#inputContainer").width($("#searchContainer").width()
			- parseInt($(".navbar .navbar-right").css("width")) - 3);
	});*/
}