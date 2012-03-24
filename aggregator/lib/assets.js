
module.exports = function(assetPath, namespace) {
  return {
    'js': {
      'route': new RegExp(['/', namespace, '\/js\/client.js'].join('')),
      'path': assetPath,
      'dataType': 'javascript',
      'files': [
        'client.js'
      ]
    },
    'jsquery': {
      'route': new RegExp(['/', namespace, '\/js\/jquery.js'].join('')),
      'path': assetPath,
      'dataType': 'javascript',
      'files': [
        'jquery-1.7.1.min.js'
      ]
    }
  };
};