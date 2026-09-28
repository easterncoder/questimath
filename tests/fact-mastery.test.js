const test = require('node:test');
const assert = require('node:assert/strict');
const {
  getFactKey,
  getGridFact,
  getRandomPracticeFact,
  recordFactAttempt,
  getFactSummary
} = require('../fact-mastery.js');

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

test('practice fact generation covers every multiplication and division grid cell', () => {
  for (let row = 1; row <= 12; row += 1) {
    for (let column = 1; column <= 12; column += 1) {
      const createRandom = () => {
        const values = [(row - 1) / 12, (column - 1) / 12];
        return () => values.shift();
      };

      assert.deepEqual(
        getRandomPracticeFact('*', createRandom()),
        { num1: row, num2: column, answer: row * column }
      );
      assert.deepEqual(
        getRandomPracticeFact('/', createRandom()),
        { num1: row * column, num2: column, answer: row }
      );
    }
  }
  assert.equal(getRandomPracticeFact('+'), null);
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
