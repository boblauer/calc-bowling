var GameView = Backbone.View.extend({
  el: $('#game-screen'),

  events: {

  },

  initialize: function() {
    this.ball = this.ball || new BallView();
    this.pins = this.pins || new PinsView();
  },

  render: function() {
    var _this = this;

    this.$el.siblings().hide();
    this.$el.show();

    this.$el.find('.pins').on('font-size', function(e, size) {
      _this.$el.find('.lane-marker, .ball').css('fontSize', size);
    }).fitText(.8);

    this.ball.on('hit', function(pos) {
      _this.pins.hit(pos);
      _this.pins.render();
    });

    this.ball.on('thrown', function() {
      _this.ball.reset();
    });

    this.ball.swing();
  }
});
