var GameView = Backbone.View.extend({
  el: $('#game-screen'),

  events: {

  },

  initialize: function() {
    var _this = this;
    this.ball = new BallView();
    this.pins = new PinsView();

    this.game = new Game();

    this.ball.on('hit', function(pos) {
      var score = _this.pins.hit(pos);
      _this.game.throw(score);
      _this.pins.render();
    });

    this.ball.on('thrown', function() {
      _this.ball.reset();
      _this.ball.swing();

      if (_this.resetAfterThrow) {
        _this.pins.reset();
        _this.pins.render();
        _this.resetAfterThrow = false;
      }

      _this.updateScores();
    });

    PubSub.subscribe('next frame', function(msg, currentFrame) {
      var frameToMove = currentFrame - 2;

      setTimeout(function() {
        _this.$el.find('.card[data-frame=' + frameToMove + ']').animate({
          marginLeft: '-33.3%'
        });
      }, 200);
    });

    PubSub.subscribe('reset pins', function() {
      debugger;
      _this.resetAfterThrow = true;
    });

    PubSub.subscribe('finished', function() {
      _this.reset();
    });
  },

  render: function() {
    var _this = this;

    this.$el.siblings().hide();
    this.$el.show();

    this.$el.find('.pins').on('font-size', function(e, size) {
      _this.$el.find('.lane-marker, .ball').css('fontSize', size);
    }).fitText(0.8);

    this.$el.find('.cards .card').fitText(0.6)
      .find('.frame').fitText(0.2);

    this.ball.swing();
  },

  updateScores: function() {
    var _this = this;
    var totalScore = 0;

    this.game.getFrameScores().forEach(function(frameScores, i) {
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
  },

  reset: function() {

    this.ball.reset();
    this.pins.reset();
    this.pins.render();
    this.resetAfterThrow = false;
    this.$el.find('.card').css('marginLeft', 0);

    this.game = new Game();
    this.updateScores();
  }
});
