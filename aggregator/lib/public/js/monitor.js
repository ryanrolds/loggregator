
var Monitor = function(url) {
  this.url = url;

  this.setupUI();
  this.setupSocketIO();
};

Monitor.prototype.setupUI = function() {
  var list = document.createElement('div');
  list.id = 'list';

  var messages = document.createElement('div');
  messages.id = 'messages';

  var main = document.getElementById('loggregator');
  main.id = 'loggregator';

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
        console.log(response);
      });
    });
  });
};

Monitor.prototype.addCollector = function(collector) {
  
};



