
require('should');

//var MockAggregator = require('./lib/mockAggregator')();

var Collector = require('../');
var host = 'localhost';
var port = 9069;
var streams = {
  'accesslog': './assets/access.log'
};

describe('slogger', function() {
  describe('collector', function() {
    /*
    var aggregator
    before(function(done) {
      aggregator = mockAggregator(done);
    });
    */

    var client = new Collector(host, port, streams);

    it('is a slogger collector', function() {
      client.should.be.instanceof(Collector);
    });

    it('should accept start', function() {
      //aggregator.start('accesslog', function() {
      //  console.log('asdfasdf');
      //});
    });
  });
});