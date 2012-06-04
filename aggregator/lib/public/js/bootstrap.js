
requirejs.config({
  'paths': {
    'underscore': 'libs/underscore/underscore',
    'backbone': 'libs/backbone/backbone',
    'hogan': 'libs/hogan/hogan-2.0.0',
    'jquery': 'libs/jquery/jquery-1.7.2',
    'text': 'libs/require/text'
  },
  'shim': {
    'hogan': {
      'exports': 'Hogan'
    },
    'jquery': {
      'exports': '$'
    },
    'underscore': {
      'exports': '_'
    },
    'backbone': {
      'deps': ['underscore', 'jquery'],
      'exports': 'Backbone'
    }
  }
});

requirejs(['app'], function(App) {
  var app = new App({'el': document.getElementById('loggregator')});
});