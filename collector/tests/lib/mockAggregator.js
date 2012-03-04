
var express = require('express');
var io = require('socket.io');

module.exports = function(callback) {
  var MockAggregator = function() {
    var app = express.createServer();
    io = io.listen(app);
    this.io = io;

    app.listen(9069, callback);

    var that = this;
    io.sockets.on('connection', function (socket) {
      that.socket = socket;
      socket.on('register', function (data, callback) {
        console.log('register');
        callback('registered');
      });
    });
  };

  MockAggregator.prototype.start = function(topic, callback) {
    that.socket.emit('start', {
      'file': topic
    }, callback);
  };

  return MockAggregator;
}();
