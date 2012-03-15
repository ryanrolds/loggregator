
var Collector = require('../collector')

var files = {
  'accesslog': __dirname + '/assets/access.log'
};

var coll = new Collector(files, 'http://localhost:9069/loggregator', 'blah');