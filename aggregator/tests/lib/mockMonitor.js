
var os = require('os');
var events = require('events');
var util = require('util');

var io = require('socket.io-client');

module.exports = function() {
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

    conn.on('lines', function(data) {
      that.emit('lines', data);
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
        callback(null, true);
      }
    });
  };

  MockMonitor.prototype.watch = function(watchable, callback) {
    this.conn.emit('watch', watchable, function(error, result) {
      if(error) {
        if(callback) {
          return callback(error);
        } else {
          throw error;
        }
      }

      if(callback) {
        callback(null, true);
      }
    });

  };

  return MockMonitor;
}();