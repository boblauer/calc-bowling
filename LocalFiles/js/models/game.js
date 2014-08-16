function Game() {
  this.score = 0;
  this.frames = [];
  this.currentFrame = null;
  this.currentFrameIndex = -1;

  this.start();
}

Game.prototype.start = function() {
  for (var i = 0; i < 9; i++) {
    this.frames.push(new Frame());
  }

  this.frames.push(new LastFrame());

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
  if (this.currentFrameIndex > 0) PubSub.publish('reset pins');
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
    scores.push(frame.getScoreSummary());
  });

  return scores;
};

Game.prototype.done = function() {
  this.isDone = true;
  PubSub.publish('finished', this.getScore());
};

function Frame() {
  this.throws = [];
  this.throwsAllowed = 2;

  this.throwsLeftToScore = 0;

  this.wasClosed = false;
  this.wasStrike = false;

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

Frame.prototype.getScoreSummary = function() {
  var firstScore = this.getFirstRoll()
    , secondScore = this.getSecondRoll()
    , frameScore = this.getScore()
    ;

    if (firstScore === 10) {
      firstScore = 'X';
      secondScore = '';
    }

    if (firstScore + secondScore === 10) secondScore = '/';

    if (firstScore === 0) firstScore = '-';
    if (secondScore === 0) secondScore = '-';

  return {
    1: firstScore,
    2: secondScore,
    frameScore: frameScore
  };
};

function LastFrame() {
  Frame.call(this);
  this.throwsAllowed = 3;
}

LastFrame.prototype = new Frame();

LastFrame.prototype.start = function() {
  this.throwsLeftToScore = 3;
  this.started = true;
};

LastFrame.prototype.throw = function(pins) {
  if (!this.throwsLeftToScore) return;
  if (this.isDone) return;

  this.throws.push(pins);
  this.throwsLeftToScore--;

  if (this.throws.length === 2 && this.getScore() < 10) {
    this.throwsLeftToScore--;
  }

  this.isDone = this.throwsLeftToScore === 0;

  if (!this.isDone) {
    if (pins === 10 || this.getScore() === 10) {
      debugger;
      PubSub.publish('reset pins');
    }
  }
};

LastFrame.prototype.getThirdRoll = function() {
  return this.throws[2] === undefined ? '' : this.throws[2];
};

LastFrame.prototype.getScoreSummary = function() {
  var firstScore = this.getFirstRoll()
    , secondScore = this.getSecondRoll()
    , thirdScore = this.getThirdRoll()
    , frameScore = this.getScore()
    ;

    if (firstScore === 10) {
      firstScore = 'X';
    }

    if (secondScore === 10) {
      secondScore = 'X';
    }

    if (thirdScore === 10) {
      thirdScore = 'X';
    }

    if (firstScore + secondScore === 10) {
      secondScore = '/';
    } else if (secondScore + thirdScore === 10) {
      thirdScore = '/';
    }

    if (firstScore === 0) firstScore = '-';
    if (secondScore === 0) secondScore = '-';
    if (thirdScore === 0) thirdScore = '-';

  return {
    1: firstScore,
    2: secondScore,
    3: thirdScore,
    frameScore: frameScore
  };
};

LastFrame.prototype.getScore = function() {
  if (!this.started) return '';

  return this.throws.reduce(function(runningScore, currentScore) {
    return runningScore + currentScore;
  }, 0);
};
