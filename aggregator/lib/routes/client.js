
module.exports = function(app, namespace) {
  app.get('/' + namespace + '/client', function(req, res) {
    res.render('client.html', {'namespace': '/' + namespace});
  });
};