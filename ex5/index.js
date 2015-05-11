var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
/*
	Array of currently connected screens. It is pushed 
	to any new remote that joins the system.
*/
var connectedScreens = new Array();

app.use(express.static('public'));

io.on('connection', function(socket){
  /* When a new image is selected, the index is 
     emitted to the room of tuned devices */
  socket.on('img index', function(index){
	socket.to('tuned devices' + socket.id).emit('img index', index); 
  });
  
  /* When an user joins the system, his name and his 
     id are emitted, so that the remote can add it 
	 to the list. It is also added to the list of
	 connected screens. 
  */
  socket.on('device name', function(name){
    io.emit('device name', name, socket.id);
	var screen = new Object();
	screen.id = socket.id;
	screen.name = name;
	connectedScreens.push(screen);
	socket.join('screen room');
  });
  /*
	When a new remote joins the system, it receives 
	the list of connected screens.
  */
  socket.on('remote', function() {
	  io.to(socket.id).emit('connected screens', connectedScreens);
  });
  /* When a screen leaves the system, his id is emitted,
     so that the remote can remove it from the list*/
  socket.on('disconnect', function(){
    io.emit('user disconnected', socket.id);
	// Remove the screen from the list
	var newScreenArray = new Array();
	for(i = 0; i < connectedScreens.length; i++){
		var screen = connectedScreens[i];
		if(socket.id != screen.id)
			newScreenArray.push(screen);
	}
	connectedScreens = newScreenArray;
  });
  
  /*
	Event performed by the server when the remote
	requests to connect an user identified by id.
	This user is added to the room 'tuned devices'.
  */
  socket.on('tune device', function(id, currentImage) {
	  // Get the socket specified by id
	  var tunedSocket = io.sockets.connected[id];
	  // room name : 'tuned devices' + id of the remote
	  tunedSocket.join('tuned devices' + socket.id);
	  // Push the image to the newly connected user
	  io.to(id).emit('img index', currentImage);
	  // Notify that the tuning is completed
	  io.to(socket.id).emit('tuning completed', id);
  });
  socket.on('tune off', function(id) {
	  var tunedSocket = io.sockets.connected[id];
	  tunedSocket.leave('tuned devices');
	  io.to(id).emit('tune off');
	  // Notify that the 'tuning off' is completed
	  io.to(socket.id).emit('tuning off completed', id);
  });
});

http.listen(8080, function(){
    console.log('listening on *:8080');
});