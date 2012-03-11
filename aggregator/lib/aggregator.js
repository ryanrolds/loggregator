

var express = require('express');
var io = require('socket.io');

var Collector = require('./collector');
var Monitor = require('./monitor');

module.exports = function() {
  var Server = function(port, key, callback) {
    var server = this;
    this.collectors = {};
    this.hostnames = [];
    this.monitors = {};

    var app = express.createServer();

    var ioOptions = {
      'log level': 1
    };
    var io = this.io = require('socket.io').listen(app, ioOptions);

    io.sockets.on('connection', function(socket) {
      // Allow registering
      socket.on('register', function(data, callback) {
        // Check the key
        if(data.key === key) {
          socket.set('authorized', true);
        } else {
          callback('invalid key');
          return socket.disconnect();
        }

        // Add collector/monitor
        if(data.type === 'collector') {
          server.addCollector(new Collector(server, data.hostname, data.watchables, socket));
        } else if(data.type === 'monitor') {
          server.addMonitor(new Monitor(server, socket));
        } else {
          // @TODO need to send an error that can be handled instead
          callback('invalid type');
          return socket.disconnect();
        }

        callback(null, 'registered');
      });

      // @TODO unregistering
    });

    app.listen(port, function() {
      if(callback) {
        callback(null, true);
      }
    });
  };

  Server.prototype.getWatchables = function() {
    var watchables = {
      'collectors': {}
    };
    
    server.collectors.forEach(function(k, v) {
      watchables.collectors[v.hostname] = Object.keys(v.watchables);
    });

    return watchables;
  };

  Server.prototype.addWatcher = function(hostname, watchable, monitor, callback) {
    if(!this.hostnames[hostname]) {
      throw new Error('Unknown collector');
    }

    this.hostnames[hostname].addWatcher(watchable, monitor, callback);
  };

  Server.prototype.addCollector = function(collector) {
    this.collectors[collector.socket.id] = collector;
    this.hostnames[collector.hostname] = collector;
  };

  Server.prototype.removeCollector = function(collector) {
    // @TODO remove collector
  };

  Server.prototype.addMonitor = function(monitor) {
    this.monitors[monitor.socket.id] = monitor;
  };

  Server.prototype.removeMonitor = function(monitor) {
    // @TODO remove monitor
  };

  return Server;
}();


