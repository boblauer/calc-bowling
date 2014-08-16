var AppView = Backbone.View.extend({
  el: $(window),

  events: {
    'resize': 'sizeBody',
    'backbutton document': 'goBack'
  },

  initialize: function() {
    this.sizeBody();
    this.start();

    var _this = this;
    PubSub.subscribe('finished', function() {
      _this.intro.render();
    });
  },

  start: function() {
    var _this = this;

    this.intro = new IntroView();
    this.game = new GameView();

    this.intro.on('start', function() {
      _this.game.render();
    });

    this.intro.render();
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

