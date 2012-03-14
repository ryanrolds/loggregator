
module.exports = function(app, namespace) {
  app.get('/' + namespace + '/client', function(req, res) {
    var locals = {
      'namespace': '/' + namespace
    };

    res.render('client.hogan', {'locals': locals});
  });
};