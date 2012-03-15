
module.exports = function(app, key, namespace) {
  app.get('/' + namespace + '/client', function(req, res) {
    var locals = {
      'namespace': '/' + namespace,
      'key': key,
      'socketIOUrl': 'http://localhost:9069/' + namespace
    };

    res.render('client.hogan', {'locals': locals});
  });
};