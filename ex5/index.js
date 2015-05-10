var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', function(socket){
  socket.on('img index', function(index){
    io.emit('img index', index);
  });
});

http.listen(8080, function(){
    console.log('listening on *:8080');
});