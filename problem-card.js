(function (root) {
  /*
   * ProblemCard component displaying problem operands, input, and feedback.
   */
  function ProblemCard(props) {
    const {
      currentProblem,
      userAnswer,
      inputRef,
      feedback,
      continueCountdown,
      onCheckAnswer,
      onNextProblem,
      loadingProgress,
      React: ReactRef
    } = props || {};

    const R = ReactRef || (typeof React !== 'undefined' ? React : null);
    if (!R) {
      return null;
    }
    const createElement = R.createElement;

    if (loadingProgress || !currentProblem) {
      return null;
    }

    const equations = root.QuestiMathEquations || require('./problem-equation');
    const equationParts = equations.getEquationParts(currentProblem);
    const answerIndex = currentProblem.missingOperand === 'num1' ? 0 : currentProblem.missingOperand === 'num2' ? 2 : 4;

    const isSuccess = feedback && feedback.status === 'success';
    const isError = feedback && feedback.status === 'error';

    const inputClassName = 'w-[clamp(9.5rem,42vw,16rem)] max-w-full px-3 py-2 text-center rounded-2xl bg-slate-950 border text-slate-100 font-extrabold leading-none focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ' +
      (isSuccess ? 'border-emerald-500 text-emerald-400 ring-4 ring-emerald-500/10' :
       isError ? 'border-rose-500 text-rose-400 ring-4 ring-rose-500/10' :
       'border-slate-700 hover:border-slate-600');

    const inputElement = createElement('input', {
      ref: inputRef,
      type: 'text',
      inputMode: 'none',
      pattern: '[0-9]*',
      placeholder: '?',
      value: userAnswer || '',
      readOnly: true,
      disabled: Boolean(feedback && feedback.status !== null),
      'aria-label': 'Answer',
      className: inputClassName
    });

    const problemDisplay = createElement('div', {
      className: 'flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-4xl sm:text-5xl font-black tracking-tight font-mono text-center my-2 sm:my-4'
    }, ...equationParts.map((part, index) => index === answerIndex
      ? inputElement
      : createElement('span', {
          key: index,
          className: index === 1 ? 'text-indigo-400 scale-95' : index === 3 ? 'text-slate-400 font-medium scale-90' : 'bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent'
        }, String(part))));

    const actionButtonContainer = createElement('div', { className: 'mt-4' },
      (feedback && feedback.status)
        ? createElement('button', {
            onClick: onNextProblem,
            className: 'w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition-all py-4 px-6 rounded-2xl font-bold tracking-wide shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2'
          },
          createElement('span', null, `Next Quest${continueCountdown !== null && continueCountdown !== undefined ? ` (${continueCountdown})` : ''}`),
          createElement('svg', { className: 'w-5 h-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
            createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M14 5l7 7m0 0l-7 7m7-7H3' })
          )
        )
        : createElement('button', {
            onClick: onCheckAnswer,
            className: 'w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-95 transition-all py-4 px-6 rounded-2xl font-bold tracking-wide shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2'
          },
          createElement('span', null, 'Verify Spell'),
          createElement('svg', { className: 'w-5 h-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
            createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })
          )
        )
    );

    const feedbackCard = feedback ? createElement('div', {
      className: `mt-8 p-5 rounded-2xl border transition-all duration-300 ${
        isSuccess
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
      }`
    },
      createElement('h4', { className: 'text-md font-bold heading-font flex items-center gap-2 mb-1.5' },
        isSuccess ? '🎉 Perfect Cast!' : '⚡ Miscast! Hint Recalled:'
      ),
      createElement('p', { className: 'text-xs sm:text-sm font-semibold opacity-90' }, feedback.text),
      feedback.hint ? createElement('div', {
        className: 'mt-4 pt-4 border-t border-rose-500/20 bg-slate-950/60 p-4 rounded-xl text-slate-300 text-xs sm:text-sm whitespace-pre-line leading-relaxed font-mono'
      }, feedback.hint) : null
    ) : null;

    return createElement('div', { className: 'problem-card-wrapper' }, problemDisplay, actionButtonContainer, feedbackCard);
  }

  const problemCard = {
    ProblemCard
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = problemCard;
  }

  root.QuestiMathProblemCard = problemCard;
}(typeof globalThis !== 'undefined' ? globalThis : window));
