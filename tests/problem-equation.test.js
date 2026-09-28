const test = require('node:test');
const assert = require('node:assert/strict');
const { isCorrectAnswer } = require('../answer-validation');
const { makeMissingOperandProblem, selectQuestionForm, getEquationParts, formatEquation } = require('../problem-equation');

test('missing operand templates preserve the result and validate the hidden value', () => {
  const examples = [
    { op: '+', num1: 7, num2: 5, answer: 12, missingOperand: 'num2', equation: '7 + ? = 12' },
    { op: '-', num1: 11, num2: 4, answer: 7, missingOperand: 'num1', equation: '? - 4 = 7' },
    { op: '*', num1: 6, num2: 8, answer: 48, missingOperand: 'num1', equation: '? × 8 = 48' },
    { op: '/', num1: 42, num2: 7, answer: 6, missingOperand: 'num2', equation: '42 ÷ ? = 6' }
  ];

  for (const { missingOperand, equation, ...standard } of examples) {
    const missing = makeMissingOperandProblem(standard);

    assert.equal(missing.missingOperand, missingOperand);
    assert.equal(missing.result, standard.answer);
    assert.equal(missing.answer, standard[missingOperand]);
    assert.equal(formatEquation(missing), equation);
    assert.equal(isCorrectAnswer(String(missing.answer), missing.answer), true);
    assert.equal(isCorrectAnswer(String(standard.answer), missing.answer), standard.answer === missing.answer);
  }
});

test('adventure introduces missing operands at rank three and practice requires opt in', () => {
  const standard = { op: '+', num1: 7, num2: 5, answer: 12 };
  const chooseMissing = () => 0;

  assert.equal(selectQuestionForm(standard, 'adventure', 2, false, chooseMissing), standard);
  assert.equal(selectQuestionForm(standard, 'adventure', 3, false, chooseMissing).missingOperand, 'num2');
  assert.equal(selectQuestionForm(standard, 'practice', 5, false, chooseMissing), standard);
  assert.equal(selectQuestionForm(standard, 'practice', 1, true, chooseMissing).missingOperand, 'num2');
  assert.equal(selectQuestionForm(standard, 'practice', 1, true, () => 0.9), standard);
});

test('equation parts support entered answers and saved standard questions', () => {
  const standard = { op: '-', num1: 9, num2: 4, answer: 5 };
  const missing = makeMissingOperandProblem(standard);

  assert.deepEqual(getEquationParts(missing, '8'), ['8', '-', 4, '=', 5]);
  assert.equal(formatEquation(missing, '8'), '8 - 4 = 5');
  assert.equal(formatEquation(standard, '5'), '9 - 4 = 5');
});
