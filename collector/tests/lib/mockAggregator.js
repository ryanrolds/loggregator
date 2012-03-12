
var events = require('events');
var util = require('util');

var io = require('socket.io');

var MockAggregator = function(port, callback) {
  var options = {
    'log level': 1
  };

  var io = require('socket.io').listen(port, options, callback);

  var that = this;
  io.sockets.on('connection', function(socket) {
    that.socket = socket;
    socket.on('register', function(data, callback) {
      callback('registered');
    });

    socket.on('data', function(data) {
      that.emit('data', data);
    });
  });
};

util.inherits(MockAggregator, events.EventEmitter);

MockAggregator.prototype.start = function(topic, callback) {
  var payload = {
    'file': topic
  };

  this.socket.emit('watch', payload, function(error, data) {
    callback(null, data);
  });
};

MockAggregator.prototype.stop = function(topic, callback) {
  var payload = {
    'file': topic
  };

  this.socket.emit('unwatch', payload, function(error, data) {
    callback(null, data);
  });
};

module.exports = MockAggregator;
