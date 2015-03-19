$(document).ready(function() {
	/********** often used variables **********/
	var menu = $("#newmenu");
	var star = $("#star");
	var orange = $("#orange");
	var menuwidth = 200;
	
	/********** variables used for dragging **********/
	var clicking = false;
	var corr_top = 0, corr_left = 0;
	
	
	/********** show/hide menu **********/
	$(orange).dblclick(function() {
		if ($(menu).hasClass("hidden")) {
			showMenu();
		}
		else {
			hideMenu();
		}
	});
	
	/********** fix/unfix menu **********/
	$(star).click(function() {
		if ($(this).hasClass("fixed") == false) {
			// fix menu
			$(this).attr("src", "images/sticky_icon_off.png");
			$(this).addClass("fixed");
		}
		else {
			// unfix menu
			$(this).attr("src", "images/sticky_icon_on.png");
			$(this).removeClass("fixed");
		}
	});
	
	/********** dragging menu **********/
	$(menu).mousedown(function(evt){
		// set clicking = true if user clicked into menu
		clicking = true;
	    var offset = $(this).offset();
	    // overwrite x- and y-mouse-position (in menu element)
		corr_top = evt.pageY - offset.top;
		corr_left = evt.pageX - offset.left;
	});
	$(document).mouseup(function(){
		// set clicking = false if mouse is up
		clicking = false;
		// remove "active" class 
		$(menu).removeClass("active");
	});
	$(document).mousemove(function(evt){
		if (clicking == false) {
			return;
		}
	    $(menu).css("top", evt.pageY - corr_top).css("left", evt.pageX - corr_left).addClass("active");
	});
	
	/********** move menu to nearest side **********/ 
	$(menu).hover(
	function() {
		// while hovering
		$(this).stop();
		$(this).fadeTo("slow", 1);
	},
	function() {
		// mouse out
		
		// if menu isn't activated (dragging = active)
		if ($(this).hasClass("active") == false) {
			$(this).fadeTo("slow", 0.2);
			if ($(star).hasClass("fixed") == false) {
				// velocity of animation
				var vel = 3;
				
				// current position of menu
				var pos = $(this).position();
				var pos_left = pos.left;
				var pos_top = pos.top;
				
				// current size of window
				var win_width = $(window).width();
				var win_height = $(window).height();
				
				// current size of menu
				var elem_width = $(this).outerWidth();
				var elem_height = $(this).outerHeight();
				
				// compute distance to the left and to the bottom
				var pos_right = win_width - elem_width - pos_left;
				var pos_bottom = win_height - elem_height - pos_top;
				
				// find smallest distance and move menu to this side
				// top?
				if ((pos_top <= pos_left) && (pos_top <= pos_right) && (pos_top <= pos_bottom)) {
					$(this).animate({top: 0}, vel*pos_top);
				}
				// left?
				else if ((pos_left <= pos_right) && (pos_left <= pos_bottom)) {
					$(this).animate({left: 0}, vel*pos_left);
				}
				// right?
				else if (pos_right <= pos_bottom) {
					var pos_left = win_width - elem_width;
					$(this).animate({left: pos_left}, vel*pos_right); 
				}
				// bottom!
				else {
					var pos_top = win_height - elem_height;
					$(this).animate({top: pos_top}, vel*pos_bottom);
				}
			}
		}
	});
	
	/********** close menu and/or move it while resizing **********/
	$(window).resize(function(evt) {
		// widths and heights of window, element
		var win_width = $(this).width();
		var win_height = $(this).height();
		
		var elem_width = $(menu).outerWidth();
		var elem_height = $(menu).outerHeight();
		
		// current position of menu
		var offset = $(menu).offset();
		var pos_left = offset.left;
		var pos_top = offset.top;
		
		// if menu isn't fully displayed in window width
		if ((pos_left + elem_width) > win_width) {
			// if it is not closed: close it ...
			if ($(menu).hasClass("hidden") == false) {
				hideMenu();
			}
			// otherwise stick it to the left
			else {
				$(menu).css("left", win_width - elem_width);
			}
		}
		
		// if menu isn't fully displayed in window height
		if ((pos_top + elem_height) > win_height) {
			// if it is not closed: close it ...
			if ($(menu).hasClass("hidden") == false) {
				hideMenu();
			}
			// otherwise stick it to the bottom
			else {
				$(menu).css("top", win_height - elem_height);
			}
		}
	});
	
	/********** show menu **********/
	function showMenu() {
		var position = $(menu).position();
		// move menu a bit to the left if the full menu wouldn't be correctly displayed 
		if ((position.left + menuwidth) > $(window).width()) {
			$(menu).animate({left: $(window).width() - menuwidth}, "fast");
		}
		// move menu a bit to the top if the full menu wouldn't be correctly displayed
		if ((position.top + menuwidth) > $(window).height()) {
			$(menu).animate({top: $(window).height() - menuwidth}, "fast");
		}
		$("#menuwrap").animate({width: menuwidth, height: menuwidth},"slow");
		$(star).show("slow");
		$(menu).removeClass("hidden");
	}
	
	/********** hide menu **********/
	function hideMenu() {
		$("#menuwrap").animate({width: 0, height: 0}, "slow");
		$(star).hide("slow");
		$(menu).addClass("hidden");
	}
});