
var fs = require('fs');

var async = require('async');

var MockAggregator = require('./mockAggregator');
var Aggregator = require('../../server');
var Collector = require('../../collector');

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

module.exports.beforeAggregator = function(callback) {
  async.waterfall(
    [
      function(callback) {
        var slogger = new Slogger(port, key, function() {
          callback(slogger);
        });
      },
      function(callback) {
        collector = new Collector(watchables, 'http://localhost:' + port, key, function(error, result) {
          if(error) {
            throw error;
          }

          result.should.be.true;
          callback(slogger, collector)
        });
      }
    ],
    callback
};

module.exports.beforeCollector = function(port, files, key, callback) {
  async.waterfall(
    [
      function(callback) {
        var aggregator = new MockAggregator(port, function() {
          callback(null, aggregator);
        });
      },
      function(aggregator, callback) {
        var client = new Collector(files, 'http://localhost:' + port, key, function() {
          callback(null, aggregator, client);
        });
      }
    ],
    callback
  );
};