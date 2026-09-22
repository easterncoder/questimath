(function (root) {
  const OPERATORS = [
    { key: '+', label: 'Addition', symbol: '+' },
    { key: '-', label: 'Subtraction', symbol: '-' },
    { key: '*', label: 'Multiplication', symbol: '×' },
    { key: '/', label: 'Division', symbol: '÷' }
  ];

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
   * StatsDrawer component displaying total solved, accuracy, and per-operator breakdown.
   */
  function StatsDrawer(props) {
    const { solvedHistory, React: ReactRef } = props || {};
    const R = ReactRef || (typeof React !== 'undefined' ? React : null);

    if (!R) {
      return null;
    }

    const createElement = R.createElement;

    const history = solvedHistory || { total: 0, correct: 0, ops: {} };
    const ops = history.ops || {};
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

    return createElement('div', { className: 'bg-slate-900 border border-slate-800 shadow-lg rounded-2xl sm:rounded-3xl p-4 sm:p-5 text-xs' },
      createElement('h3', { className: 'text-md font-bold heading-font text-slate-300 mb-4' }, '📊 Stats'),
      topGrid,
      opBreakdownContainer
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
