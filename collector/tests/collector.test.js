
var testHelpers = require('./lib/testHelpers.js');

var Collector = require('../');
var files = {
  'accesslog': __dirname + '/assets/access.log'
};
var port = 9069;
var key = 'aaaa';

describe('loggregator', function() {
  describe('collector', function() {
    var aggregator;
    var client;
    before(function(done) {
      testHelpers.beforeCollector(port, files, key, function(error, agg, cli) {
        aggregator = agg;
        client = cli;
        done();
      });
    });

    it('is a loggregator collector', function() {
      client.should.be.instanceof(Collector);
    });

    it('should accept start', function(done) {
      aggregator.start('accesslog', function(error, data) {
        data.should.equal('watching');
        done();
      });
    });

    it('should send accesslog data', function(done) {
      // Listen for data/lines event
      aggregator.once('data', function(data) {
        data.lines.should.equal('blah\n');
        done();
      });

      // Write to file and get the collector to fire an event
      testHelpers.writeToFile(files.accesslog, 'blah\n');
    });

    it('should accept stop', function(done) {
      aggregator.stop('accesslog', function(error, data) {
        data.should.equal('unwatched');
        done();
      });
    });

    it('should not send accesslog data', function(done) {
      // Listen for data/lines event
      aggregator.once('data', function(data) {
        throw new Error('we shouldnt hit this');
      });

      this.timeout(3000);
      setTimeout(function() {
        done();
      }, 500);

      // Write to file and get the collector to fire an event
      testHelpers.writeToFile(files.accesslog, 'blah\n');
    });
  });
});