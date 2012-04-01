
var Monitor = function(url) {
  this.url = url;
  this.ui = {};
  this.collectors = {};

  this.setupUI();
  this.setupSocketIO();
};

Monitor.prototype.setupUI = function() {
  var collectors = document.createElement('div');
  collectors.id = 'collectors';
  this.ui.collectors = collectors;

  var messages = document.createElement('div');
  messages.id = 'messages';
  this.ui.messages = messages;

  var clear = document.createElement('div');
  clear.style.clear = 'both';

  var main = document.getElementById('loggregator');
  main.appendChild(collectors);
  main.appendChild(messages);
  main.appendChild(clear);
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
        for(var k in response.collectors) {
          that.addCollector(k, response.collectors[k]);
        };
      });
    });

    socket.on('data', function(data) {
      var collector = that.getCollector(data.hostname);

      var message = document.createElement('div');
      message.className = 'message';
      message.style.color = collector.active[data.watchable];

      var time = document.createElement('span');
      time.className = 'time';
      time.appendChild(document.createTextNode(data.date));
      var host = document.createElement('span');
      host.className = 'hostname';
      host.appendChild(document.createTextNode(['[', data.hostname, ']'].join('')));
      var log = document.createElement('span');
      log.className = 'log';
      log.appendChild(document.createTextNode(data.lines));

      message.appendChild(time);
      message.appendChild(host);
      message.appendChild(log);

      that.ui.messages.appendChild(message);
    });
  });

  this.socket = socket;
};

Monitor.prototype.addCollector = function(id, watchables) {
  var collector = new Collector(this, id, watchables);
  this.collectors[id] = collector;

  this.ui.collectors.appendChild(collector.createUI());
};

Monitor.prototype.getCollector = function(id) {
  var c = this.collectors[id];
  return (c) ? c : undefined;
};

Monitor.prototype.watch = function(id, watchable) {
  var data = {
    'hostname': id,
    'watchable': watchable
  };
  this.socket.emit('watch', data, function(error, response) {
    if(error) {
      throw new Error(error);
    }
  });
};

Monitor.prototype.unwatch = function(id, watchable) {
  var data = {
    'hostname': id,
    'watchable': watchable
  };
  this.socket.emit('unwatch', data, function(error, response) {
    if(error) {
      throw new Error(error);
    }
  });
};


// http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
Monitor.prototype.getColor = function() {
  var grc = 0.618033988749895;
  var h = Math.random();
  h += 0.618033988749895;
  h = h % 1;
  return this.hsvToRGB(h, 0.5, 0.95);
};

Monitor.prototype.hsvToRGB = function(h, s, v) {
  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);

  var rgb;
  if(i === 0) {
    rgb = [v, t, p];
  } else if(i === 1) {
    rgb = [q, v, p];
  } else if(i === 2) {
    rgb = [p, v, t];
  } else if(i === 3) {
    rgb = [p, q, v];
  } else if(i === 4) {
    rgb = [t, p, v];
  } else if(i === 5) {
    rgb = [v, p, q];
  }

  rgb[0] = (Math.floor(rgb[0] * 256)).toString(16);
  rgb[1] = (Math.floor(rgb[1] * 256)).toString(16);
  rgb[2] = (Math.floor(rgb[2] * 256)).toString(16);

  return '#' + rgb.join('');
};