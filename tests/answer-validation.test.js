const assert = require('assert');
const { isCorrectAnswer, parseAnswer } = require('../answer-validation');

assert.strictEqual(parseAnswer(''), null);
assert.strictEqual(parseAnswer('   '), null);
assert.strictEqual(parseAnswer('abc'), null);
assert.strictEqual(parseAnswer('12abc'), null);
assert.strictEqual(parseAnswer('12'), 12);
assert.strictEqual(parseAnswer(' 12 '), 12);
assert.strictEqual(parseAnswer('-4'), -4);
assert.strictEqual(parseAnswer('3.5'), 3.5);

assert.strictEqual(isCorrectAnswer('12', 12), true);
assert.strictEqual(isCorrectAnswer(' 12 ', 12), true);
assert.strictEqual(isCorrectAnswer('13', 12), false);
assert.strictEqual(isCorrectAnswer('', 12), false);
assert.strictEqual(isCorrectAnswer('abc', 12), false);
assert.strictEqual(isCorrectAnswer('3.5', 3.5), true);
assert.strictEqual(isCorrectAnswer('3.50', 3.5), true);
assert.strictEqual(isCorrectAnswer('3.51', 3.5), false);

console.log('answer validation tests passed');
