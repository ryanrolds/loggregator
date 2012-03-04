
var os = require('os');
var io = require('socket.io-client');
var FileChanges = require('filechanges');

module.exports = function() {
  var Collector = function Collector(files, url, key, callback) {
    var conn = this.conn = io.connect(url);    
    var watchers = {};
    var that = this;

    // On connect register with server
    conn.on('connect', function() {
      that.register(callback);
    });

    // Start monitoring of a file/stream
    conn.on('start', function(data, callback) {
      if(!watchers[data.file]) {
        watchers[data.file] = new FileChanges(files[data.file]);
        watchers[data.file].on('data', function(lines) {
          conn.emit('lines', {
            'data': Date.UTC,
            'lines': lines
          });
        });
      }

      if(callback) {
        callback(null, 'started')
      }
    });

    // Stop monitoring of a file/stream
    conn.on('stop', function(data, callback) {
      if(watchers[data.file]) {
        watchers[data.file].unwatch();
      }

      if(callback) {
        callback(null, 'stopped')
      }
    });
  }; 

  Collector.prototype.register = function(callback) {
    var data = {
      'hostname': os.hostname(),
      'files': this.files,
      'key': this.key
    };

    // Register with aggregator
    this.conn.emit('register', data, function() {
      if(callback) {
        callback(null, true);
      }
    });
  };

  // Unregister with aggregator
  Collector.prototype.unregister = function() {
    var data = {
      'hostname': os.hostname()
    };
    this.conn.emit('unregister', data, function() {
      
    });
  };

  return Collector;
}();