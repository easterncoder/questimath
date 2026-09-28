const test = require('node:test');
const assert = require('node:assert/strict');
const {
  ROUND_SECONDS,
  secondsRemaining,
  awardBonus,
  loadHighScore,
  saveHighScore
} = require('../blitz-mode.js');

test('countdown uses the deadline after delayed ticks', () => {
  const deadline = 1000 + ROUND_SECONDS * 1000;
  assert.equal(secondsRemaining(deadline, 1000), 60);
  assert.equal(secondsRemaining(deadline, 2250), 59);
  assert.equal(secondsRemaining(deadline, deadline), 0);
  assert.equal(secondsRemaining(deadline, deadline + 10000), 0);
});

test('rapid correct answers extend the deadline by two seconds', () => {
  assert.equal(awardBonus(60000, true, 4.9), 62000);
  assert.equal(awardBonus(60000, true, 5), 62000);
  assert.equal(awardBonus(60000, true, 5.1), 60000);
  assert.equal(awardBonus(60000, false, 1), 60000);
});

test('high score loads safely and only increases', () => {
  const values = new Map();
  const storage = {
    getItem: key => values.get(key),
    setItem: (key, value) => values.set(key, value)
  };

  assert.equal(loadHighScore(storage), 0);
  assert.equal(saveHighScore(storage, 7, 0), 7);
  assert.equal(loadHighScore(storage), 7);
  assert.equal(saveHighScore(storage, 4, 7), 7);
  assert.equal(loadHighScore(storage), 7);
  values.set('questimath.blitz.highScore.v1', 'broken');
  assert.equal(loadHighScore(storage), 0);
});
