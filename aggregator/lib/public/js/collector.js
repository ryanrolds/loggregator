
var Collector = function(monitor, id, watchables) {
  this.parent = monitor;
  this.id = id;
  this.watchables = watchables;
  this.ui = {};
  this.active = [];
};

Collector.prototype.createUI = function() {
  var main = document.createElement('div');
  main.className = 'collector';

  var name = document.createElement('div');
  name.className = 'name clickable';
  name.appendChild(document.createTextNode(this.id));

  $(name).click({'collector': this}, function(e) {
    e.data.collector.toggleWatchables();
  });

  var watchables = document.createElement('div');
  watchables.className = 'watchables';
  this.ui.watchables = watchables;

  main.appendChild(name);
  main.appendChild(watchables);

  this.ui.main = main;

  return main;
};

Collector.prototype.toggleWatchables = function() {
  if(this.ui.watchables.style.display === 'block') {
    this.hideWatchables();
    this.ui.watchables.style.display = 'none';
  } else {
    this.showWatchables();
    this.ui.watchables.style.display = 'block';
  }
};

Collector.prototype.showWatchables = function(id) {
  var that = this;
  this.watchables.forEach(function(i) {
    that.ui.watchables.appendChild(that.createWatchable(i));
  });
};

Collector.prototype.hideWatchables = function() {
  $(this.ui.watchables).empty();
};

Collector.prototype.createWatchable = function(id) {
  var item = document.createElement('div');
  item.className = 'watchable clickable';
  
  var watchName = document.createElement('span');
  watchName.appendChild(document.createTextNode(id));
  item.appendChild(watchName);

  $(item).click({'collector': this, 'watchable': id}, function(e) {
    var collector = e.data.collector;
    var watchable = e.data.watchable;
    var pos = $.inArray(watchable, collector.active);
    if(pos === -1) {
      collector.active.push(watchable);
      collector.watch(e.data.watchable);
      e.currentTarget.parentNode.style.backgroundColor = collector.parent.getColor();
    } else {
      collector.active.splice(pos, 1);
      collector.unwatch(e.data.watchable);
      e.currentTarget.parentNode.style.backgroundColor = 'transparent';
    }
  });

  return item;
};

Collector.prototype.watch = function(watchable) {
  this.parent.watch(this.id, watchable);
};

Collector.prototype.unwatch = function(watchable) {
  this.parent.unwatch(this.id, watchable);
};
