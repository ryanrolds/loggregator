
var fs = require('fs');

var async = require('async');

var Aggregator = require('../../');
var Collector = require('../../../collector');
var MockMonitor = require('./mockMonitor');

module.exports.writeToFile = function(file, text) {
  fs.open(file, 'a', function(err, fd) {
    if(err) {
      throw err;
    }

    var buffer = new Buffer(5);
    buffer.write(text);

    fs.write(fd, buffer, 0, 5, null, function(error, bytes, buffer) {
      fs.close(fd);
    });
  });
};

module.exports.afterAggregator = function(agg, coll, mon, callback) {
  mon.disconnect();
  coll.disconnect();
  agg.close();
  callback();
};

module.exports.beforeAggregator = function(port, watchables, key, namespace, callback) {
  var url = ['http://localhost:', port, '/', namespace].join('');
  async.waterfall(
    [
      function(callback) {
        var aggregator = new Aggregator(port, key, namespace, function() {
          callback(null, aggregator);
        });
      },
      function(aggregator, callback) {
        var collector = new Collector(watchables, url, key, function(error, result) {
          if(error) {
            throw error;
          }

          result.should.equal('registered');
          callback(null, aggregator, collector)
        });
      },
      function(aggregator, collector, callback) {
        var monitor = new MockMonitor(url, key, function(error, result) {
          callback(null, aggregator, collector, monitor);
        });
      }
    ],
    callback
  );
};