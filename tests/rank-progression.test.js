const assert = require('assert');
const {
  RANKS,
  getRank,
  getRankProgressPercent,
  getRankXpGoal,
  getRankXpStart,
  normalizeLevel
} = require('../rank-progression');

assert.strictEqual(normalizeLevel(0), 1);
assert.strictEqual(normalizeLevel('4'), 4);
assert.strictEqual(normalizeLevel('abc'), 1);

assert.strictEqual(getRank(1).name, 'Arithmetic Squire');
assert.strictEqual(getRank(10).name, 'Infinity Archmage');
assert.strictEqual(getRank(11).level, 11);
assert.strictEqual(getRank(11).name, 'Prime Solver 1');
assert.strictEqual(getRank(16).name, 'Prime Strategist 1');
assert.strictEqual(getRank(36).name, 'Prime Solver 2');
assert.notStrictEqual(getRank(11).color, '');

assert.strictEqual(getRankXpStart(1), 0);
assert.strictEqual(getRankXpStart(8), 700);
assert.strictEqual(getRankXpGoal(1), 100);
assert.strictEqual(getRankXpGoal(8), 800);

assert.strictEqual(getRankProgressPercent(1, 0), 0);
assert.strictEqual(getRankProgressPercent(1, 50), 50);
assert.strictEqual(getRankProgressPercent(4, 450), 100);
assert.strictEqual(getRankProgressPercent(4, 250), 0);

assert.ok(RANKS.length > 5);

console.log('rank progression tests passed');
