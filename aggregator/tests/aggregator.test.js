
var assert = require('assert');
var os = require('os');
var Browser = require("zombie");

var testHelpers = require('./lib/testHelpers');

var port = 9069;
var key = 'foobarbaz';
var namespace = 'loggregator';
var watchables = {
  'accesslog': __dirname + '/assets/access.log'
};

describe('aggregator', function() {
  var browser;
  var aggregator;
  var collector;
  var monitor;
  before(function(done) {
    browser = new Browser();

    testHelpers.beforeAggregator(port, watchables, key, namespace, function(error, agg, coll, mon) {
      aggregator = agg;
      collector = coll;
      monitor = mon;
      done();
    });
  });

  after(function(done) {
    testHelpers.afterAggregator(aggregator, collector, monitor, done);
  });

  it('should support getting watchables', function(done) {
    monitor.watchables(function(error, data) {
      data.collectors.should.be.object;
      Object.keys(data.collectors).length.should.not.equal(0);
      done();
    });
  });

  it('should support watching accesslog', function(done) {
    var data = {
      'hostname': os.hostname(),
      'watchable': Object.keys(watchables)[0]
    };

    var callback = function(error, data) {
      data.should.equal('watching');
      done();
    };

    monitor.watch(data, callback);
  });

  it('should get data event for accesslog', function(done) {
    var listener = function(data) {
      data.date.length.should.not.equal(0);
      data.lines.should.equal('blah\n');
      data.watchable.should.equal(Object.keys(watchables)[0]);
      data.hostname.length.should.not.equal(0);
      done();
    };

    monitor.once('data', listener);

    testHelpers.writeToFile(watchables.accesslog, 'blah\n');
  });

  it('should be able to unlisten', function(done) {
    var data = {
      'hostname': os.hostname(),
      'watchable': Object.keys(watchables)[0]
    };

    var callback = function(error, data) {
      data.should.equal('unwatched');
      done();
    };

    monitor.unwatch(data, callback);
  });

  it('should not get lines', function(done) {
    // Listen for data/lines event
    monitor.once('data', function(data) {
      throw new Error('we shouldnt hit this');
    });

    this.timeout(3000);
    setTimeout(function() {
      done();
    }, 500);
    
    // Write to file and get the collector to fire an event
    testHelpers.writeToFile(watchables.accesslog, 'blah\n');
  });

  describe('client', function() {
    it('should serve /<namespace>/client', function(done) {
      var url = ['http://localhost:', port, '/', namespace, '/client'].join('');
      browser.visit(url, function(error, browser, status) {
        assert.equal(error, null);
        status.should.equal(200);
        done();
      });
    });
  });
});