(function (root) {
  const OPERATORS = [
    { key: '+', label: 'Addition', symbol: '+' },
    { key: '-', label: 'Subtraction', symbol: '-' },
    { key: '*', label: 'Multiplication', symbol: '×' },
    { key: '/', label: 'Division', symbol: '÷' }
  ];
  const { GRID_SIZE, getFactKey, getGridFact, getFactSummary } = root.QuestiMathFactMastery || require('./fact-mastery.js');
  const STATUS_CLASSES = {
    untried: 'bg-slate-800 text-slate-400 border-slate-700',
    practicing: 'bg-amber-900/70 text-amber-200 border-amber-600',
    mastered: 'bg-emerald-900/70 text-emerald-200 border-emerald-600',
    misses: 'bg-rose-900/70 text-rose-200 border-rose-600'
  };

  /*
   * Calculates accuracy percentage from solved history.
   */
  function calculateAccuracyPercent(solvedHistory) {
    const total = solvedHistory && Number.isFinite(solvedHistory.total) ? solvedHistory.total : 0;
    const correct = solvedHistory && Number.isFinite(solvedHistory.correct) ? solvedHistory.correct : 0;

    if (total <= 0) {
      return 100;
    }

    return Math.round((correct / total) * 100);
  }

  /*
   * Renders one ordered 1 through 12 fact grid with accessible cell buttons.
   */
  function renderFactGrid(createElement, op, facts, selected, setSelected) {
    const numbers = Array.from({ length: GRID_SIZE }, (_, index) => index + 1);
    const cells = [createElement('span', { key: 'corner', 'aria-hidden': 'true' })];

    numbers.forEach(function (column) {
      cells.push(createElement('span', { key: `column-${column}`, className: 'text-center text-slate-400 font-bold' }, column));
    });

    numbers.forEach(function (row) {
      cells.push(createElement('span', { key: `row-${row}`, className: 'flex items-center justify-center text-slate-400 font-bold' }, row));

      numbers.forEach(function (column) {
        const fact = getGridFact(op, row, column);
        const summary = getFactSummary(facts[getFactKey(op, fact.num1, fact.num2)]);
        const isSelected = selected && selected.op === op && selected.row === row && selected.column === column;

        cells.push(createElement('button', {
          key: `${row}-${column}`,
          type: 'button',
          className: `h-9 min-w-9 rounded-md border text-[9px] font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${STATUS_CLASSES[summary.status]} ${isSelected ? 'ring-2 ring-white' : ''}`,
          'aria-label': `${fact.label}: ${summary.status === 'untried' ? 'no attempts' : `${summary.accuracy}% accuracy, ${summary.attempts} attempts`}`,
          'aria-pressed': Boolean(isSelected),
          onClick: function () { setSelected({ op, row, column }); }
        }, summary.attempts ? `${summary.accuracy}%` : '·'));
      });
    });

    return createElement('section', { key: op, className: 'space-y-2' },
      createElement('h4', { className: 'text-[11px] font-bold text-slate-300' }, op === '*' ? 'Multiplication ×' : 'Division ÷'),
      createElement('div', { className: 'overflow-x-auto' },
        createElement.apply(null, ['div', {
          className: 'grid gap-1 text-[10px]',
          style: { gridTemplateColumns: '28px repeat(12, minmax(36px, 1fr))', minWidth: '520px' }
        }].concat(cells))
      )
    );
  }

  /*
   * Renders the selected fact's count, accuracy, and correct-answer speed.
   */
  function renderFactDetails(createElement, selected, facts) {
    if (!selected) {
      return createElement('p', { className: 'text-slate-400 text-[10px]' }, 'Tap a cell to inspect its attempts and accuracy.');
    }

    const fact = getGridFact(selected.op, selected.row, selected.column);
    const summary = getFactSummary(facts[getFactKey(selected.op, fact.num1, fact.num2)]);
    const speed = summary.averageSeconds === null ? 'No correct answers yet' : `${summary.averageSeconds.toFixed(1)}s average correct time`;

    return createElement('p', { className: 'text-slate-200 text-[11px]', 'aria-live': 'polite' },
      `${fact.label}: ${summary.attempts} ${summary.attempts === 1 ? 'attempt' : 'attempts'}, ${summary.accuracy}% accuracy · ${speed}`
    );
  }

  /*
   * StatsDrawer component displaying total solved, accuracy, and per-operator breakdown.
   */
  function StatsDrawer(props) {
    const { solvedHistory, React: ReactRef } = props || {};
    const R = ReactRef || (typeof React !== 'undefined' ? React : null);

    if (!R) {
      return null;
    }

    const createElement = R.createElement;
    const [selectedFact, setSelectedFact] = R.useState(null);

    const history = solvedHistory || { total: 0, correct: 0, ops: {} };
    const ops = history.ops || {};
    const facts = history.facts || {};
    const accuracy = calculateAccuracyPercent(history);

    const totalSolvedBox = createElement('div', { className: 'bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center' },
      createElement('span', { className: 'block text-slate-500 font-bold uppercase text-[9px] mb-1' }, 'Solved'),
      createElement('span', { className: 'text-lg font-black heading-font text-slate-200' }, history.total || 0)
    );

    const accuracyBox = createElement('div', { className: 'bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center' },
      createElement('span', { className: 'block text-slate-500 font-bold uppercase text-[9px] mb-1' }, 'Accuracy'),
      createElement('span', { className: 'text-lg font-black heading-font text-indigo-400' }, `${accuracy}%`)
    );

    const topGrid = createElement('div', { className: 'grid grid-cols-2 gap-3 mb-4' }, totalSolvedBox, accuracyBox);

    const maxCount = Math.max(1, ...Object.values(ops));

    const opRows = OPERATORS.map(function (opObj) {
      const count = ops[opObj.key] || 0;
      const share = history.correct > 0 ? Math.round((count / history.correct) * 100) : 0;
      const widthPercent = Math.round((count / maxCount) * 100);

      const opSymbolSpan = createElement('span', {
        className: 'w-4 h-4 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center font-mono text-[9px]'
      }, opObj.symbol);

      const labelSpan = createElement('span', { className: 'text-slate-400 flex items-center gap-1.5' }, opSymbolSpan, opObj.label);
      const valueSpan = createElement('span', { className: 'text-indigo-300' }, `${count} Correct · ${share}%`);
      const rowHeader = createElement('div', { className: 'flex justify-between items-center text-[11px] font-bold' }, labelSpan, valueSpan);

      const progressBarInner = createElement('div', {
        className: 'h-full rounded-full bg-indigo-500',
        style: { width: `${widthPercent}%` }
      });

      const progressBarOuter = createElement('div', { className: 'h-1.5 rounded-full bg-slate-900 overflow-hidden' }, progressBarInner);

      return createElement('div', { key: opObj.key, className: 'space-y-1.5' }, rowHeader, progressBarOuter);
    });

    const opBreakdownContainer = createElement.apply(R, ['div', { className: 'space-y-2 bg-slate-950 p-3 rounded-2xl border border-slate-800' },
      createElement('span', { className: 'block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1' }, 'By Operator')
    ].concat(opRows));

    const heatmap = createElement('div', { className: 'mt-4 space-y-4 bg-slate-950 p-3 rounded-2xl border border-slate-800' },
      createElement('h3', { className: 'text-[11px] font-bold text-slate-200' }, 'Facts 1 to 12'),
      createElement('p', { className: 'text-[10px] text-slate-400' }, 'Rows and columns show factors. Division cells show (row × column) ÷ column.'),
      renderFactGrid(createElement, '*', facts, selectedFact, setSelectedFact),
      renderFactGrid(createElement, '/', facts, selectedFact, setSelectedFact),
      createElement('p', { className: 'text-[10px] text-slate-400' }, 'Green: 3+ attempts, 90%+ accuracy, 5s or faster · Yellow: practicing or slow · Red: frequent misses below 70% · Gray: untried'),
      renderFactDetails(createElement, selectedFact, facts)
    );

    return createElement('div', { className: 'bg-slate-900 border border-slate-800 shadow-lg rounded-2xl sm:rounded-3xl p-4 sm:p-5 text-xs' },
      createElement('h3', { className: 'text-md font-bold heading-font text-slate-300 mb-4' }, '📊 Stats'),
      topGrid,
      opBreakdownContainer,
      heatmap
    );
  }

  const statsDrawer = {
    StatsDrawer,
    calculateAccuracyPercent
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = statsDrawer;
  }

  root.QuestiMathStatsDrawer = statsDrawer;
}(typeof globalThis !== 'undefined' ? globalThis : window));
