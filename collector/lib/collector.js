
var os = require('os');
var io = require('socket.io-client');
var FileChanges = require('filechanges');

module.exports = function() {
  var Collector = function Collector(files, url, key) {
    var conn = io.connect(url);
    this.conn = conn;
    
    var watchers = {};

    var that = this;
    conn.on('connect', function() {
      var data = {
        'hostname': os.hostname(),
        'files': files,
        'key': key
      };

      conn.emit('register', data, function() {
        console.log(arguments);
      });
    });

    conn.on('start', function(data, callback) {
      if(!watchers[data.file]) {
        watchers[data.file] = new FileChanges(files[data.file]);
        watchers[data.file].on('data', function(lines) {
          conn.emit('lines', {
            'data': Date.UTC,
            'lines': lines
          });
        });

        if(callback) {
          callback('started')
        }
      }
    });

    conn.on('stop', function(data) {
      if(watchers[data.file]) {
        watchers[data.file].unwatch();
      }
    });
  }; 

  Collector.prototype.unregister = function() {
    var data = {
      'hostname': os.hostname()
    };
    this.conn.emit('unregister', data, function() {
      
    });
  };

  return Collector;
}();