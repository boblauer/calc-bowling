var IntroView = Backbone.View.extend({
  el: $('#intro-screen'),

  events: {
    'click': 'startGame',
    'touchstart': 'startGame'
  },

  initialize: function() {

  },

  render: function() {
    this.$el.siblings().hide();
    this.$el.show();

    this.$el.find('.title').fitText();
    this.$el.find('.high-score, .start').fitText(2);
  },

  startGame: function() {
    this.trigger('start');
  }
});
