
# slogger #

Real-time file (and streams at some point) monitoring. 

## Why? ##

IMHO, log.io is too invasive. It also doesn't allow the monitoring of stdout, stderr. 
The point of this project is crate a easy to drop in module that takes a url for the 
aggregator service, a list of things to watch, and a key. The Collector and aggregator
handle the rest.

## Usage ##

### Aggregator ###

#### Install ####

    npm install aggregator;

#### Using ####

    var Aggregator = require('slogger');

    var port = 9069;
    var key = 'foobarbaz';
    var agg = new Aggregator(port, 'foobarbaz');

### Collector ###

#### Install ####

    npm install slogger-collector

#### Using ####

    var Collector = require('slogger-collector');
    
    var watchables = {
      'stdout': true,
      'stderr': true,
      'somefile': '/path/to/some/file',
      'somestream': someStream
    };
    var url = 'http://someserver:9069';
    var key = 'foobarbaz';
    var coll = new Collector(watchables, url, key);