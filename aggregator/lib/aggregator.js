

var express = require('express');
var io = require('socket.io');

module.exports = function() {
  var Server = function(port, key, callback) {
    var server = this;
    this.collectors = {};
    this.monitors = {};

    var app = express.createServer();

    var ioOptions = {
      'log level': 1
    };
    var io = require('socket.io').listen(app, ioOptions);

    app.listen(port, function() {
      if(callback) {
        callback(null, true);
      }
    });

    io.sockets.on('connection', function(socket) {
      // Allow registering
      socket.on('register', function(data, callback) {
        if(data.key === key) {
          socket.set('authorized', true);
        } else {
          callback('invalid key');
          return socket.disconnect();
        }

        var item = {
          'socket': socket
        };

        if(data.type === 'collector') {
          item.hostname = data.hostname;
          item.watchables = data.watchables;

          server.collectors[socket.io] = item;
          bindCollectorEvents.call(server, socket);
        } else if(data.type === 'monitor') {
          server.monitors[socket.io] = item;
          bindMonitorEvents.call(server, socket);
        } else {
          // @TODO need to send an error that can be handled instead
          callback('invalid type');
          return socket.disconnect();
        }

        callback(null, 'registered');
      });
    });

    this.io = io;
  }

  var bindCollectorEvents = function(socket) {
    var server = this;
    socket.on('unregister', function() {
      // Remove socket from listeners
    });
    
    socket.on('lines', function(lines) {
      // Sent lines out listeners
    });

    socket.on('disconnect', function() {
      // Remove from list and notify clients of change
    });
  };

  var bindMonitorEvents = function(socket) {
    var server = this;
    socket.on('listwatchables', function(data, callback) {
      // Get list of items that can watched
      var response = {
        'collectors': {}
      };

      server.collectors.forEach(function(k, v) {
        response.collectors[v.hostname] = Object.keys(v.watchables);
      });

      callback(null, response);
    });

    socket.on('watch', function(data, callback) {
      // Start watching

      callback(null, 'watching');
    });

    socket.on('unwatch', function(data) {
      // Stop watching
    });

    socket.on('disconnect', function(data) {
      // Remove from monitors and update watcher lists
    });
  };

  return Server;
}();


