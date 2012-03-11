
module.exports = (function() {
  var Collector = function(parent, hostname, watchables, socket) {
    this.parent = parent;
    this.hostname = hostname;
    this.watchables = watchables;
    this.socket = socket;

    var that = this;
    socket.on('lines', function(data) {
      that.watchables[data.watchable].watchers.forEach(function(monitor) {
        data.hostname = this.hostname;
        monitor.sendLines(data);
      });
    });

    socket.on('unregister', function() {
      // @TODO Remove socket from listeners
    });

    socket.on('disconnect', function() {
      // @TODO Remove from list and notify clients of change
    });
  };

  Collector.prototype.addWatcher = function(toWatch, monitor, callback) {
    if(!this.watchables[toWatch]) {
      return callback('Unknown watchable');
    }

    var watchable = this.watchables[toWatch]

    if(!watchable.watchers) {
      watchable.watchers = [];
    }

    if(watchable.watchers.indexOf(monitor) === -1) {
      watchable.watchers.push(monitor);
    }

    if(watchable.watchers.length === 1) {
      this.startWatching(toWatch, callback);
    } else {
      callback(null, 'watching');
    }
  };

  Collector.prototype.removeWacher = function(toUnwatch, monitor, callback) {
    // @TODO unwatch
  };

  Collector.prototype.startWatching = function(toWatch, callback) {
    var data = {
      'file': toWatch
    };

    this.socket.emit('start', data, function(error, result) {
      callback(null, true);
    });
  };

  Collector.prototype.stopWatching = function(toUnwatch, callback) {
    // @TODO stop watching
  };

  return Collector;
})();