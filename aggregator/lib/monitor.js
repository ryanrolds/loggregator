
var Monitor = function(parent, socket) {
  this.parent = parent;
  this.socket = socket;

  var that = this;
  socket.on('watchables', function(callback) {
    callback(null, that.parent.getWatchables(callback));
  });

  socket.on('watch', function(data, callback) {
    that.parent.addWatcher(data.hostname, data.watchable, that, callback);
  });

  socket.on('unwatch', function(data, callback) {
    that.parent.removeWatcher(data.hostname, data.watchable, that, callback);
  });

  socket.on('disconnect', function(data) {
    // @TODO Remove from monitors and update watcher lists
  });
};

Monitor.prototype.sendLines = function(data) {
  this.socket.emit('data', data);
};

module.exports = Monitor;
