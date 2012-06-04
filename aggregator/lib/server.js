
var path = require('path');
var express = require('express');
var expressHogan = require('express-hogan.js');
var assetManager = require('connect-assetmanager');

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
  app.set('views', __dirname + '/views');
  app.set('view options', {
    layout: false
  });
  app.register('.hogan', expressHogan);
  app.use('/' + namespace, express.static(__dirname  + '/public')); 

  var agg = new Aggregator(app, key, namespace);

  // Routes
  require('./routes/login')(app, key, namespace);
  require('./routes/client')(app, key, namespace);

  app.listen(port, callback);
};

Server.prototype.close = function() {
  this.app.close();
};

module.exports = Server;