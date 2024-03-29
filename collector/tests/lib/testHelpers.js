
var fs = require('fs');

var async = require('async');

var MockAggregator = require('./mockAggregator');
var Collector = require('../../');

module.exports.writeToFile = function(file, text) {
  fs.open(file, 'a', function(err, fd) {
    if(err) {
      throw err;
    }

    var buffer = new Buffer(text.length);
    buffer.write(text);

    fs.write(fd, buffer, 0, buffer.length, null, function(error, bytes, buffer) {
      fs.close(fd);
    });
  });
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