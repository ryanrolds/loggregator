
var testHelpers = require('./lib/helpers.js');

var Collector = require('../');
var files = {
  'accesslog': __dirname + '/assets/access.log'
};
var port = 9069;
var key = 'aaaa';

describe('slogger', function() {
  describe('collector', function() {
    var aggregator;
    var client;
    before(function(done) {
      testHelpers.setup(port, files, key, function(error, agg, cli) {
        aggregator = agg;
        client = cli;
        done();
      });
    });

    it('is a slogger collector', function() {
      client.should.be.instanceof(Collector);
    });

    it('should accept start', function(done) {
      aggregator.start('accesslog', function(error, data) {
        data.should.equal('started');
        done();
      });
    });

    it('should send accesslog data', function(done) {
      // Listen for data/lines event
      aggregator.once('lines', function(data) {
        data.lines.should.equal('blah\n');
        done();
      });

      // Write to file and get the collector to fire an event
      testHelpers.writeToFile(files.accesslog, 'blah\n');
    });

    it('should accept stop', function(done) {
      aggregator.stop('accesslog', function(error, data) {
        data.should.equal('stopped');
        done();
      });
    });

    it('should not send accesslog data', function(done) {
      // Listen for data/lines event
      aggregator.once('lines', function(data) {
        throw new Error('we shouldnt hit this');
      });

      this.timeout(3000);
      setTimeout(function() {
        done();
      }, 2000);

      // Write to file and get the collector to fire an event
      testHelpers.writeToFile(files.accesslog, 'blah\n');
    });
  });
});