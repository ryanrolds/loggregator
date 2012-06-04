define(
  ['backbone', 'hogan', 'models/appModel.js', 'text!views/app.hogan'], 
  function(Backbone, hogan, AppModel, template) {
    return Backbone.View.extend({
      initialize: function() {
        this.model = new AppModel();
        this.render();
      },
      render: function() {
        $(this.el).html(hogan.compile(template).render());
        return this;
      }
    });
  }
);