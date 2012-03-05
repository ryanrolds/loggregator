
var testHelpers = require('../../common/lib/testHelpers');

var port = 9069;
var key = 'foobarbaz';
var watchables = {
  'accesslog': __dirname + '/assets/access.log'
};

//var Slogger = require('../')
//var Collector = require('../../collector');
//var Browser = require('./libs/mockBrowser');

describe('server', function() {
  var aggregator;
  var collector;
  var browser;
  before(function(done) {
    testHelpers.beforeAggregator(port, watchables, key, function(error, agg, coll, bro) {
      aggregator = agg;
      collector = coll;
      browser = bro;
      done();
    });
  });

  it('start watching accesslog', function(done) {
    browser.watch(
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