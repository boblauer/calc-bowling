var assert = require('assert');
var Game = require('./models/Game');

var game = new Game();
game.start();

game.throw(4);
game.throw(4);

assert(game.getScore() === 8);

game.throw(5);
game.throw(5);

assert(game.getScore() === 8);

game.throw(1);

assert(game.getScore() === 19);

game.throw(1);

assert(game.getScore() === 21);

game.throw(10);
game.throw(10);
game.throw(10);

assert(game.getScore() === 51);

console.log('success!');
