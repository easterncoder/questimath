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
    useState: () => [null, () => {}],
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
  assert.equal(result.children.length, 4);
  const heatmap = result.children[3];
  const grids = heatmap.children.filter(child => child.type === 'section');
  assert.equal(grids.length, 2);
  grids.forEach(grid => {
    const cells = grid.children[1].children[0].children;
    assert.equal(cells.filter(cell => cell.type === 'button').length, 144);
  });
});

test('StatsDrawer exposes fact details on a grid cell', () => {
  let selected = null;
  const mockReact = {
    useState: () => [selected, value => { selected = value; }],
    createElement: (type, props, ...children) => ({ type, props, children })
  };
  const solvedHistory = {
    total: 2,
    correct: 1,
    ops: { '*': 1 },
    facts: { '*:1:1': { attempts: 2, correct: 1, correctSeconds: 4 } }
  };

  let drawer = statsDrawerModule.StatsDrawer({ solvedHistory, React: mockReact });
  const firstCell = drawer.children[3].children[2].children[1].children[0].children[14];
  assert.equal(firstCell.type, 'button');
  assert.match(firstCell.props['aria-label'], /50% accuracy, 2 attempts/);
  firstCell.props.onClick();

  drawer = statsDrawerModule.StatsDrawer({ solvedHistory, React: mockReact });
  assert.match(drawer.children[3].children[5].children[0], /1 × 1: 2 attempts, 50% accuracy/);
  assert.match(drawer.children[3].children[5].children[0], /4.0s average correct time/);
});
