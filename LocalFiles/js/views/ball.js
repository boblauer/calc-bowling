var BallView = Backbone.View.extend({
  el: $('.ball-container'),
  ball: $('.ball'),
  pos: 0,
  direction: 1,
  minSpeed: 25,
  maxSpeed: 40,

  initialize: function() {

  },

  swing: function() {
    this.interval = window.setInterval((function() {
      this.pos = this.direction ? this.pos + 1 : this.pos - 1;

      if (this.pos === 0 || this.pos === 8) {
        this.direction = 1 - this.direction;
      }

      this.ball.html(this.getSpacing());
    }).bind(this), this.getSpeed());

    $(window).one('touchstart mousedown', (function() {
      this.throw();
    }).bind(this));
  },

  throw: function() {
    window.clearInterval(this.interval);

    var hasHit = false;
    this.$el.animate({ bottom: '100%' }, {
      step: (function(val) {
        if (!hasHit && val > 50) {
          if (this.$el.position().top <= $('.row:contains(X):last').position().top) {
            hasHit = true;
            this.trigger('hit', this.pos);
          }
        }
      }).bind(this),
      duration: 1000
    });
  },

  reset: function() {

  },

  getSpeed: function() {
    return Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed;
  },

  getSpacing: function() {
    var ball = '0';
    var spacing = '';

    var relativePos = 4 - this.pos;

    for (var i = 0; i < Math.abs(relativePos) * 6; i++) {
      spacing += '&nbsp;';
    }

    if (this.pos < 4) {
      ball = ball + spacing;
    } else {
      ball = spacing + ball;
    }

    return ball;
  }
});
