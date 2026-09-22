const test = require('node:test');
const assert = require('node:assert/strict');
const statsDrawerModule = require('../stats-drawer.js');

test('calculateAccuracyPercent returns bounded percentages', () => {
  assert.equal(statsDrawerModule.calculateAccuracyPercent({ total: 0, correct: 0 }), 100);
  assert.equal(statsDrawerModule.calculateAccuracyPercent({ total: 10, correct: 8 }), 80);
  assert.equal(statsDrawerModule.calculateAccuracyPercent({ total: 3, correct: 1 }), 33);
});

test('StatsDrawer renders solved stats and operator rows with mock React', () => {
  let createdElements = [];
  const mockReact = {
    createElement: (type, props, ...children) => {
      const element = { type, props, children };
      createdElements.push(element);
      return element;
    }
  };

  const solvedHistory = {
    total: 20,
    correct: 18,
    ops: { '+': 10, '-': 5, '*': 3, '/': 0 }
  };

  const result = statsDrawerModule.StatsDrawer({
    solvedHistory,
    React: mockReact
  });

  assert.ok(result);
  assert.equal(result.type, 'div');
  assert.equal(result.children.length, 3); // h3, topGrid, opBreakdownContainer
});
