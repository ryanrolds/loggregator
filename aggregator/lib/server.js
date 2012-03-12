
var express = require('express');

var Aggregator = require('./aggregator');

var defaultNamespace = 'loggregator';

var Server = function(port, key, namespace, callback) {
  // Default namespace to loggregator if not defined
  if(typeof namespace === 'function') {
    callback = namespace;
    namespace = defaultNamespace;
  } else if(!namespace) {
    namespace = defaultNamespace;
  }

  var app = this.app = express.createServer();
  var agg = new Aggregator(app, key, namespace);

  // Routes
  require('./routes/login')(app, namespace);
  require('./routes/client')(app, namespace);

  app.listen(port, callback);
};

Server.prototype.close = function() {
  this.app.close();
};

module.exports = Server;