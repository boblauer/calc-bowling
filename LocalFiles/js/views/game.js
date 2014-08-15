var GameView = Backbone.View.extend({
  el: $('#game-screen'),

  events: {

  },

  initialize: function() {
    this.ball = this.ball || new BallView();
    this.pins = this.pins || new PinsView();

    this.game = new Game();
    this.game.start();

    var _this = this;
    PubSub.subscribe('next frame', function(msg, currentFrame) {
      var frameToMove = currentFrame - 2;

      setTimeout(function() {
        _this.$el.find('.card[data-frame=' + frameToMove + ']').animate({
          marginLeft: '-33.3%'
        });
      }, 200);
    });

    PubSub.subscribe('reset pins', function() {
      _this.resetAfterThrow = true;
    });
  },

  render: function() {
    var _this = this;

    this.$el.siblings().hide();
    this.$el.show();

    this.$el.find('.pins').on('font-size', function(e, size) {
      _this.$el.find('.lane-marker, .ball').css('fontSize', size);
    }).fitText(0.8);

    this.ball.on('hit', function(pos) {
      var score = _this.pins.hit(pos);
      _this.game.throw(score);
      _this.pins.render();
    });

    this.ball.on('thrown', function() {
      _this.ball.reset();

      if (_this.resetAfterThrow) {
        _this.pins.reset();
        _this.pins.render();
        _this.resetAfterThrow = false;
      }

      var totalScore = 0;
      _this.game.getFrameScores().forEach(function(frameScores, i) {
        var firstScore = frameScores[1];
        var secondScore = frameScores[2];
        var thirdScore = frameScores[3];
        var frameScore = frameScores.frameScore;

        if (frameScore !== '') {
          totalScore += frameScore;
          frameScore = totalScore;
        }

        _this.$el.find('.card[data-frame=' + (i + 1) + ']')
          .find('.first').text(firstScore).end()
          .find('.second').text(secondScore).end()
          .find('.third').text(thirdScore).end()
          .find('.score').text(frameScore).end();
      });
    });

    this.ball.swing();
  }
});
