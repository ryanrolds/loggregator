
var os = require('os');
var io = require('socket.io-client');
var FileNotify = require('filenotify');

module.exports = function() {
  var Collector = function Collector(files, url, key, callback) {
    var that = this;
    var watchers = {};

    this.key = key;
    this.files = files;

    var conn = this.conn = io.connect(url);

    // On connect register with server
    conn.on('connect', function() {
      that.register(callback);
    });

    // Start monitoring of a file/stream
    conn.on('start', function(data, callback) {
      if(!watchers[data.file]) {
        watchers[data.file] = new FileNotify(files[data.file]);
        watchers[data.file].on('data', function(lines) {
          that.conn.emit('lines', {
            'data': new Date().toUTCString(),
            'watchable': data.file,
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
        watchers[data.file].destroy();
      }

      if(callback) {
        callback(null, 'stopped')
      }
    });
  }; 

  Collector.prototype.register = function(callback) {
    var files = {};
    for(var f in this.files) {
      files[f] = {};
    }

    var data = {
      'hostname': os.hostname(),
      'watchables': files,
      'key': this.key,
      'type': 'collector'
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