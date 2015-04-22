$(document).ready(function() {
	var map = { "img1" : 1, "img2" : 2, "img3" : 3 , "img4" : 4}
	var map_info = { "img1" : "ETH Terrasse", "img2" : "ETH Main Building, interior", "img3" : "ETH Main Building", "img4" : "ETH Main Building 2"}
	
	var visibleImg = false;
	
	$('#big_img').hide();
	
	var upFlag = false;
	var startTime = 0;
	var visibleText = false;
	
	// *********** IMAGE SELECTION *************
	
	$("#touch").tiltandtap({
		onTiltRight    : changeSelectionRight,
		onTiltLeft 	   : changeSelectionLeft,
		onTiltUp    : setStartTime,
		onTiltDown  : checkUpDownMotion,
		tiltUp    : { onTiltUp: showImage, interaction : {type: "press", element: "touch"}},
		tiltDown  : { onTiltDown: hideImage, interaction : {type: "press", element: "touch"}},
	});
	
	function changeSelectionRight ()
	{
		var index = $(".selected").parent().index();
		var th = $('#thumbs-block').children();
		if(index != $('#thumbs-block').children().length -1) {
			$(".selected").removeClass("selected");
			var children = $('#thumbs-block').children();
			var child = children[index+1].children[0].id;
			$('#'+child).addClass("selected");
			$('#'+child).removeClass("notselected");
		}
		if(visibleImg) showImage();
		updateText();
	}
	function changeSelectionLeft ()
	{
		var index = $(".selected").parent().index();
		var th = $('#thumbs-block').children();
		if(index != 0) {
			$(".selected").removeClass("selected");
			var children = $('#thumbs-block').children();
			var child = children[index-1].children[0].id;
			$('#'+child).addClass("selected");
			$('#'+child).removeClass("notselected");
		}
		if(visibleImg) showImage();
		updateText();
	}
	
	// *********** BIGGER IMAGE *************
	
	$('#btn').click(function () {
		showImage();
	});
	
	function showImage () {
		var img = $(".selected").attr("src");
		$('#big_img').attr("src", img);
		$('#big_img').show();
		visibleImg = true;
	}
	function hideImage () {
		$('#big_img').hide();
		visibleImg = false;
	}
	
	// *********** BIGGER IMAGE *************
	
	function updateText() {
		var img = $(".selected").attr("src");
		img = img.replace("img/", "").replace(".jpg", "");
		$("#info").text(map_info[img]);
	}
	
	function setStartTime() {
		var d = new Date();
		startTime = d.getTime();
	}
	
	function checkUpDownMotion() {
		var d = new Date();
		var endTime = d.getTime();
		
		if ((endTime - startTime) <= 500) {
			updateText();
			$("#info").toggle();
		}
		startTime = 0;
	}
});