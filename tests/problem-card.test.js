const test = require('node:test');
const assert = require('node:assert/strict');
const problemCardModule = require('../problem-card.js');
const { makeMissingOperandProblem } = require('../problem-equation.js');

test('ProblemCard returns null when loading or no problem provided', () => {
  const mockReact = { createElement: () => ({}) };

  assert.equal(problemCardModule.ProblemCard({ loadingProgress: true, currentProblem: { num1: 5, num2: 3, op: '+' }, React: mockReact }), null);
  assert.equal(problemCardModule.ProblemCard({ loadingProgress: false, currentProblem: null, React: mockReact }), null);
});

test('ProblemCard renders problem structure and handles clicks with mock React', () => {
  let createdElements = [];
  const mockReact = {
    createElement: (type, props, ...children) => {
      const element = { type, props, children };
      createdElements.push(element);
      return element;
    }
  };

  let verified = false;
  const onCheckAnswer = () => {
    verified = true;
  };

  const result = problemCardModule.ProblemCard({
    loadingProgress: false,
    currentProblem: { num1: 7, num2: 8, op: '*' },
    userAnswer: '56',
    feedback: null,
    onCheckAnswer,
    React: mockReact
  });

  assert.ok(result);
  assert.equal(result.type, 'div');

  /* Find Verify Spell action button container and click action button */
  const actionContainer = result.children[1];
  assert.ok(actionContainer);
  const verifyBtn = actionContainer.children[0];
  assert.ok(verifyBtn);
  verifyBtn.props.onClick();
  assert.equal(verified, true);
});

test('ProblemCard moves the same keypad input into the missing operand slot', () => {
  const mockReact = {
    createElement: (type, props, ...children) => ({ type, props, children })
  };
  const currentProblem = makeMissingOperandProblem({ num1: 11, num2: 4, op: '-', answer: 7 });
  const card = problemCardModule.ProblemCard({ currentProblem, userAnswer: '11', React: mockReact });
  const parts = card.children[0].children;

  assert.equal(parts[0].type, 'input');
  assert.equal(parts[0].props.value, '11');
  assert.equal(parts[4].children[0], '7');
  assert.equal(parts.filter(part => part.type === 'input').length, 1);
});
