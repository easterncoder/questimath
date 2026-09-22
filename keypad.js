(function (root) {
  const KEY_VALUES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'BACKSPACE'];

  /*
   * Keypad component handling numeric and action input buttons.
   */
  function Keypad(props) {
    const { onAnswerInput, disabled, activePadKey, React: ReactRef } = props || {};
    const R = ReactRef || (typeof React !== 'undefined' ? React : null);

    if (!R) {
      return null;
    }

    const createElement = R.createElement;

    const buttons = KEY_VALUES.map(function (value) {
      const isBackspace = value === 'BACKSPACE';
      const isDecimal = value === '.';
      const isActive = activePadKey === value;

      let label;
      let ariaLabel;
      let className = 'active-scale min-h-14 rounded-2xl border text-slate-100 text-xl font-extrabold disabled:opacity-50 disabled:cursor-not-allowed transition-all ';

      if (isBackspace) {
        label = createElement('svg', { className: 'w-6 h-6', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
          createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M20 6H9l-5 6 5 6h11a2 2 0 002-2V8a2 2 0 00-2-2zM12 10l4 4m0-4l-4 4' })
        );
        ariaLabel = 'Backspace';
        className += isActive
          ? 'bg-rose-700 border-rose-400 shadow-lg shadow-rose-500/20 flex items-center justify-center text-rose-300'
          : 'bg-rose-950/60 border-rose-900/30 hover:bg-rose-900/40 flex items-center justify-center text-rose-300';
      } else {
        label = value;
        ariaLabel = isDecimal ? 'Decimal point' : value;
        className += isActive
          ? 'bg-indigo-600 border-indigo-400 shadow-lg shadow-indigo-500/20'
          : 'bg-slate-950 border-slate-800 hover:border-slate-700';
      }

      return createElement('button', {
        key: value,
        type: 'button',
        onClick: function () {
          if (onAnswerInput) {
            onAnswerInput(value);
          }
        },
        disabled: Boolean(disabled),
        'aria-label': ariaLabel,
        title: isBackspace ? 'Backspace' : undefined,
        className: className
      }, label);
    });

    return createElement.apply(R, ['div', { className: 'grid grid-cols-3 gap-2 sm:gap-3' }].concat(buttons));
  }

  const keypad = {
    Keypad,
    KEY_VALUES
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = keypad;
  }

  root.QuestiMathKeypad = keypad;
}(typeof globalThis !== 'undefined' ? globalThis : window));
