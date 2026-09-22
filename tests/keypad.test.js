const test = require('node:test');
const assert = require('node:assert/strict');
const keypadModule = require('../keypad.js');

test('keypad exports KEY_VALUES list of 12 keys', () => {
  assert.equal(keypadModule.KEY_VALUES.length, 12);
  assert.ok(keypadModule.KEY_VALUES.includes('1'));
  assert.ok(keypadModule.KEY_VALUES.includes('.'));
  assert.ok(keypadModule.KEY_VALUES.includes('0'));
  assert.ok(keypadModule.KEY_VALUES.includes('BACKSPACE'));
});

test('Keypad component renders element structure with mock React', () => {
  let createdElements = [];

  const mockReact = {
    createElement: (type, props, ...children) => {
      const element = { type, props, children };
      createdElements.push(element);
      return element;
    }
  };

  let clickedValue = null;
  const onAnswerInput = (val) => {
    clickedValue = val;
  };

  const result = keypadModule.Keypad({
    onAnswerInput,
    disabled: false,
    activePadKey: '5',
    React: mockReact
  });

  assert.equal(result.type, 'div');
  assert.equal(result.children.length, 12);

  /* Simulate clicking button '5' */
  const btn5 = result.children.find(child => child.props.key === '5');
  assert.ok(btn5);
  btn5.props.onClick();
  assert.equal(clickedValue, '5');
});
