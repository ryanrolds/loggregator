

var express = require('express');
var io = require('socket.io');

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

          server.collectors[socket.id] = item;
          server.hostnames[item.hostname] = item;
          _bindCollectorEvents.call(server, socket);
        } else if(data.type === 'monitor') {
          server.monitors[socket.id] = item;
          _bindMonitorEvents.call(server, socket);
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

  var _bindCollectorEvents = function(socket) {
    var server = this;
    socket.on('unregister', function() {
      // Remove socket from listeners
    });
    
    socket.on('lines', function(data) {
      var collector = server.collectors[socket.id];

      collector.watchables[data.watchable].watchers.forEach(function(socket) {
        data.hostname = collector.hostname;
        socket.emit('lines', data);
      });
      // Sent lines out listeners
    });

    socket.on('disconnect', function() {
      // Remove from list and notify clients of change
    });
  };

  var _bindMonitorEvents = function(socket) {
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
      _addWatcher.call(server, data.hostname, data.watchable, this, callback);
    });

    socket.on('unwatch', function(data) {
      // Stop watching
    });

    socket.on('disconnect', function(data) {
      // Remove from monitors and update watcher lists
    });
  };

  var _addWatcher = function(hostname, toWatch, socket, callback) {
    if(!this.hostnames[hostname]) {
      throw new Error('Unknown collector');
    }

    var collector = this.hostnames[hostname];

    if(!collector.watchables[toWatch]) {
      throw new Error('Unknown watchable');
    }

    var watchable = collector.watchables[toWatch];

    if(!watchable.watchers) {
      watchable.watchers = [];
    }

    if(watchable.watchers.indexOf(socket) === -1) {
      watchable.watchers.push(socket);
    }

    if(watchable.watchers.length === 1) {
      var data = {
        'file': toWatch
      };

      collector.socket.emit('start', data, function(error, result) {
        callback(null, true);
      });
    } else {
      callback(null, true);
    }
  };

  var _removeWatcher = function(hostname, watchable, socket) {

  };

  return Server;
}();


