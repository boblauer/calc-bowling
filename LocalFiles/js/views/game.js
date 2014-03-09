var GameView = Backbone.View.extend({
  el: $('#game-screen'),

  events: {

  },

  initialize: function() {
    this.ball = this.ball || new BallView();
  },

  render: function() {
    var _this = this;

    this.$el.siblings().hide();
    this.$el.show();

    this.$el.find('.pins').on('font-size', function(e, size) {
      _this.$el.find('.lane-marker, .ball').css('fontSize', size);
    }).fitText(.8);

    this.ball.on('hit', function(pos) {
      console.log('hit', pos);
    });

    this.ball.swing();
  }
});
