
# loggregator #

Real-time file (and streams at some point) monitoring. 

## Why? ##

IMHO, log.io is too invasive, *nix specific, and isn't easily deployable/packageble. It also doesn't
allow the monitoring of stdout, stderr. The point of this project is crate a easy to 
drop in module that takes a url for the aggregator service, a list of things to watch, 
and a key. The Collector and Aggregator handle the rest.

## Usage ##

### Aggregator ###

#### Install ####

This project isn't completed yet and isn't publish yet!

    npm install loggregator;

#### Using ####

    var Aggregator = require('loggregator');

    var port = 9069;
    var key = 'foobarbaz';
    var agg = new Aggregator(port, 'foobarbaz');

### Collector ###

#### Install ####

This project isn't completed yet and isn't publish yet!

    npm install loggregator-collector

#### Using ####

    var Collector = require('loggregator-collector');
    
    var watchables = {
      'stdout': true,
      'stderr': true,
      'somefile': '/path/to/some/file',
      'somestream': someStream
    };
    var url = 'http://someserver:9069';
    var key = 'foobarbaz';
    var coll = new Collector(watchables, url, key);