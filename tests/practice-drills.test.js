const assert = require('assert');
const { TABLE_NUMBERS, buildTargetedProblem } = require('../practice-drills');

assert.deepStrictEqual(TABLE_NUMBERS, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
assert.strictEqual(buildTargetedProblem('+', [7], () => 0), null);
assert.strictEqual(buildTargetedProblem('*', [], () => 0), null);
assert.deepStrictEqual(buildTargetedProblem('*', [7], () => 0), {
  num1: 7,
  num2: 1,
  answer: 7
});
assert.deepStrictEqual(buildTargetedProblem('/', [8], () => 0.99), {
  num1: 96,
  num2: 8,
  answer: 12
});
assert.deepStrictEqual(buildTargetedProblem('*', [7, 8], () => 0.99), {
  num1: 8,
  num2: 12,
  answer: 96
});

for (const target of TABLE_NUMBERS) {
  for (let partnerIndex = 0; partnerIndex < TABLE_NUMBERS.length; partnerIndex += 1) {
    const randomValues = [0, partnerIndex / TABLE_NUMBERS.length];
    const random = () => randomValues.shift();
    const multiplication = buildTargetedProblem('*', [target], random);
    const division = buildTargetedProblem('/', [target], () => partnerIndex / TABLE_NUMBERS.length);

    assert.strictEqual(multiplication.num1, target);
    assert.strictEqual(multiplication.num2, partnerIndex + 1);
    assert.strictEqual(multiplication.answer, target * (partnerIndex + 1));
    assert.strictEqual(division.num2, target);
    assert.strictEqual(division.answer, partnerIndex + 1);
    assert.strictEqual(division.num1, target * (partnerIndex + 1));
  }
}

console.log('practice drills tests passed');
