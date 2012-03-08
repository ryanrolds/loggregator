
var os = require('os');

var testHelpers = require('./lib/testHelpers');

var port = 9069;
var key = 'foobarbaz';
var watchables = {
  'accesslog': __dirname + '/assets/access.log'
};


describe('server', function() {
  var aggregator;
  var collector;
  var monitor;
  before(function(done) {
    testHelpers.beforeAggregator(port, watchables, key, function(error, agg, coll, mon) {
      aggregator = agg;
      collector = coll;
      monitor = mon;
      done();
    });
  });

  it('should support watching accesslog', function(done) {
    var data = {
      'hostname': os.hostname(),
      'watchable': Object.keys(watchables)[0]
    };

    var callback = function(error, data) {
      data.should.be.true;
      done();
    };

    monitor.watch(data, callback);
  });

  it('should get data event for accesslog', function(done) {
    var listener = function(data) {
      done();
    };

    monitor.once('lines', listener);

    testHelpers.writeToFile(watchables.accesslog, 'blah\n');
  });
});