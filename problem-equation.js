(function (root) {
  const MISSING_OPERANDS = { '+': 'num2', '-': 'num1', '*': 'num1', '/': 'num2' };

  /*
   * Replaces one operand with the answer while preserving the equation result.
   */
  function makeMissingOperandProblem(problem) {
    const missingOperand = MISSING_OPERANDS[problem.op];

    if (!missingOperand) {
      return problem;
    }

    return {
      ...problem,
      missingOperand,
      result: problem.answer,
      answer: problem[missingOperand]
    };
  }

  /*
   * Selects the question form for the current mode and difficulty.
   */
  function selectQuestionForm(problem, mode, level, practiceEnabled, random = Math.random) {
    const allowed = mode === 'adventure' ? level >= 3 : practiceEnabled;

    return allowed && MISSING_OPERANDS[problem.op] && random() < 0.4
      ? makeMissingOperandProblem(problem)
      : problem;
  }

  /*
   * Returns equation parts with the supplied value in the answer position.
   */
  function getEquationParts(problem, value = '?') {
    const symbol = problem.op === '*' ? '×' : problem.op === '/' ? '÷' : problem.op;

    return [
      problem.missingOperand === 'num1' ? value : problem.num1,
      symbol,
      problem.missingOperand === 'num2' ? value : problem.num2,
      '=',
      problem.missingOperand ? problem.result : value
    ];
  }

  /*
   * Formats an equation for compact history and review displays.
   */
  function formatEquation(problem, value = '?') {
    return getEquationParts(problem, value).join(' ');
  }

  const equations = { makeMissingOperandProblem, selectQuestionForm, getEquationParts, formatEquation };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = equations;
  }

  root.QuestiMathEquations = equations;
}(typeof globalThis !== 'undefined' ? globalThis : window));
