
require('should');
var io = require('socket.io');
var socketClient = require('socket.io-client');

var port = 9002;

describe('server', function() {
  var app = require('express').createServer();
  var slogger = new require('../')(app, {'key': 'asdf'});
  app.listen(port);

  it('takes connections', function(done) {
    var client = socketClient.connect('http://127.0.0.1:' + port);
    client.on('connect', function() {
      client.socket.connected.should.be.true;
      done();
    });
  });

  it('accepts register', function(done) {
    var client =  socketClient.connect('http://127.0.0.1:' + port);
    var os = require('os');

    var message = {
      'type': 'collector',
      'hostname': os.hostname(),
      'pid': process.pid,
      'osType': os.type(),
      'platform': os.platform(),
      'arch': os.arch(),
      'uptime': os.uptime(),
      'totalMemory': os.totalmem(),
      'load': os.loadavg(),
      'freeMemory': os.freemem(),
      'cpus': os.cpus()
    };

    client.emit('register', message, function(data) {
      console.log(data);
      done();
    });
  });
});