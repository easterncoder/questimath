const assert = require('assert');
const { getDueReview, recordMiss, recordCorrectReview } = require('../spaced-repetition');

const problem = { num1: 4, num2: 5, op: '+', answer: 9 };
const missed = recordMiss([], problem, 10, 12, 'miss-1');

assert.strictEqual(getDueReview(missed, 12), null);
assert.strictEqual(getDueReview(missed, 13).id, 'miss-1');

const firstCorrect = recordCorrectReview(missed, 'miss-1', 13);
assert.strictEqual(firstCorrect[0].correctReviews, 1);
assert.strictEqual(getDueReview(firstCorrect, 19), null);
assert.strictEqual(getDueReview(firstCorrect, 20).id, 'miss-1');
assert.deepStrictEqual(recordCorrectReview(firstCorrect, 'miss-1', 20), []);

const wrongReview = recordMiss(firstCorrect, { ...problem, reviewId: 'miss-1' }, 20, 12, 'unused');
assert.strictEqual(wrongReview.length, 1);
assert.strictEqual(wrongReview[0].correctReviews, 0);
assert.strictEqual(getDueReview(wrongReview, 23).id, 'miss-1');

const manualReview = recordCorrectReview(missed, 'miss-1', 11);
assert.strictEqual(getDueReview(manualReview, 17), null);
assert.strictEqual(getDueReview(manualReview, 18).id, 'miss-1');
assert.strictEqual(getDueReview([{ ...problem, id: 'legacy' }], 0).id, 'legacy');
assert.deepStrictEqual(recordCorrectReview(missed, null, 13), missed);

console.log('spaced repetition tests passed');
