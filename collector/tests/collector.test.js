
require('should');

var aggregatorShim = require('./lib/aggregator')();


var Collector = require('../');
var host = 'localhost';
var port = 9069;

var streams = {
  'accesslog': './assets/access.log'
};

describe('slogger', function() {
  describe('collector', function() {
    var client = new Collector(host, port, streams);

    it('is a slogger collector', function() {
      client.should.be.instanceof(Collector);
    });
  });
});