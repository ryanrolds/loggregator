
var Collector = function(parent, hostname, watchables, socket) {
  this.parent = parent;
  this.hostname = hostname;
  this.watchables = watchables;
  this.socket = socket;

  var that = this;
  socket.on('data', function(data) {
    that.watchables[data.watchable].watchers.forEach(function(monitor) {
      data.hostname = that.hostname;
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

Collector.prototype.removeWatcher = function(toUnwatch, monitor, callback) {
  if(!this.watchables[toUnwatch]) {
    return callback('Unknown watchable');
  }

  var watchable = this.watchables[toUnwatch]

  var pos = watchable.watchers.indexOf(monitor);
  if(pos === -1) {
    return callback(null, 'unwatched');
  }

  watchable.watchers.splice(pos, 1);

  if(!watchable.watchers.length) {
    this.stopWatching(toUnwatch, callback);
  } else {
    callback(null, 'unwatched');
  }
};

Collector.prototype.startWatching = function(toWatch, callback) {
  var data = {
    'file': toWatch
  };

  this.socket.emit('watch', data, function(error, result) {
    // @TODO dry this out - look at addWatcher()
    callback(null, 'watching');
  });
};

Collector.prototype.stopWatching = function(toUnwatch, callback) {
  var data = {
    'file': toUnwatch
  };

  this.socket.emit('unwatch', data, function(error, result) {
    // @TODO dry this out - look at removeWatcher()
    callback(null, 'unwatched');
  });
};

module.exports = Collector;