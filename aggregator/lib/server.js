
var express = require('express');

var Aggregator = require('./aggregator');

module.exports = (function() {
  var Server = function(port, key, callback) {
    var app = express.createServer();
    var agg = new Aggregator(key, app);
    app.listen(port, callback);
  };

  return Server;
})();


