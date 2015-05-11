var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// Index  of the currently selected image
var idx = 0;

app.use(express.static('public'));

io.on('connection', function(socket){
  /* When a new image is selected, the index is 
     emitted to the room of tuned devices */
  socket.on('img index', function(index){
	socket.to('tuned devices').emit('img index', index);
	idx = index;
  });
  /* When an user joins the system, his name and his 
     id are emitted, so that the remote can add it 
	 to the list */
  socket.on('device name', function(name){
    io.emit('device name', name, socket.id);
  });
  /* When an user leaves the system, his id is emitted,
     so that the remote can remove it from the list*/
  socket.on('disconnect', function(){
    io.emit('user disconnected', socket.id);
  });
  /* Event performed by the server when the remote
	 requests to connect an user identified by id.
	 This user is added to the room 'tuned devices'.*/
  socket.on('tune device', function(id) {
	  // Get the socket specified by id
	  var tunedSocket = io.sockets.connected[id];
	  tunedSocket.join('tuned devices');
	  // Push the image to the newly connected user
	  socket.broadcast.to(id).emit('img index', idx);
	  // Notify that the tuning is completed
	  io.emit('tuning completed', id);
  });
  socket.on('tune off', function(id) {
	  var tunedSocket = io.sockets.connected[id];
	  tunedSocket.leave('tuned devices');
	  socket.broadcast.to(id).emit('tune off');
	  // Notify that the 'tuning off' is completed
	  io.emit('tuning off completed', id);
  });
});

http.listen(8080, function(){
    console.log('listening on *:8080');
});