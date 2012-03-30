
module.exports = function(assetPath, namespace) {
  return {
    'js': {
      'route': new RegExp(['/', namespace, '\/js\/client.js'].join('')),
      'path': assetPath + 'js/',
      'debug': true,
      'dataType': 'javascript',
      'files': [
        'monitor.js',
        'collector.js',
        'load.js'
      ]
    },
    'jsquery': {
      'route': new RegExp(['/', namespace, '\/js\/jquery.js'].join('')),
      'path': assetPath + 'js/',
      'dataType': 'javascript',
      'files': [
        'jquery-1.7.1.min.js'
      ]
    },
    'css': {
      'route': new RegExp(['/', namespace, '\/css\/client.css'].join('')),
      'path': assetPath + 'css/',
      'dataType': 'css',
      'files': [
        'monitor.css'
      ]
    }
  };
};