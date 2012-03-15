
var socket = io.connect(socketIOUrl);

socket.on('connect', function(data) {
  var message = {
    'key': key,
    'type': 'monitor'
  };

  socket.emit('register', message, function(error, response) {
    if(error || response !== 'registered') {
      return;
    }

    socket.emit('watchables', function(error, response) {
      console.log(response);
    });
  });
});
