function Game() {
  this.score = 0;
  this.frames = [];
  this.currentFrame = null;
  this.currentFrameIndex = -1;
}

Game.prototype.start = function() {
  for (var i = 0; i < 10; i++) {
    this.frames.push(new Frame(i === 9));
  }

  this.advanceFrame();
};

Game.prototype.throw = function(pins) {
  this.frames.forEach(function(frame) {
    frame.throw(pins);
  });

  if (this.currentFrame.isDone) {
    this.advanceFrame();
  }
};

Game.prototype.advanceFrame = function() {
  this.currentFrame = this.frames[++this.currentFrameIndex];
  if (this.currentFrameIndex === 10) return this.done();
  PubSub.publish('next frame', this.currentFrameIndex);
  this.currentFrame.start();
};

Game.prototype.getScore = function() {
  return this.frames.reduce(function(runningScore, currentFrame) {
    return runningScore + currentFrame.getScore();
  }, 0);
};

Game.prototype.getFrameScores = function() {
  var scores = [];
  this.frames.forEach(function(frame) {
    scores.push([ frame.getFirstRoll(), frame.getSecondRoll(), frame.getScore() ]);
  });

  return scores;
};

Game.prototype.done = function() {
  this.throw = function() { };
  PubSub.publish('finished');
};

function Frame(isLast) {
  this.throws = [];
  this.throwsAllowed = isLast ? 3 : 2;

  this.throwsLeftToScore = 0;

  this.wasClosed = false;
  this.wasStrike = false;

  this.isLast = isLast;
  this.started = false;
}

Frame.prototype.start = function() {
  this.throwsLeftToScore = 2;
  this.started = true;
};

Frame.prototype.throw = function(pins) {
  if (!this.throwsLeftToScore) return;

  this.throws.push(pins);
  this.throwsLeftToScore--;

  if (this.isDone) return;

  if (pins === 10) {
    this.wasStrike = true;
    this.throwsLeftToScore = 2;
  } else if (this.getScore() === 10) {
    this.throwsLeftToScore = 1;
  }

  this.isDone = this.wasStrike || this.throws.length === this.throwsAllowed;
};

Frame.prototype.getFirstRoll = function() {
  return this.throws[0] === undefined ? '' : this.throws[0];
};

Frame.prototype.getSecondRoll = function() {
  return this.throws[1] === undefined ? '' : this.throws[1];
};

Frame.prototype.getScore = function() {
  if (!this.started || this.throwsLeftToScore) return '';

  return this.throws.reduce(function(runningScore, currentScore) {
    return runningScore + currentScore;
  }, 0);
};
