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
      _this.resetAfterThrow = true;

      var frameToMove = currentFrame - 1;
      _this.$el.find('.card[data-frame=' + frameToMove + ']').css('marginLeft', '-33.3%');
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
        var firstScore = frameScores[0];
        var secondScore = frameScores[1];
        var frameScore = frameScores[2];

        if (frameScore !== '') {
          totalScore += frameScore;
          frameScore = totalScore;
        }

        if (firstScore === 10) {
          firstScore = 'X';
          secondScore = '';
        }

        if (firstScore + secondScore === 10) secondScore = '/';

        if (firstScore === 0) firstScore = '-';
        if (secondScore === 0) secondScore = '-';

        _this.$el.find('.card[data-frame=' + (i + 1) + ']')
          .find('.first').text(firstScore).end()
          .find('.second').text(secondScore).end()
          .find('.score').text(frameScore).end();
      });
    });

    this.ball.swing();
  }
});
