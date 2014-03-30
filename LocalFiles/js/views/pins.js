var PinsView = Backbone.View.extend({
  el: $('.pins'),

  initialize: function() {
    this.pins = {};
    this.reset();

    this.space = '&nbsp;&nbsp;&nbsp;';
  },

  render: function() {
    var _this = this;
    this.$el.find('.row').each(function(i, row) {
      $(row).html(_this.getRow(4 - i));
    });
  },

  reset: function() {
    for (var i = 1; i <= 10; i++) {
      this.pins[i] = true;
    }
  },

  hit: function(pos) {
    var _this = this;

    var pinsUp = 0;
    Object.keys(this.pins).forEach(function(pin) {
      pinsUp += _this.pins[pin];
    });

    var struckPins = {
      4: '1 2 3 4 5 6 7 8 9 10',
      3: '2 4 5 7 8 9',
      5: '3 5 6 8 9 10',
      2: '4 7 8',
      6: '6 9 10',
      1: '7',
      7: '10',
      0: '',
      8: ''
    }[pos].split(' ');

    struckPins.forEach(function(pin) {
      _this.pins[pin] = false;
    });

    var pinsStillUp = 0;
    Object.keys(this.pins).forEach(function(pin) {
      pinsStillUp += _this.pins[pin];
    });

    return pinsUp - pinsStillUp;
  },

  getRow: function(row) {
    if (row === 1) {
      return this.pins[1] ? 'X' : '';
    } else if (row === 2) {
      return (this.pins[2] ? 'X' : this.space) + this.space + (this.pins[3] ? 'X' : this.space);
    } else if (row === 3) {
      return (this.pins[4] ? 'X' : this.space) + this.space + (this.pins[5] ? 'X' : this.space) + this.space + (this.pins[6] ? 'X' : this.space);
    } else if (row === 4) {
      return (this.pins[7] ? 'X' : this.space) + this.space + (this.pins[8] ? 'X' : this.space) + this.space + (this.pins[9] ? 'X' : this.space) + this.space + (this.pins[10] ? 'X' : this.space);
    }
  }
});
