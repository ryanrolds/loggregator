
var os = require('os');
var events = require('events');
var util = require('util');

var io = require('socket.io-client');

var MockMonitor = function(url, key, callback) {
  var that = this;
  this.key = key;

  var options = {
    'log level': 1
  };

  var conn = this.conn = io.connect(url);

  // On connect register with server
  conn.on('connect', function() {
    that.register(callback);
  });

  conn.on('disconnect', function() {
    // @TODO need to handle disconnect
  });

  conn.on('data', function(data) {
    that.emit('data', data);
  });
};

util.inherits(MockMonitor, events.EventEmitter);

MockMonitor.prototype.register = function(callback) {
  var data = {
    'hostname': os.hostname(),
    'key': this.key,
    'type': 'monitor'
  };

  // Register with aggregator
  this.conn.emit('register', data, function(error, result) {
    if(error) {
      if(callback) {
        return callback(error);
      } else {
        throw error;
      }
    }

    if(callback) {
      callback(null, result);
    }
  });
};

MockMonitor.prototype.watch = function(watchable, callback) {
  this.conn.emit('watch', watchable, callback);
};

MockMonitor.prototype.unwatch = function(data, callback) {
  this.conn.emit('unwatch', data, callback);
};

MockMonitor.prototype.watchables = function(callback) {
  this.conn.emit('watchables', callback);
};

MockMonitor.prototype.disconnect = function() {
  this.conn.disconnect();
};

module.exports = MockMonitor;
