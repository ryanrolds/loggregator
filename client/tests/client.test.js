
require('should');

var SloggerClient = require('../');
var SloggerServer = require('slogger');
var server = new SloggerServer();

describe('slogger', function() {
  describe('client', function() {
    var host = 'localhost';
    var host = 9001;
    var client = new SloggerClient(host, port);

    it('is a SloggerClient', function() {
      client.should.be.instanceof(SloggerClient);
    });
  });

  describe('client 
});