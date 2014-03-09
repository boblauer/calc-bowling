var AppView = Backbone.View.extend({
  el: $(window),

  events: {
    'resize': 'sizeBody',
    'backbutton document': 'goBack'
  },

  initialize: function() {
    this.sizeBody();

    var intro = new IntroView();
    var game = new GameView();

    intro.on('start', function() {
      game.render();
    });

    intro.render();
  },

  sizeBody: function() {
    var $window = $(window);

    var height = $window.height();
    var width = $window.width();

    var minWidth = Math.min(height / 16 * 9, width);
    $('body').css('width', minWidth);
  },

  goBack: function() {
    mosync.app.exit();
  }
});

