const test = require('node:test');
const assert = require('node:assert/strict');
const { getFactKey, getGridFact, recordFactAttempt, getFactSummary } = require('../fact-mastery.js');

test('records ordered multiplication and division attempts with correct timing', () => {
  let facts = recordFactAttempt({}, { op: '*', num1: 3, num2: 4 }, false, 8);
  facts = recordFactAttempt(facts, { op: '*', num1: 3, num2: 4 }, true, 4);
  facts = recordFactAttempt(facts, { op: '/', num1: 12, num2: 4 }, true, 6);

  assert.deepEqual(facts['*:3:4'], { attempts: 2, correct: 1, correctSeconds: 4 });
  assert.deepEqual(facts['/:12:4'], { attempts: 1, correct: 1, correctSeconds: 6 });
  assert.equal(facts['*:4:3'], undefined);
  assert.equal(getFactKey('/', 12, 4), '/:12:4');
});

test('maps division rows to quotient and columns to divisor', () => {
  assert.deepEqual(getGridFact('/', 3, 4), { num1: 12, num2: 4, label: '12 ÷ 4' });
  assert.deepEqual(getGridFact('*', 3, 4), { num1: 3, num2: 4, label: '3 × 4' });
});

test('classifies untried, slow, mastered, and frequently missed facts', () => {
  assert.equal(getFactSummary(undefined).status, 'untried');
  assert.equal(getFactSummary({ attempts: 1, correct: 1, correctSeconds: 8 }).status, 'practicing');
  assert.equal(getFactSummary({ attempts: 3, correct: 3, correctSeconds: 12 }).status, 'mastered');
  assert.equal(getFactSummary({ attempts: 3, correct: 3, correctSeconds: 18 }).status, 'practicing');
  assert.equal(getFactSummary({ attempts: 3, correct: 1, correctSeconds: 4 }).status, 'misses');
});

test('ignores facts outside the 1 through 12 matrix', () => {
  const facts = { '*:2:2': { attempts: 1, correct: 1, correctSeconds: 3 } };
  assert.equal(recordFactAttempt(facts, { op: '*', num1: 13, num2: 2 }, true, 2), facts);
  assert.equal(recordFactAttempt(facts, { op: '/', num1: 13, num2: 2 }, true, 2), facts);
  assert.equal(recordFactAttempt(facts, { op: '+', num1: 2, num2: 2 }, true, 2), facts);
});
