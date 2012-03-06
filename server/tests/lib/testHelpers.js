
var fs = require('fs');

var async = require('async');

var Aggregator = require('../../');
var Collector = require('../../../collector');

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

module.exports.beforeAggregator = function(port, watchables,  key, callback) {
  var url = 'http://localhost:' + port;
  async.waterfall(
    [
      function(callback) {
        var aggregator = new Aggregator(port, key, function() {
          callback(aggregator);
        });
      },
      function(aggregator, callback) {
        var collector = new Collector(watchables, url, key, function(error, result) {
          if(error) {
            throw error;
          }

          result.should.be.true;
          callback(aggregator, collector)
        });
      },
      function(callback) {
        var browser = new MockBrowser(url, key, function(error, result) {

        });
      }
    ],
    callback
  );
};