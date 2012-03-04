
var events = require('events');
var util = require('util');

var io = require('socket.io');

module.exports = function() {
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

      socket.on('lines', function(data) {
        that.emit('lines', data);
      });
    });
  };

  util.inherits(MockAggregator, events.EventEmitter);

  MockAggregator.prototype.start = function(topic, callback) {
    var payload = {
      'file': topic
    };

    this.socket.emit('start', payload, function(error, data) {
      callback(null, data);
    });
  };

  MockAggregator.prototype.stop = function(topic, callback) {
    var payload = {
      'file': topic
    };

    this.socket.emit('stop', payload, function(error, data) {
      callback(null, data);
    });
  };

  return MockAggregator;
}();
