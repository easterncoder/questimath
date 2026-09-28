const test = require('node:test');
const assert = require('node:assert/strict');
const { getFlameTier, vibrateForAnswer } = require('../streak-feedback.js');

test('flame tiers change at streak milestones', () => {
  assert.equal(getFlameTier(0).name, 'Streak');
  assert.equal(getFlameTier(4).name, 'Streak');
  assert.equal(getFlameTier(5).name, 'Orange flame');
  assert.equal(getFlameTier(9).name, 'Orange flame');
  assert.equal(getFlameTier(10).name, 'Purple flame');
  assert.equal(getFlameTier(14).name, 'Purple flame');
  assert.equal(getFlameTier(15).name, 'Blue flame');
});

test('vibration is brief on a correct answer and distinct on a streak break', () => {
  const patterns = [];
  const device = { vibrate: pattern => { patterns.push(pattern); return true; } };

  assert.equal(vibrateForAnswer(true, 0, device), true);
  assert.equal(vibrateForAnswer(false, 3, device), true);
  assert.equal(vibrateForAnswer(false, 0, device), false);
  assert.deepEqual(patterns, [15, [25, 35, 25]]);
  assert.equal(vibrateForAnswer(true, 0, {}), false);
});
