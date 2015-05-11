var currentImage = 0; // the currently selected image
var imageCount = 7; // the maximum number of images available
var socket = io();

function showImage (index){
    // Update selection on remote
    currentImage = index;
    var images = document.querySelectorAll("img");
    document.querySelector("img.selected").classList.toggle("selected");
    images[index].classList.toggle("selected");

	socket.emit('img index', index);
}

function initialiseGallery(){
    var container = document.querySelector('#gallery');
    var i, img;
    for (i = 0; i < imageCount; i++) {
        img = document.createElement("img");
        img.src = "images/" +i +".jpg";
        document.body.appendChild(img);
        var handler = (function(index) {
            return function() {
                showImage(index);
            }
        })(i);
        img.addEventListener("click",handler);
    }

    document.querySelector("img").classList.toggle('selected');
}

document.addEventListener("DOMContentLoaded", function(event) {
    initialiseGallery();

    document.querySelector('#toggleMenu').addEventListener("click", function(event){
        var style = document.querySelector('#menu').style;
        style.display = style.display == "none" || style.display == ""  ? "block" : "none";
    });
    connectToServer();
});

function connectToServer(){
    
}
/* When a new screen is connected to the system, this 
   function is executed. 
   A new list item is added, containing the name of the 
   device and a button.
   */
socket.on('device name', function(name, id){
	$('#menu_list').append($('<li>').attr("id", id));
	$('#'+id).text(name);
	$('#'+id).append($('<button class = "pure-button" name = "connect_button">').text('Connect'));
	// Function to be performed on the click of this button
	$("#"+id+" > button").click(function() {
		if($(this).text() == 'Connect') {
			// Requests the server to add this device
			// to the room of tuned devices
			socket.emit('tune device', id);
		}
		else  {
			// Requests the server to remove this
			// device from the room of connected devices
			socket.emit('tune off', id);
		}
	});
});
/*  Once a device has been added to the room, the 
	button changes text */
socket.on('tuning completed', function(id) {
	$("#"+id+" > button").text('Disconnect');
});
/* Once a device has been removed from the room,
	the button changes text*/
socket.on('tuning off completed', function(id) {
	$("#"+id+" > button").text('Connect');
});
/* Once a device leaves the system, its name is 
	removed from the list */
socket.on('user disconnected', function(id) {
	$('#'+id).remove();
});

