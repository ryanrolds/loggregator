
var io = require('socket.io');

var Collector = require('./collector');
var Monitor = require('./monitor');

var Aggregator = function(app, key, namespace, callback) {
  var aggregator = this;
  this.collectors = {};
  this.hostnames = {};
  this.monitors = {};

  var options = {
    'log level': 1
  };

  this.io = io.listen(app, options);
  this.io.of('/' + namespace).on('connection', function(socket) {
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
        aggregator.addCollector(new Collector(aggregator, data.hostname, data.watchables, socket));
      } else if(data.type === 'monitor') {
        aggregator.addMonitor(new Monitor(aggregator, socket));
      } else {
        // @TODO need to send an error that can be handled instead
        callback('invalid type');
        return socket.disconnect();
      }

      callback(null, 'registered');
    });

    // @TODO unregistering
  });
};

Aggregator.prototype.getWatchables = function(callback) {
  var watchables = {
    'collectors': {}
  };

  for(var k in this.hostnames) {
    watchables.collectors[k] = Object.keys(this.hostnames[k].watchables);
  };

  callback(null, watchables);
};

Aggregator.prototype.addWatcher = function(hostname, watchable, monitor, callback) {
  if(!this.hostnames[hostname]) {
    throw new Error('Unknown collector');
  }

  this.hostnames[hostname].addWatcher(watchable, monitor, callback);
};

Aggregator.prototype.removeWatcher = function(hostname, watchable, monitor, callback) {
  if(!this.hostnames[hostname]) {
    throw new Error('Unknown collector');
  }

  this.hostnames[hostname].removeWatcher(watchable, monitor, callback);
};

Aggregator.prototype.addCollector = function(collector) {
  this.collectors[collector.socket.id] = collector;
  this.hostnames[collector.hostname] = collector;
};

Aggregator.prototype.removeCollector = function(collector) {
  // @TODO remove collector
};

Aggregator.prototype.addMonitor = function(monitor) {
  this.monitors[monitor.socket.id] = monitor;
};

Aggregator.prototype.removeMonitor = function(monitor) {
  // @TODO remove monitor
};

module.exports = Aggregator;