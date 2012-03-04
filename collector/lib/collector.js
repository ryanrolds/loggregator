
var io = require('socket.io-client');
var filechanges = require('filechanges');

module.exports = function() {
  var Collector = function Collector(files, url, key) {
    var conn = io.connect(url);
    conn.on('connect', function() {
      //conn.emit('register', funct
    });
  }; 

  return Collector;
}();