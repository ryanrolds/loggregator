
module.exports = (function() {
  var Monitor = function(parent, socket) {
    this.parent = parent;
    this.socket = socket;

    var that = this;
    socket.on('listwatchables', function(data, callback) {
      callback(null, that.parent.getWatchables());
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
    this.socket.emit('lines', data);
  };

  return Monitor;
})();