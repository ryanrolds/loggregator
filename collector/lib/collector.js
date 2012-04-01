
var os = require('os');
var io = require('socket.io-client');
var FileNotify = require('filenotify');
var LoremIpStream = require('loremipstream');

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
  conn.on('watch', function(data, callback) {
    console.log('watch', arguments);
    if(!watchers[data.file]) {
      var file = files[data.file];
      if(file !== '__loremipsum') {
        watchers[data.file] = new FileNotify(files[file]);
      } else { 
        var lorem = new LoremIpStream({
          dataSize: 100,
          dataInterval: 1000
        });
        lorem.setEncoding('utf8');

        watchers[data.file] = lorem;
      }

      watchers[data.file].on('data', function(lines) {
        that.conn.emit('data', {
          'date': new Date().toUTCString(),
          'watchable': data.file,
          'lines': lines
        });
      });
    }

    if(callback) {
      callback(null, 'watching')
    }
  });

  // Stop monitoring of a file/stream
  conn.on('unwatch', function(data, callback) {
    if(watchers[data.file]) {
      watchers[data.file].destroy();
      delete watchers[data.file];
    }

    if(callback) {
      callback(null, 'unwatched')
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
      callback(null, result);
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

Collector.prototype.disconnect = function() {
  this.conn.disconnect();
};

module.exports = Collector;
