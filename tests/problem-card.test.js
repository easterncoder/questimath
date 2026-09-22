const test = require('node:test');
const assert = require('node:assert/strict');
const problemCardModule = require('../problem-card.js');

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
