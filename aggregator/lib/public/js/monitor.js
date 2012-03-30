
var Monitor = function(url) {
  this.url = url;
  this.ui = {};

  this.setupUI();
  this.setupSocketIO();
};

Monitor.prototype.setupUI = function() {
  var list = document.createElement('div');
  list.id = 'list';
  this.ui.list = list;

  var messages = document.createElement('div');
  messages.id = 'messages';

  var main = document.getElementById('loggregator');
  main.appendChild(list);
  main.appendChild(messages);
};

Monitor.prototype.setupSocketIO = function() {
  var socket = io.connect(this.url);
  var that = this;

  socket.on('connect', function(data) {
    var message = {
      'key': key,
      'type': 'monitor'
    };

    socket.emit('register', message, function(error, response) {
      if(error || response !== 'registered') {
        return;
      }

      socket.emit('watchables', function(error, response) {
        console.log(error, response);
        for(var k in response.collectors) {
          that.addCollector(k, response.collectors[k]);
        };
      });
    });
  });

  this.socket = socket;
};

Monitor.prototype.addCollector = function(id, watchables) {
  var collector = new Collector(this, id, watchables);
  this.ui.list.appendChild(collector.createUI());
};

Monitor.prototype.watch = function(id, watchable) {
  var data = {
    'hostname': id,
    'watchable': watchable
  };
  this.socket.emit('watch', data);
};

Monitor.prototype.unwatch = function(id, watchable) {
  var data = {
    'hostname': id,
    'watchable': watchable
  };
  this.socket.emit('unwatch');
};
