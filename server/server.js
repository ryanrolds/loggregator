
var io = require('socket.io');

module.exports = function() {
  var Server = function(app, options) {
    if(!app) {
      throw new Error('invalid app');
    }

    if(!options.key) {
      throw new Error('invalid key');
    }

    this.options = options;
    this.collectors = {};
    this.clients = {};

    var server = this;

    io = io.listen(app);
    io.sockets.on('connection', function(socket) {
      socket.on('register', function(data, callback) {
        if(data.key === options.key) {
          socket.set('authorized', true);
        } else {
          callback('invalid key');
          return socket.disconnect();
        }

        if(data.type === 'collector') {
          server.collectors = data;
        }

        console.log(data);        
        callback('registered');
      });
    });

    this.io = io;
  }

  return Server;
}();


