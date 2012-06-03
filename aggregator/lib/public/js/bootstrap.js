
requirejs.config({
  'paths': {
    'underscore': 'js/libs/underscore/underscore.js'
    'backbone': 'js/libs/backbone/backbone.js'
  },
  'shim': {
    'backbone': {
      'deps': ['underscore'],
      'exports': Backbone
    }
  }
});

require(['app.js'], function(_, backbone, App) {
  var app = new App('loggregator');
});