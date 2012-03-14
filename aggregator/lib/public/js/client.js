
var socket = io.connect(socketIOUrl);
socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});