
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

  it('start watching accesslog', function(done) {
    monitor.watch(
      {
        'hostname': 'minecraftserver',
        'watchable': 'accesslog'
      },
      function(error, data) {
        done();
      }
    );
  });
});