
require('should');
var express = require('express');
var io = require('socket.io');

module.exports = function(callback) {
  var app = express.createServer()
  io = io.listen(app);

  app.listen(9069, callback);

  io.sockets.on('connection', function (socket) {
    socket.on('register', function (data, callback) {
      console.log('register');
      callback('registered');
    });
  });
}
