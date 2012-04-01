
var Collector = require('../collector')

var files = {
  'accesslog': '__loremipsum'
};

var coll = new Collector(files, 'http://localhost:9069/loggregator', 'blah');